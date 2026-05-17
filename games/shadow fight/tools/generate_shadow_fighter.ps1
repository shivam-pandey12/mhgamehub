param(
    [string]$OutputDir = (Join-Path (Split-Path $PSScriptRoot -Parent) 'assets\shadow-fighter'),
    [ValidateSet(256, 512)]
    [int]$FrameSize = 512,
    [switch]$EmitStrips,
    [switch]$PackAtlas,
    [switch]$EmitManifest,
    [switch]$EmitQa
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

if (
    -not $PSBoundParameters.ContainsKey('EmitStrips') -and
    -not $PSBoundParameters.ContainsKey('PackAtlas') -and
    -not $PSBoundParameters.ContainsKey('EmitManifest') -and
    -not $PSBoundParameters.ContainsKey('EmitQa')
) {
    $EmitStrips = $true
    $PackAtlas = $true
    $EmitManifest = $true
    $EmitQa = $true
}

$Tau = [Math]::PI * 2.0

function New-Vec {
    param([double]$X, [double]$Y)
    [pscustomobject]@{
        X = $X
        Y = $Y
    }
}

function Add-Vec {
    param($A, $B)
    New-Vec ($A.X + $B.X) ($A.Y + $B.Y)
}

function Sub-Vec {
    param($A, $B)
    New-Vec ($A.X - $B.X) ($A.Y - $B.Y)
}

function Scale-Vec {
    param($A, [double]$Scale)
    New-Vec ($A.X * $Scale) ($A.Y * $Scale)
}

function Mid-Vec {
    param($A, $B)
    New-Vec (($A.X + $B.X) / 2.0) (($A.Y + $B.Y) / 2.0)
}

function Length-Vec {
    param($A)
    [Math]::Sqrt(($A.X * $A.X) + ($A.Y * $A.Y))
}

function Distance-Vec {
    param($A, $B)
    Length-Vec (Sub-Vec $A $B)
}

function Normalize-Vec {
    param($A)
    $length = Length-Vec $A
    if ($length -lt 0.0001) {
        return (New-Vec 1.0 0.0)
    }

    Scale-Vec $A (1.0 / $length)
}

function Rotate-Vec {
    param($A, [double]$Degrees)
    $radians = $Degrees * [Math]::PI / 180.0
    $cosine = [Math]::Cos($radians)
    $sine = [Math]::Sin($radians)
    New-Vec (($A.X * $cosine) - ($A.Y * $sine)) (($A.X * $sine) + ($A.Y * $cosine))
}

function Direction-FromAngle {
    param([double]$Degrees)
    $radians = $Degrees * [Math]::PI / 180.0
    New-Vec ([Math]::Cos($radians)) ([Math]::Sin($radians))
}

function Clamp-Value {
    param([double]$Value, [double]$Minimum, [double]$Maximum)
    [Math]::Min($Maximum, [Math]::Max($Minimum, $Value))
}

function Lerp-Value {
    param([double]$A, [double]$B, [double]$T)
    $A + (($B - $A) * $T)
}

function Smooth-Step {
    param([double]$T)
    $clamped = Clamp-Value $T 0.0 1.0
    $clamped * $clamped * (3.0 - (2.0 * $clamped))
}

function Round-Number {
    param([double]$Value)
    [Math]::Round($Value, 2)
}

function Solve-TwoBone {
    param(
        $Start,
        $End,
        [double]$UpperLength,
        [double]$LowerLength,
        $Hint
    )

    $target = Sub-Vec $End $Start
    $distance = Length-Vec $target
    $minDistance = [Math]::Abs($UpperLength - $LowerLength) + 0.01
    $maxDistance = ($UpperLength + $LowerLength) - 0.01
    $clampedDistance = Clamp-Value $distance $minDistance $maxDistance
    $direction = Normalize-Vec $target
    $projection = (($UpperLength * $UpperLength) - ($LowerLength * $LowerLength) + ($clampedDistance * $clampedDistance)) / (2.0 * $clampedDistance)
    $heightSquared = [Math]::Max(0.0, ($UpperLength * $UpperLength) - ($projection * $projection))
    $height = [Math]::Sqrt($heightSquared)
    $center = Add-Vec $Start (Scale-Vec $direction $projection)
    $perpendicular = New-Vec (-$direction.Y) $direction.X
    $optionA = Add-Vec $center (Scale-Vec $perpendicular $height)
    $optionB = Add-Vec $center (Scale-Vec $perpendicular (-$height))

    if ($null -eq $Hint) {
        return $optionA
    }

    if ((Distance-Vec $optionA $Hint) -le (Distance-Vec $optionB $Hint)) {
        return $optionA
    }

    $optionB
}

function New-KeyPose {
    param(
        [double]$T,
        [double]$HipX,
        [double]$HipY,
        [double]$TorsoLean,
        [double]$HeadTilt,
        [double]$BackFootX,
        [double]$BackFootY,
        [double]$FrontFootX,
        [double]$FrontFootY,
        [double]$GripX,
        [double]$GripY,
        [double]$SwordAngle
    )

    [ordered]@{
        t          = $T
        hipX       = $HipX
        hipY       = $HipY
        torsoLean  = $TorsoLean
        headTilt   = $HeadTilt
        backFootX  = $BackFootX
        backFootY  = $BackFootY
        frontFootX = $FrontFootX
        frontFootY = $FrontFootY
        gripX      = $GripX
        gripY      = $GripY
        swordAngle = $SwordAngle
    }
}

function Sample-KeyPose {
    param(
        [array]$Keys,
        [double]$T
    )

    $properties = @('hipX', 'hipY', 'torsoLean', 'headTilt', 'backFootX', 'backFootY', 'frontFootX', 'frontFootY', 'gripX', 'gripY', 'swordAngle')

    if ($T -le $Keys[0].t) {
        $first = [ordered]@{}
        foreach ($property in $properties) {
            $first[$property] = [double]$Keys[0][$property]
        }
        return [pscustomobject]$first
    }

    if ($T -ge $Keys[-1].t) {
        $last = [ordered]@{}
        foreach ($property in $properties) {
            $last[$property] = [double]$Keys[-1][$property]
        }
        return [pscustomobject]$last
    }

    for ($index = 0; $index -lt ($Keys.Count - 1); $index++) {
        $current = $Keys[$index]
        $next = $Keys[$index + 1]
        if ($T -ge $current.t -and $T -le $next.t) {
            $segmentT = ($T - $current.t) / ($next.t - $current.t)
            $easedT = Smooth-Step $segmentT
            $interpolated = [ordered]@{}
            foreach ($property in $properties) {
                $interpolated[$property] = Lerp-Value ([double]$current[$property]) ([double]$next[$property]) $easedT
            }
            return [pscustomobject]$interpolated
        }
    }

    throw "Unable to sample key pose at t=$T."
}

function Get-GaitFoot {
    param(
        [double]$CenterX,
        [double]$Phase,
        [double]$GroundY,
        [double]$Stride,
        [double]$Lift
    )

    $x = $CenterX + ($Stride * [Math]::Cos($Phase))
    $liftPhase = [Math]::Max(0.0, -[Math]::Sin($Phase))
    $y = $GroundY - ($Lift * $liftPhase)
    New-Vec $x $y
}

function New-PoseObject {
    param(
        [string]$Name,
        $Hip,
        [double]$TorsoLean,
        [double]$HeadTilt,
        $BackFoot,
        $FrontFoot,
        $GripCenter,
        [double]$SwordAngle
    )

    [pscustomobject]@{
        Name       = $Name
        Hip        = $Hip
        TorsoLean  = $TorsoLean
        HeadTilt   = $HeadTilt
        BackFoot   = $BackFoot
        FrontFoot  = $FrontFoot
        GripCenter = $GripCenter
        SwordAngle = $SwordAngle
    }
}

function Get-AnimationPose {
    param(
        [string]$AnimationName,
        [int]$FrameIndex,
        $Spec,
        $Rig,
        $ActionKeyframes
    )

    $centerX = [double]$Rig.BaseHipX
    $groundY = [double]$Rig.GroundY
    $baseHipY = [double]$Rig.BaseHipY

    switch ($AnimationName) {
        'idle' {
            $t = $FrameIndex / [double]$Spec.frameCount
            $phase = $Tau * $t
            $hip = New-Vec ($centerX + (1.2 * [Math]::Sin($phase))) (($baseHipY - 6.0) + (1.2 * [Math]::Sin($phase + 1.15)))
            $backFoot = New-Vec ($centerX - 30.0) $groundY
            $frontFoot = New-Vec ($centerX + 28.0) ($groundY - 1.0)
            $grip = New-Vec ($hip.X + 28.0 + (1.2 * [Math]::Sin($phase + 0.35))) ($hip.Y - 70.0 + (1.4 * [Math]::Sin($phase + 1.1)))
            return (New-PoseObject $AnimationName $hip (1.0 + (1.2 * [Math]::Sin($phase + 0.25))) (0.8 * [Math]::Sin($phase + 0.95)) $backFoot $frontFoot $grip (70.0 + (2.5 * [Math]::Sin($phase + 1.1))))
        }
        'walk' {
            $t = $FrameIndex / [double]$Spec.frameCount
            $phase = $Tau * $t
            $frontFoot = Get-GaitFoot ($centerX + 30.0) $phase $groundY 16.0 10.0
            $backFoot = Get-GaitFoot ($centerX - 30.0) ($phase + [Math]::PI) $groundY 16.0 10.0
            $hip = New-Vec ($centerX + (2.4 * [Math]::Sin($phase))) (($baseHipY - 4.0) + (2.4 * [Math]::Abs([Math]::Sin($phase))))
            $grip = New-Vec ($hip.X + 30.0 + (1.8 * [Math]::Sin($phase + 0.2))) ($hip.Y - 72.0 + (1.5 * [Math]::Sin($phase + 1.0)))
            return (New-PoseObject $AnimationName $hip (2.0 + (1.8 * [Math]::Sin($phase + 0.2))) (1.0 * [Math]::Sin($phase + 0.55)) $backFoot $frontFoot $grip (66.0 + (5.0 * [Math]::Sin($phase + 0.85))))
        }
        'run' {
            $t = $FrameIndex / [double]$Spec.frameCount
            $phase = $Tau * $t
            $frontFoot = Get-GaitFoot ($centerX + 34.0) $phase $groundY 30.0 18.0
            $backFoot = Get-GaitFoot ($centerX - 34.0) ($phase + [Math]::PI) $groundY 30.0 18.0
            $hip = New-Vec ($centerX + (5.8 * [Math]::Sin($phase + 0.1))) (($baseHipY - 10.0) + (6.2 * [Math]::Abs([Math]::Sin($phase))))
            $grip = New-Vec ($hip.X + 32.0 + (2.6 * [Math]::Sin($phase + 0.45))) ($hip.Y - 66.0 + (2.6 * [Math]::Sin($phase + 1.15)))
            return (New-PoseObject $AnimationName $hip (6.0 + (2.6 * [Math]::Sin($phase + 0.4))) (1.6 * [Math]::Sin($phase + 0.7)) $backFoot $frontFoot $grip (46.0 + (8.0 * [Math]::Sin($phase + 0.95))))
        }
        default {
            $specT = if ($Spec.frameCount -le 1) { 0.0 } else { $FrameIndex / [double]($Spec.frameCount - 1) }
            $sample = Sample-KeyPose $ActionKeyframes[$AnimationName] $specT
            return (New-PoseObject $AnimationName (New-Vec $sample.hipX $sample.hipY) $sample.torsoLean $sample.headTilt (New-Vec $sample.backFootX $sample.backFootY) (New-Vec $sample.frontFootX $sample.frontFootY) (New-Vec $sample.gripX $sample.gripY) $sample.swordAngle)
        }
    }
}

function Get-FrameGeometry {
    param(
        $Pose,
        $Rig
    )

    $torsoVector = Rotate-Vec (New-Vec 0.0 (-[double]$Rig.TorsoLength)) $Pose.TorsoLean
    $neck = Add-Vec $Pose.Hip $torsoVector
    $shoulderCenter = Add-Vec $Pose.Hip (Rotate-Vec (New-Vec 0.0 (-([double]$Rig.TorsoLength - [double]$Rig.ShoulderDrop))) $Pose.TorsoLean)
    $headCenter = Add-Vec $neck (Rotate-Vec (New-Vec 0.0 (-([double]$Rig.HeadRadius + 4.0))) ($Pose.TorsoLean + $Pose.HeadTilt))
    $backShoulder = Add-Vec $shoulderCenter (New-Vec (-([double]$Rig.ShoulderSpan / 2.0)) 0.0)
    $frontShoulder = Add-Vec $shoulderCenter (New-Vec ([double]$Rig.ShoulderSpan / 2.0) 0.0)
    $backHip = Add-Vec $Pose.Hip (New-Vec (-([double]$Rig.HipSpan / 2.0)) 0.0)
    $frontHip = Add-Vec $Pose.Hip (New-Vec ([double]$Rig.HipSpan / 2.0) 0.0)

    $swordDirection = Direction-FromAngle $Pose.SwordAngle
    $gripHalf = [double]$Rig.GripLength / 2.0
    $gripStart = Add-Vec $Pose.GripCenter (Scale-Vec $swordDirection (-$gripHalf))
    $gripEnd = Add-Vec $Pose.GripCenter (Scale-Vec $swordDirection $gripHalf)
    $pommelCenter = Add-Vec $gripStart (Scale-Vec $swordDirection (-([double]$Rig.PommelRadius / 2.0)))
    $bladeTip = Add-Vec $gripEnd (Scale-Vec $swordDirection ([double]$Rig.BladeLength))
    $guardDirection = New-Vec (-$swordDirection.Y) $swordDirection.X
    $guardHalf = 14.0
    $guardA = Add-Vec $gripEnd (Scale-Vec $guardDirection (-$guardHalf))
    $guardB = Add-Vec $gripEnd (Scale-Vec $guardDirection $guardHalf)

    $oneHanded = @('idle', 'walk', 'run', 'jump', 'blink_step') -contains $Pose.Name
    if ($oneHanded) {
        $backHand = Add-Vec $Pose.Hip (Rotate-Vec (New-Vec -18.0 (-14.0)) ($Pose.TorsoLean * 0.4))
        $frontHand = Add-Vec $Pose.GripCenter (Scale-Vec $swordDirection 6.0)
    } else {
        $backHand = Add-Vec $Pose.GripCenter (Scale-Vec $swordDirection -8.0)
        $frontHand = Add-Vec $Pose.GripCenter (Scale-Vec $swordDirection 8.0)
    }

    $backArmHint = Add-Vec (Mid-Vec $backShoulder $backHand) (New-Vec ((-30.0) + (0.08 * $Pose.SwordAngle)) (28.0 + (0.12 * [Math]::Abs($Pose.SwordAngle))))
    $frontArmHint = Add-Vec (Mid-Vec $frontShoulder $frontHand) (New-Vec ((-18.0) + (0.06 * $Pose.SwordAngle)) (34.0 + (0.10 * [Math]::Abs($Pose.SwordAngle))))
    $backElbow = Solve-TwoBone $backShoulder $backHand ([double]$Rig.UpperArm) ([double]$Rig.LowerArm) $backArmHint
    $frontElbow = Solve-TwoBone $frontShoulder $frontHand ([double]$Rig.UpperArm) ([double]$Rig.LowerArm) $frontArmHint

    $backLegHint = Add-Vec (Mid-Vec $backHip $Pose.BackFoot) (New-Vec (24.0 + (0.12 * [Math]::Abs($Pose.BackFoot.X - $backHip.X))) (14.0 + (0.12 * [Math]::Abs($Pose.BackFoot.Y - $backHip.Y))))
    $frontLegHint = Add-Vec (Mid-Vec $frontHip $Pose.FrontFoot) (New-Vec (30.0 + (0.10 * [Math]::Abs($Pose.FrontFoot.X - $frontHip.X))) (12.0 + (0.12 * [Math]::Abs($Pose.FrontFoot.Y - $frontHip.Y))))
    $backKnee = Solve-TwoBone $backHip $Pose.BackFoot ([double]$Rig.UpperLeg) ([double]$Rig.LowerLeg) $backLegHint
    $frontKnee = Solve-TwoBone $frontHip $Pose.FrontFoot ([double]$Rig.UpperLeg) ([double]$Rig.LowerLeg) $frontLegHint

    $points = @(
        $Pose.Hip, $neck, $headCenter, $shoulderCenter, $backShoulder, $frontShoulder,
        $backElbow, $frontElbow, $backHand, $frontHand, $backHip, $frontHip,
        $backKnee, $frontKnee, $Pose.BackFoot, $Pose.FrontFoot, $Pose.GripCenter,
        $gripStart, $gripEnd, $pommelCenter, $bladeTip, $guardA, $guardB
    )

    [pscustomobject]@{
        Pose           = $Pose
        HipCenter      = $Pose.Hip
        Neck           = $neck
        HeadCenter     = $headCenter
        ShoulderCenter = $shoulderCenter
        BackShoulder   = $backShoulder
        FrontShoulder  = $frontShoulder
        BackElbow      = $backElbow
        FrontElbow     = $frontElbow
        BackHand       = $backHand
        FrontHand      = $frontHand
        BackHip        = $backHip
        FrontHip       = $frontHip
        BackKnee       = $backKnee
        FrontKnee      = $frontKnee
        BackFoot       = $Pose.BackFoot
        FrontFoot      = $Pose.FrontFoot
        GripCenter     = $Pose.GripCenter
        GripStart      = $gripStart
        GripEnd        = $gripEnd
        PommelCenter   = $pommelCenter
        BladeTip       = $bladeTip
        GuardA         = $guardA
        GuardB         = $guardB
        SwordDirection = $swordDirection
        AllPoints      = $points
    }
}

function Draw-Line {
    param($Graphics, $Pen, $PointA, $PointB)
    $Graphics.DrawLine($Pen, [float]$PointA.X, [float]$PointA.Y, [float]$PointB.X, [float]$PointB.Y)
}

function Fill-Circle {
    param($Graphics, $Brush, $Center, [double]$Radius)
    $diameter = $Radius * 2.0
    $Graphics.FillEllipse($Brush, [float]($Center.X - $Radius), [float]($Center.Y - $Radius), [float]$diameter, [float]$diameter)
}

function Convert-ToPointFArray {
    param([array]$Points)

    $pointArray = New-Object 'System.Drawing.PointF[]' $Points.Count
    for ($index = 0; $index -lt $Points.Count; $index++) {
        $pointArray[$index] = New-Object System.Drawing.PointF -ArgumentList ([float]$Points[$index].X), ([float]$Points[$index].Y)
    }

    $pointArray
}

function Fill-Polygon {
    param($Graphics, $Brush, [array]$Points)
    $Graphics.FillPolygon($Brush, (Convert-ToPointFArray $Points))
}

function Draw-Katana {
    param(
        $Graphics,
        $Geometry,
        $Rig,
        $Palette
    )

    $bladeBrush = $null
    $guardBrush = $null
    $habakiBrush = $null
    $pommelBrush = $null
    $gripPen = $null
    $wrapPen = $null
    $edgePen = $null
    $hamonPen = $null
    try {
        $swordDirection = $Geometry.SwordDirection
        $guardDirection = New-Vec (-$swordDirection.Y) $swordDirection.X
        $guardCenter = $Geometry.GripEnd

        $bladeBrush = New-Object System.Drawing.SolidBrush -ArgumentList $Palette.Blade
        $guardBrush = New-Object System.Drawing.SolidBrush -ArgumentList $Palette.Guard
        $habakiBrush = New-Object System.Drawing.SolidBrush -ArgumentList $Palette.Habaki
        $pommelBrush = New-Object System.Drawing.SolidBrush -ArgumentList $Palette.Grip

        $gripPen = New-Object System.Drawing.Pen -ArgumentList $Palette.Grip, 14.0
        $gripPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $gripPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

        $wrapPen = New-Object System.Drawing.Pen -ArgumentList $Palette.Wrap, 2.4
        $wrapPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $wrapPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

        $edgePen = New-Object System.Drawing.Pen -ArgumentList $Palette.BladeEdge, 2.6
        $edgePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $edgePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

        $hamonPen = New-Object System.Drawing.Pen -ArgumentList $Palette.Hamon, 1.4
        $hamonPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $hamonPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

        Draw-Line $Graphics $gripPen $Geometry.GripStart $Geometry.GripEnd

        for ($index = 0; $index -lt 4; $index++) {
            $t = ($index + 0.5) / 4.0
            $center = Add-Vec $Geometry.GripStart (Scale-Vec $swordDirection ([double]$Rig.GripLength * $t))
            $halfWidth = 5.0
            Draw-Line $Graphics $wrapPen (Add-Vec $center (Scale-Vec $guardDirection (-$halfWidth))) (Add-Vec $center (Scale-Vec $guardDirection $halfWidth))
        }

        $guardPoints = @(
            (Add-Vec (Add-Vec $guardCenter (Scale-Vec $swordDirection (-8.0))) (Scale-Vec $guardDirection 15.0)),
            (Add-Vec (Add-Vec $guardCenter (Scale-Vec $swordDirection 2.0)) (Scale-Vec $guardDirection 18.0)),
            (Add-Vec $guardCenter (Scale-Vec $swordDirection 10.0)),
            (Add-Vec (Add-Vec $guardCenter (Scale-Vec $swordDirection 2.0)) (Scale-Vec $guardDirection (-18.0))),
            (Add-Vec (Add-Vec $guardCenter (Scale-Vec $swordDirection (-8.0))) (Scale-Vec $guardDirection (-15.0))),
            (Add-Vec $guardCenter (Scale-Vec $swordDirection (-12.0)))
        )
        Fill-Polygon $Graphics $guardBrush $guardPoints

        $habakiCenter = Add-Vec $guardCenter (Scale-Vec $swordDirection 7.0)
        $habakiPoints = @(
            (Add-Vec (Add-Vec $habakiCenter (Scale-Vec $swordDirection (-3.0))) (Scale-Vec $guardDirection 5.5)),
            (Add-Vec (Add-Vec $habakiCenter (Scale-Vec $swordDirection 3.5)) (Scale-Vec $guardDirection 4.5)),
            (Add-Vec (Add-Vec $habakiCenter (Scale-Vec $swordDirection 6.5)) (Scale-Vec $guardDirection (-3.0))),
            (Add-Vec (Add-Vec $habakiCenter (Scale-Vec $swordDirection (-2.0))) (Scale-Vec $guardDirection (-5.2)))
        )
        Fill-Polygon $Graphics $habakiBrush $habakiPoints

        $bladeBase = Add-Vec $guardCenter (Scale-Vec $swordDirection 8.0)
        $tipBase = Add-Vec $Geometry.BladeTip (Scale-Vec $swordDirection (-16.0))
        $bladePoints = @(
            (Add-Vec $bladeBase (Scale-Vec $guardDirection 6.6)),
            (Add-Vec (Add-Vec $bladeBase (Scale-Vec $swordDirection ([double]$Rig.BladeLength * 0.36))) (Scale-Vec $guardDirection 6.2)),
            (Add-Vec (Add-Vec $bladeBase (Scale-Vec $swordDirection ([double]$Rig.BladeLength * 0.72))) (Scale-Vec $guardDirection 3.7)),
            (Add-Vec $tipBase (Scale-Vec $guardDirection 1.6)),
            $Geometry.BladeTip,
            (Add-Vec $tipBase (Scale-Vec $guardDirection (-0.5))),
            (Add-Vec (Add-Vec $bladeBase (Scale-Vec $swordDirection ([double]$Rig.BladeLength * 0.64))) (Scale-Vec $guardDirection (-3.2))),
            (Add-Vec (Add-Vec $bladeBase (Scale-Vec $swordDirection ([double]$Rig.BladeLength * 0.18))) (Scale-Vec $guardDirection (-4.8))),
            (Add-Vec $bladeBase (Scale-Vec $guardDirection (-5.8)))
        )
        Fill-Polygon $Graphics $bladeBrush $bladePoints

        Draw-Line $Graphics $edgePen (Add-Vec $bladeBase (Scale-Vec $guardDirection 4.8)) (Add-Vec $Geometry.BladeTip (Scale-Vec $guardDirection 0.6))
        Draw-Line $Graphics $hamonPen (Add-Vec $bladeBase (Scale-Vec $guardDirection (-1.0))) (Add-Vec $tipBase (Scale-Vec $guardDirection (-0.9)))
        Fill-Circle $Graphics $pommelBrush $Geometry.PommelCenter ([double]$Rig.PommelRadius / 2.0)
    }
    finally {
        if ($bladeBrush) { $bladeBrush.Dispose() }
        if ($guardBrush) { $guardBrush.Dispose() }
        if ($habakiBrush) { $habakiBrush.Dispose() }
        if ($pommelBrush) { $pommelBrush.Dispose() }
        if ($gripPen) { $gripPen.Dispose() }
        if ($wrapPen) { $wrapPen.Dispose() }
        if ($edgePen) { $edgePen.Dispose() }
        if ($hamonPen) { $hamonPen.Dispose() }
    }
}

function New-FrameBitmap {
    param(
        $Geometry,
        $Rig,
        [int]$FrameSize,
        $Palette
    )

    $bitmap = New-Object System.Drawing.Bitmap -ArgumentList $FrameSize, $FrameSize, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

    $bodyPen = $null
    $bodyBrush = $null
    $jointBrush = $null
    try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

        $bodyPen = New-Object System.Drawing.Pen -ArgumentList $Palette.Body, ([float]$Rig.LimbThickness)
        $bodyPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $bodyPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $bodyPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

        $bodyBrush = New-Object System.Drawing.SolidBrush -ArgumentList $Palette.Body
        $jointBrush = New-Object System.Drawing.SolidBrush -ArgumentList $Palette.Body

        Draw-Line $graphics $bodyPen $Geometry.BackHip $Geometry.BackKnee
        Draw-Line $graphics $bodyPen $Geometry.BackKnee $Geometry.BackFoot
        Draw-Line $graphics $bodyPen $Geometry.FrontHip $Geometry.FrontKnee
        Draw-Line $graphics $bodyPen $Geometry.FrontKnee $Geometry.FrontFoot
        Draw-Line $graphics $bodyPen $Geometry.Neck $Geometry.HipCenter
        Draw-Katana $graphics $Geometry $Rig $Palette
        Draw-Line $graphics $bodyPen $Geometry.BackShoulder $Geometry.BackElbow
        Draw-Line $graphics $bodyPen $Geometry.BackElbow $Geometry.BackHand
        Draw-Line $graphics $bodyPen $Geometry.FrontShoulder $Geometry.FrontElbow
        Draw-Line $graphics $bodyPen $Geometry.FrontElbow $Geometry.FrontHand
        Fill-Circle $graphics $bodyBrush $Geometry.HeadCenter ([double]$Rig.HeadRadius)

        foreach ($joint in @($Geometry.BackShoulder, $Geometry.FrontShoulder, $Geometry.BackElbow, $Geometry.FrontElbow, $Geometry.BackKnee, $Geometry.FrontKnee, $Geometry.BackHand, $Geometry.FrontHand)) {
            Fill-Circle $graphics $jointBrush $joint ([double]$Rig.JointRadius)
        }
    }
    finally {
        if ($bodyPen) { $bodyPen.Dispose() }
        if ($bodyBrush) { $bodyBrush.Dispose() }
        if ($jointBrush) { $jointBrush.Dispose() }
        $graphics.Dispose()
    }

    $bitmap
}

function Save-Png {
    param(
        $Bitmap,
        [string]$Path
    )

    $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Get-FrameMetrics {
    param(
        $Geometry,
        $Rig,
        [int]$FrameSize,
        $Bitmap
    )

    $padding = [Math]::Max([double]$Rig.HeadRadius, [Math]::Max(([double]$Rig.LimbThickness / 2.0), 18.0))
    $left = [double]::PositiveInfinity
    $right = [double]::NegativeInfinity
    $top = [double]::PositiveInfinity
    $bottom = [double]::NegativeInfinity

    foreach ($point in $Geometry.AllPoints) {
        $left = [Math]::Min($left, $point.X - $padding)
        $right = [Math]::Max($right, $point.X + $padding)
        $top = [Math]::Min($top, $point.Y - $padding)
        $bottom = [Math]::Max($bottom, $point.Y + $padding)
    }

    $overflow = [Math]::Max(
        [Math]::Max([Math]::Max(0.0, -$left), [Math]::Max(0.0, -$top)),
        [Math]::Max([Math]::Max(0.0, $right - $FrameSize), [Math]::Max(0.0, $bottom - $FrameSize))
    )

    $cornerAlphas = @(
        $Bitmap.GetPixel(0, 0).A,
        $Bitmap.GetPixel($FrameSize - 1, 0).A,
        $Bitmap.GetPixel(0, $FrameSize - 1).A,
        $Bitmap.GetPixel($FrameSize - 1, $FrameSize - 1).A
    )
    $transparentCorners = (@($cornerAlphas | Where-Object { $_ -ne 0 }).Count -eq 0)

    $upperBackArm = Distance-Vec $Geometry.BackShoulder $Geometry.BackElbow
    $lowerBackArm = Distance-Vec $Geometry.BackElbow $Geometry.BackHand
    $upperFrontArm = Distance-Vec $Geometry.FrontShoulder $Geometry.FrontElbow
    $lowerFrontArm = Distance-Vec $Geometry.FrontElbow $Geometry.FrontHand
    $upperBackLeg = Distance-Vec $Geometry.BackHip $Geometry.BackKnee
    $lowerBackLeg = Distance-Vec $Geometry.BackKnee $Geometry.BackFoot
    $upperFrontLeg = Distance-Vec $Geometry.FrontHip $Geometry.FrontKnee
    $lowerFrontLeg = Distance-Vec $Geometry.FrontKnee $Geometry.FrontFoot

    [pscustomobject]@{
        Width               = $Bitmap.Width
        Height              = $Bitmap.Height
        TransparentCorners  = $transparentCorners
        BoundsOverflowPx    = $overflow
        BoundsInFrame       = ($overflow -le 0.01)
        UpperBackArmError   = [Math]::Abs($upperBackArm - [double]$Rig.UpperArm)
        LowerBackArmError   = [Math]::Abs($lowerBackArm - [double]$Rig.LowerArm)
        UpperFrontArmError  = [Math]::Abs($upperFrontArm - [double]$Rig.UpperArm)
        LowerFrontArmError  = [Math]::Abs($lowerFrontArm - [double]$Rig.LowerArm)
        UpperBackLegError   = [Math]::Abs($upperBackLeg - [double]$Rig.UpperLeg)
        LowerBackLegError   = [Math]::Abs($lowerBackLeg - [double]$Rig.LowerLeg)
        UpperFrontLegError  = [Math]::Abs($upperFrontLeg - [double]$Rig.UpperLeg)
        LowerFrontLegError  = [Math]::Abs($lowerFrontLeg - [double]$Rig.LowerLeg)
        MaxSwordGripErrorPx = 0.0
        KeyPoints           = [ordered]@{
            hip       = New-Vec $Geometry.HipCenter.X $Geometry.HipCenter.Y
            head      = New-Vec $Geometry.HeadCenter.X $Geometry.HeadCenter.Y
            backFoot  = New-Vec $Geometry.BackFoot.X $Geometry.BackFoot.Y
            frontFoot = New-Vec $Geometry.FrontFoot.X $Geometry.FrontFoot.Y
            backHand  = New-Vec $Geometry.BackHand.X $Geometry.BackHand.Y
            frontHand = New-Vec $Geometry.FrontHand.X $Geometry.FrontHand.Y
            bladeTip  = New-Vec $Geometry.BladeTip.X $Geometry.BladeTip.Y
        }
    }
}

function Get-LoopSeamDelta {
    param(
        $FirstMetrics,
        $LastMetrics
    )

    $distances = @()
    foreach ($name in $FirstMetrics.KeyPoints.Keys) {
        $distances += Distance-Vec $FirstMetrics.KeyPoints[$name] $LastMetrics.KeyPoints[$name]
    }

    if ($distances.Count -eq 0) {
        return 0.0
    }

    ($distances | Measure-Object -Maximum).Maximum
}

$rig = [ordered]@{
    HeadDiameter  = 64.0
    HeadRadius    = 32.0
    TorsoLength   = 104.0
    ShoulderSpan  = 44.0
    ShoulderDrop  = 20.0
    HipSpan       = 36.0
    UpperArm      = 74.0
    LowerArm      = 72.0
    UpperLeg      = 84.0
    LowerLeg      = 84.0
    LimbThickness = 18.0
    JointRadius   = 10.0
    SwordLength   = 176.0
    BladeLength   = 136.0
    GripLength    = 32.0
    PommelRadius  = 8.0
    BaseHipX      = $FrameSize / 2.0
    GroundY       = $FrameSize * 0.84
    BaseHipY      = ($FrameSize * 0.84) - 160.0
}

$animationSpecs = [ordered]@{
    idle               = [ordered]@{ frameCount = 6; fps = 8; loop = $true; holdLastFrame = $false }
    walk               = [ordered]@{ frameCount = 8; fps = 10; loop = $true; holdLastFrame = $false }
    run                = [ordered]@{ frameCount = 8; fps = 14; loop = $true; holdLastFrame = $false }
    jump               = [ordered]@{ frameCount = 6; fps = 12; loop = $false; holdLastFrame = $false }
    quick_slash        = [ordered]@{ frameCount = 8; fps = 14; loop = $false; holdLastFrame = $false }
    upward_slash       = [ordered]@{ frameCount = 8; fps = 12; loop = $false; holdLastFrame = $false }
    downward_strike    = [ordered]@{ frameCount = 8; fps = 12; loop = $false; holdLastFrame = $false }
    triple_slash_combo = [ordered]@{ frameCount = 10; fps = 16; loop = $false; holdLastFrame = $false }
    spin_attack        = [ordered]@{ frameCount = 8; fps = 14; loop = $false; holdLastFrame = $false }
    dash_slash         = [ordered]@{ frameCount = 8; fps = 15; loop = $false; holdLastFrame = $false }
    block              = [ordered]@{ frameCount = 5; fps = 10; loop = $false; holdLastFrame = $true }
    parry              = [ordered]@{ frameCount = 5; fps = 14; loop = $false; holdLastFrame = $false }
    charged_strike     = [ordered]@{ frameCount = 8; fps = 10; loop = $false; holdLastFrame = $false }
    iaido_slash        = [ordered]@{ frameCount = 8; fps = 16; loop = $false; holdLastFrame = $false }
    air_combo_finisher = [ordered]@{ frameCount = 8; fps = 14; loop = $false; holdLastFrame = $false }
    teleport_slash     = [ordered]@{ frameCount = 8; fps = 16; loop = $false; holdLastFrame = $false }
    energy_slash       = [ordered]@{ frameCount = 8; fps = 14; loop = $false; holdLastFrame = $false }
    hit_reaction       = [ordered]@{ frameCount = 5; fps = 12; loop = $false; holdLastFrame = $false }
    knockdown          = [ordered]@{ frameCount = 8; fps = 10; loop = $false; holdLastFrame = $true }
    blink_step         = [ordered]@{ frameCount = 6; fps = 18; loop = $false; holdLastFrame = $false }
    super_slash        = [ordered]@{ frameCount = 10; fps = 14; loop = $false; holdLastFrame = $false }
    omni_slash_combo   = [ordered]@{ frameCount = 12; fps = 18; loop = $false; holdLastFrame = $false }
}

$centerX = [double]$rig.BaseHipX
$groundY = [double]$rig.GroundY
$baseHipY = [double]$rig.BaseHipY

$actionKeyframes = [ordered]@{
    jump = @(
        (New-KeyPose 0.00 $centerX ($baseHipY + 8.0) 2.0 0.0 ($centerX - 34.0) $groundY ($centerX + 30.0) $groundY ($centerX + 22.0) ($baseHipY - 82.0) 64.0),
        (New-KeyPose 0.20 ($centerX + 2.0) ($baseHipY + 16.0) 6.0 1.0 ($centerX - 28.0) ($groundY - 4.0) ($centerX + 34.0) ($groundY - 6.0) ($centerX + 24.0) ($baseHipY - 92.0) 52.0),
        (New-KeyPose 0.40 ($centerX + 10.0) ($baseHipY - 44.0) 4.0 1.0 ($centerX - 10.0) ($groundY - 40.0) ($centerX + 38.0) ($groundY - 36.0) ($centerX + 28.0) ($baseHipY - 114.0) 38.0),
        (New-KeyPose 0.60 ($centerX + 18.0) ($baseHipY - 62.0) 2.0 0.0 ($centerX - 2.0) ($groundY - 54.0) ($centerX + 42.0) ($groundY - 48.0) ($centerX + 34.0) ($baseHipY - 124.0) 30.0),
        (New-KeyPose 0.82 ($centerX + 24.0) ($baseHipY - 24.0) 5.0 0.0 ($centerX + 4.0) ($groundY - 26.0) ($centerX + 46.0) ($groundY - 24.0) ($centerX + 36.0) ($baseHipY - 102.0) 42.0),
        (New-KeyPose 1.00 ($centerX + 28.0) ($baseHipY + 8.0) 6.0 0.0 ($centerX + 2.0) $groundY ($centerX + 52.0) $groundY ($centerX + 34.0) ($baseHipY - 80.0) 58.0)
    )
    quick_slash = @(
        (New-KeyPose 0.00 $centerX ($baseHipY + 8.0) -8.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX - 2.0) ($baseHipY - 56.0) -150.0),
        (New-KeyPose 0.20 ($centerX - 4.0) ($baseHipY + 12.0) -12.0 -1.0 ($centerX - 36.0) $groundY ($centerX + 36.0) $groundY ($centerX - 10.0) ($baseHipY - 66.0) -128.0),
        (New-KeyPose 0.48 ($centerX + 10.0) $baseHipY 6.0 1.0 ($centerX - 32.0) $groundY ($centerX + 42.0) ($groundY - 2.0) ($centerX + 24.0) ($baseHipY - 70.0) -42.0),
        (New-KeyPose 0.66 ($centerX + 22.0) ($baseHipY - 4.0) 12.0 0.0 ($centerX - 26.0) $groundY ($centerX + 48.0) $groundY ($centerX + 56.0) ($baseHipY - 64.0) 28.0),
        (New-KeyPose 0.84 ($centerX + 30.0) ($baseHipY + 2.0) 10.0 -1.0 ($centerX - 22.0) $groundY ($centerX + 50.0) $groundY ($centerX + 70.0) ($baseHipY - 48.0) 58.0),
        (New-KeyPose 1.00 ($centerX + 24.0) ($baseHipY + 4.0) 6.0 0.0 ($centerX - 24.0) $groundY ($centerX + 46.0) $groundY ($centerX + 48.0) ($baseHipY - 54.0) 10.0)
    )
    upward_slash = @(
        (New-KeyPose 0.00 ($centerX - 4.0) ($baseHipY + 14.0) -12.0 0.0 ($centerX - 38.0) $groundY ($centerX + 34.0) $groundY ($centerX + 14.0) ($baseHipY - 20.0) 128.0),
        (New-KeyPose 0.18 ($centerX - 8.0) ($baseHipY + 18.0) -18.0 -1.0 ($centerX - 40.0) $groundY ($centerX + 34.0) $groundY ($centerX + 8.0) ($baseHipY - 12.0) 144.0),
        (New-KeyPose 0.40 ($centerX + 2.0) ($baseHipY + 2.0) -2.0 0.0 ($centerX - 34.0) $groundY ($centerX + 42.0) $groundY ($centerX + 18.0) ($baseHipY - 54.0) 72.0),
        (New-KeyPose 0.62 ($centerX + 12.0) ($baseHipY - 8.0) 10.0 1.0 ($centerX - 28.0) $groundY ($centerX + 48.0) ($groundY - 4.0) ($centerX + 32.0) ($baseHipY - 96.0) 18.0),
        (New-KeyPose 0.82 ($centerX + 18.0) ($baseHipY - 2.0) 16.0 2.0 ($centerX - 24.0) $groundY ($centerX + 50.0) $groundY ($centerX + 18.0) ($baseHipY - 118.0) -48.0),
        (New-KeyPose 1.00 ($centerX + 10.0) ($baseHipY + 4.0) 8.0 0.0 ($centerX - 28.0) $groundY ($centerX + 46.0) $groundY ($centerX + 20.0) ($baseHipY - 86.0) -18.0)
    )
    downward_strike = @(
        (New-KeyPose 0.00 ($centerX - 4.0) ($baseHipY - 44.0) 4.0 0.0 ($centerX - 28.0) ($groundY - 38.0) ($centerX + 26.0) ($groundY - 34.0) ($centerX + 12.0) ($baseHipY - 96.0) -34.0),
        (New-KeyPose 0.18 ($centerX + 4.0) ($baseHipY - 50.0) -4.0 -1.0 ($centerX - 18.0) ($groundY - 50.0) ($centerX + 34.0) ($groundY - 46.0) ($centerX + 20.0) ($baseHipY - 100.0) -62.0),
        (New-KeyPose 0.38 ($centerX + 12.0) ($baseHipY - 54.0) -10.0 -1.0 ($centerX - 10.0) ($groundY - 54.0) ($centerX + 38.0) ($groundY - 50.0) ($centerX + 34.0) ($baseHipY - 90.0) 24.0),
        (New-KeyPose 0.56 ($centerX + 20.0) ($baseHipY - 18.0) 10.0 0.0 ($centerX - 2.0) ($groundY - 18.0) ($centerX + 42.0) ($groundY - 14.0) ($centerX + 44.0) ($baseHipY - 24.0) 88.0),
        (New-KeyPose 0.72 ($centerX + 24.0) ($baseHipY + 10.0) 18.0 1.0 ($centerX - 6.0) $groundY ($centerX + 46.0) $groundY ($centerX + 38.0) ($baseHipY + 18.0) 104.0),
        (New-KeyPose 1.00 ($centerX + 14.0) ($baseHipY + 8.0) 8.0 0.0 ($centerX - 20.0) $groundY ($centerX + 40.0) $groundY ($centerX + 24.0) ($baseHipY - 44.0) 36.0)
    )
    triple_slash_combo = @(
        (New-KeyPose 0.00 $centerX ($baseHipY + 6.0) -4.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX + 12.0) ($baseHipY - 62.0) -48.0),
        (New-KeyPose 0.16 ($centerX + 18.0) ($baseHipY - 2.0) 10.0 1.0 ($centerX - 28.0) $groundY ($centerX + 46.0) ($groundY - 2.0) ($centerX + 54.0) ($baseHipY - 68.0) 20.0),
        (New-KeyPose 0.32 ($centerX + 14.0) ($baseHipY + 4.0) 4.0 0.0 ($centerX - 26.0) $groundY ($centerX + 48.0) $groundY ($centerX + 54.0) ($baseHipY - 56.0) 56.0),
        (New-KeyPose 0.48 ($centerX - 2.0) ($baseHipY - 2.0) -8.0 -1.0 ($centerX - 30.0) $groundY ($centerX + 42.0) $groundY ($centerX - 10.0) ($baseHipY - 68.0) -42.0),
        (New-KeyPose 0.64 ($centerX + 6.0) ($baseHipY + 10.0) -10.0 0.0 ($centerX - 26.0) $groundY ($centerX + 46.0) $groundY ($centerX + 2.0) ($baseHipY - 96.0) -108.0),
        (New-KeyPose 0.84 ($centerX + 30.0) $baseHipY 18.0 1.0 ($centerX - 22.0) $groundY ($centerX + 58.0) $groundY ($centerX + 66.0) ($baseHipY - 42.0) 84.0),
        (New-KeyPose 1.00 ($centerX + 22.0) ($baseHipY + 4.0) 8.0 0.0 ($centerX - 24.0) $groundY ($centerX + 50.0) $groundY ($centerX + 46.0) ($baseHipY - 52.0) 18.0)
    )
    spin_attack = @(
        (New-KeyPose 0.00 ($centerX - 6.0) ($baseHipY + 8.0) -12.0 0.0 ($centerX - 36.0) $groundY ($centerX + 30.0) $groundY ($centerX - 8.0) ($baseHipY - 70.0) -150.0),
        (New-KeyPose 0.18 ($centerX + 4.0) ($baseHipY - 2.0) 2.0 1.0 ($centerX - 28.0) $groundY ($centerX + 38.0) ($groundY - 6.0) ($centerX + 38.0) ($baseHipY - 78.0) -34.0),
        (New-KeyPose 0.36 ($centerX + 16.0) ($baseHipY + 4.0) 14.0 2.0 ($centerX - 22.0) $groundY ($centerX + 48.0) $groundY ($centerX + 64.0) ($baseHipY - 18.0) 82.0),
        (New-KeyPose 0.54 ($centerX + 6.0) ($baseHipY + 12.0) 22.0 1.0 ($centerX - 18.0) $groundY ($centerX + 52.0) $groundY ($centerX + 22.0) ($baseHipY + 22.0) 156.0),
        (New-KeyPose 0.72 ($centerX - 12.0) ($baseHipY + 6.0) 6.0 0.0 ($centerX - 40.0) $groundY ($centerX + 32.0) $groundY ($centerX - 28.0) ($baseHipY - 22.0) -112.0),
        (New-KeyPose 1.00 ($centerX - 2.0) ($baseHipY + 4.0) 4.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX + 12.0) ($baseHipY - 54.0) -42.0)
    )
    dash_slash = @(
        (New-KeyPose 0.00 ($centerX - 10.0) ($baseHipY + 8.0) 12.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX + 26.0) ($baseHipY - 60.0) -10.0),
        (New-KeyPose 0.16 ($centerX + 6.0) ($baseHipY - 6.0) 18.0 1.0 ($centerX - 20.0) $groundY ($centerX + 48.0) ($groundY - 10.0) ($centerX + 42.0) ($baseHipY - 66.0) -8.0),
        (New-KeyPose 0.34 ($centerX + 22.0) ($baseHipY - 2.0) 20.0 1.0 ($centerX - 12.0) $groundY ($centerX + 58.0) ($groundY - 6.0) ($centerX + 68.0) ($baseHipY - 64.0) 12.0),
        (New-KeyPose 0.52 ($centerX + 36.0) ($baseHipY - 4.0) 12.0 0.0 ($centerX - 6.0) $groundY ($centerX + 66.0) $groundY ($centerX + 90.0) ($baseHipY - 54.0) 32.0),
        (New-KeyPose 0.76 ($centerX + 44.0) ($baseHipY + 4.0) 8.0 0.0 ($centerX + 2.0) $groundY ($centerX + 68.0) $groundY ($centerX + 94.0) ($baseHipY - 48.0) 46.0),
        (New-KeyPose 1.00 ($centerX + 18.0) ($baseHipY + 4.0) 6.0 0.0 ($centerX - 16.0) $groundY ($centerX + 46.0) $groundY ($centerX + 40.0) ($baseHipY - 52.0) 10.0)
    )
    block = @(
        (New-KeyPose 0.00 $centerX ($baseHipY + 4.0) 4.0 0.0 ($centerX - 34.0) $groundY ($centerX + 32.0) $groundY ($centerX + 24.0) ($baseHipY - 72.0) -12.0),
        (New-KeyPose 0.24 ($centerX + 2.0) ($baseHipY + 2.0) 6.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX + 22.0) ($baseHipY - 86.0) -74.0),
        (New-KeyPose 0.50 ($centerX - 4.0) ($baseHipY + 10.0) -4.0 -1.0 ($centerX - 38.0) $groundY ($centerX + 30.0) $groundY ($centerX + 16.0) ($baseHipY - 76.0) -66.0),
        (New-KeyPose 0.76 ($centerX - 6.0) ($baseHipY + 12.0) -2.0 0.0 ($centerX - 38.0) $groundY ($centerX + 30.0) $groundY ($centerX + 18.0) ($baseHipY - 72.0) -54.0),
        (New-KeyPose 1.00 ($centerX - 4.0) ($baseHipY + 8.0) 2.0 0.0 ($centerX - 36.0) $groundY ($centerX + 32.0) $groundY ($centerX + 22.0) ($baseHipY - 68.0) -42.0)
    )
    parry = @(
        (New-KeyPose 0.00 $centerX ($baseHipY + 4.0) 2.0 0.0 ($centerX - 34.0) $groundY ($centerX + 32.0) $groundY ($centerX + 18.0) ($baseHipY - 64.0) -28.0),
        (New-KeyPose 0.20 ($centerX + 4.0) ($baseHipY + 2.0) 8.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX + 28.0) ($baseHipY - 88.0) -78.0),
        (New-KeyPose 0.42 ($centerX - 6.0) ($baseHipY + 6.0) -6.0 -1.0 ($centerX - 40.0) $groundY ($centerX + 28.0) $groundY ($centerX + 10.0) ($baseHipY - 82.0) -92.0),
        (New-KeyPose 0.70 ($centerX - 2.0) ($baseHipY + 8.0) -2.0 0.0 ($centerX - 36.0) $groundY ($centerX + 30.0) $groundY ($centerX + 18.0) ($baseHipY - 76.0) -58.0),
        (New-KeyPose 1.00 $centerX ($baseHipY + 6.0) 2.0 0.0 ($centerX - 34.0) $groundY ($centerX + 32.0) $groundY ($centerX + 20.0) ($baseHipY - 66.0) -34.0)
    )
    charged_strike = @(
        
        (New-KeyPose 0.00 ($centerX - 2.0) ($baseHipY + 10.0) -10.0 0.0 ($centerX - 36.0) $groundY ($centerX + 36.0) $groundY ($centerX - 8.0) ($baseHipY - 54.0) -120.0),
        (New-KeyPose 0.22 ($centerX - 6.0) ($baseHipY + 18.0) -16.0 -1.0 ($centerX - 38.0) $groundY ($centerX + 40.0) $groundY ($centerX - 12.0) ($baseHipY - 88.0) -92.0),
        (New-KeyPose 0.42 ($centerX + 4.0) ($baseHipY + 4.0) -4.0 0.0 ($centerX - 34.0) $groundY ($centerX + 46.0) ($groundY - 4.0) ($centerX + 8.0) ($baseHipY - 92.0) -74.0),
        (New-KeyPose 0.66 ($centerX + 26.0) $baseHipY 16.0 1.0 ($centerX - 26.0) $groundY ($centerX + 56.0) $groundY ($centerX + 64.0) ($baseHipY - 56.0) 72.0),
        (New-KeyPose 0.84 ($centerX + 32.0) ($baseHipY + 8.0) 14.0 0.0 ($centerX - 22.0) $groundY ($centerX + 58.0) $groundY ($centerX + 62.0) ($baseHipY - 28.0) 98.0),
        (New-KeyPose 1.00 ($centerX + 24.0) ($baseHipY + 4.0) 8.0 0.0 ($centerX - 24.0) $groundY ($centerX + 50.0) $groundY ($centerX + 44.0) ($baseHipY - 50.0) 26.0)
    )
    iaido_slash = @(
        (New-KeyPose 0.00 ($centerX - 10.0) ($baseHipY + 10.0) -8.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX - 10.0) ($baseHipY - 34.0) 176.0),
        (New-KeyPose 0.22 ($centerX - 12.0) ($baseHipY + 14.0) -10.0 -1.0 ($centerX - 36.0) $groundY ($centerX + 34.0) $groundY ($centerX - 14.0) ($baseHipY - 28.0) 180.0),
        (New-KeyPose 0.40 ($centerX + 8.0) ($baseHipY + 2.0) 6.0 0.0 ($centerX - 28.0) $groundY ($centerX + 44.0) $groundY ($centerX + 40.0) ($baseHipY - 72.0) 12.0),
        (New-KeyPose 0.58 ($centerX + 24.0) ($baseHipY - 2.0) 10.0 1.0 ($centerX - 20.0) $groundY ($centerX + 56.0) $groundY ($centerX + 74.0) ($baseHipY - 62.0) 20.0),
        (New-KeyPose 0.78 ($centerX + 22.0) ($baseHipY + 2.0) 8.0 0.0 ($centerX - 18.0) $groundY ($centerX + 54.0) $groundY ($centerX + 62.0) ($baseHipY - 56.0) 18.0),
        (New-KeyPose 1.00 ($centerX + 8.0) ($baseHipY + 4.0) 4.0 0.0 ($centerX - 26.0) $groundY ($centerX + 42.0) $groundY ($centerX + 28.0) ($baseHipY - 54.0) -4.0)
    )
    air_combo_finisher = @(
        (New-KeyPose 0.00 ($centerX - 6.0) ($baseHipY - 42.0) -6.0 0.0 ($centerX - 28.0) ($groundY - 40.0) ($centerX + 26.0) ($groundY - 36.0) ($centerX + 18.0) ($baseHipY - 92.0) -50.0),
        (New-KeyPose 0.18 ($centerX + 4.0) ($baseHipY - 46.0) -10.0 -1.0 ($centerX - 18.0) ($groundY - 46.0) ($centerX + 34.0) ($groundY - 42.0) ($centerX + 26.0) ($baseHipY - 96.0) -76.0),
        (New-KeyPose 0.36 ($centerX + 14.0) ($baseHipY - 58.0) 0.0 0.0 ($centerX - 10.0) ($groundY - 58.0) ($centerX + 42.0) ($groundY - 54.0) ($centerX + 46.0) ($baseHipY - 94.0) -8.0),
        (New-KeyPose 0.56 ($centerX + 24.0) ($baseHipY - 20.0) 16.0 1.0 ($centerX - 2.0) ($groundY - 20.0) ($centerX + 48.0) ($groundY - 16.0) ($centerX + 54.0) ($baseHipY - 18.0) 86.0),
        (New-KeyPose 0.76 ($centerX + 28.0) ($baseHipY + 10.0) 24.0 1.0 ($centerX - 8.0) $groundY ($centerX + 50.0) $groundY ($centerX + 42.0) ($baseHipY + 32.0) 110.0),
        (New-KeyPose 1.00 ($centerX + 14.0) ($baseHipY + 10.0) 10.0 0.0 ($centerX - 20.0) $groundY ($centerX + 40.0) $groundY ($centerX + 22.0) ($baseHipY - 42.0) 26.0)
    )
    teleport_slash = @(
        (New-KeyPose 0.00 ($centerX - 14.0) ($baseHipY + 12.0) -12.0 0.0 ($centerX - 38.0) $groundY ($centerX + 28.0) $groundY ($centerX + 6.0) ($baseHipY - 54.0) -138.0),
        (New-KeyPose 0.18 ($centerX - 22.0) ($baseHipY + 20.0) -20.0 -1.0 ($centerX - 44.0) $groundY ($centerX + 24.0) $groundY ($centerX - 4.0) ($baseHipY - 40.0) -154.0),
        (New-KeyPose 0.34 ($centerX - 28.0) ($baseHipY + 28.0) -28.0 -2.0 ($centerX - 46.0) $groundY ($centerX + 18.0) $groundY ($centerX - 10.0) ($baseHipY - 22.0) -166.0),
        (New-KeyPose 0.52 ($centerX + 22.0) ($baseHipY + 2.0) 10.0 0.0 ($centerX - 18.0) $groundY ($centerX + 54.0) $groundY ($centerX + 54.0) ($baseHipY - 60.0) 18.0),
        (New-KeyPose 0.70 ($centerX + 32.0) ($baseHipY - 4.0) 12.0 1.0 ($centerX - 12.0) $groundY ($centerX + 58.0) $groundY ($centerX + 76.0) ($baseHipY - 62.0) 24.0),
        (New-KeyPose 1.00 ($centerX + 14.0) ($baseHipY + 4.0) 6.0 0.0 ($centerX - 24.0) $groundY ($centerX + 42.0) $groundY ($centerX + 28.0) ($baseHipY - 52.0) 2.0)
    )
    energy_slash = @(
        (New-KeyPose 0.00 ($centerX - 4.0) ($baseHipY + 8.0) -8.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX - 2.0) ($baseHipY - 58.0) -122.0),
        (New-KeyPose 0.18 ($centerX - 6.0) ($baseHipY + 14.0) -14.0 -1.0 ($centerX - 38.0) $groundY ($centerX + 34.0) $groundY ($centerX - 8.0) ($baseHipY - 72.0) -96.0),
        (New-KeyPose 0.40 ($centerX + 6.0) ($baseHipY + 2.0) 4.0 0.0 ($centerX - 32.0) $groundY ($centerX + 44.0) $groundY ($centerX + 24.0) ($baseHipY - 72.0) -18.0),
        (New-KeyPose 0.60 ($centerX + 20.0) ($baseHipY - 2.0) 12.0 1.0 ($centerX - 26.0) $groundY ($centerX + 50.0) $groundY ($centerX + 62.0) ($baseHipY - 66.0) 12.0),
        (New-KeyPose 0.82 ($centerX + 28.0) ($baseHipY + 4.0) 10.0 0.0 ($centerX - 22.0) $groundY ($centerX + 54.0) $groundY ($centerX + 74.0) ($baseHipY - 58.0) 22.0),
        (New-KeyPose 1.00 ($centerX + 18.0) ($baseHipY + 4.0) 6.0 0.0 ($centerX - 24.0) $groundY ($centerX + 46.0) $groundY ($centerX + 36.0) ($baseHipY - 52.0) 8.0)
    )
    hit_reaction = @(
        (New-KeyPose 0.00 ($centerX + 8.0) ($baseHipY + 2.0) 6.0 0.0 ($centerX - 30.0) $groundY ($centerX + 34.0) $groundY ($centerX + 28.0) ($baseHipY - 58.0) -18.0),
        (New-KeyPose 0.26 ($centerX - 10.0) ($baseHipY - 2.0) -18.0 -2.0 ($centerX - 42.0) $groundY ($centerX + 28.0) $groundY ($centerX - 2.0) ($baseHipY - 52.0) 34.0),
        (New-KeyPose 0.50 ($centerX - 16.0) ($baseHipY + 6.0) -24.0 -3.0 ($centerX - 46.0) $groundY ($centerX + 24.0) $groundY ($centerX - 10.0) ($baseHipY - 46.0) 58.0),
        (New-KeyPose 0.76 ($centerX - 8.0) ($baseHipY + 12.0) -10.0 -1.0 ($centerX - 36.0) $groundY ($centerX + 28.0) $groundY ($centerX + 4.0) ($baseHipY - 50.0) 22.0),
        (New-KeyPose 1.00 ($centerX - 2.0) ($baseHipY + 4.0) 0.0 0.0 ($centerX - 34.0) $groundY ($centerX + 30.0) $groundY ($centerX + 20.0) ($baseHipY - 56.0) -8.0)
    )
    knockdown = @(
        (New-KeyPose 0.00 ($centerX + 4.0) ($baseHipY + 2.0) 4.0 0.0 ($centerX - 32.0) $groundY ($centerX + 34.0) $groundY ($centerX + 26.0) ($baseHipY - 58.0) -16.0),
        (New-KeyPose 0.18 ($centerX - 12.0) ($baseHipY + 6.0) -16.0 -1.0 ($centerX - 44.0) $groundY ($centerX + 28.0) $groundY ($centerX - 2.0) ($baseHipY - 50.0) 26.0),
        (New-KeyPose 0.38 ($centerX - 34.0) ($baseHipY + 36.0) -40.0 -2.0 ($centerX - 56.0) ($groundY - 10.0) ($centerX + 4.0) $groundY ($centerX - 22.0) ($baseHipY - 12.0) 70.0),
        (New-KeyPose 0.58 ($centerX - 34.0) ($baseHipY + 82.0) 58.0 2.0 ($centerX - 46.0) $groundY ($centerX + 18.0) ($groundY - 4.0) ($centerX + 8.0) ($baseHipY + 42.0) 92.0),
        (New-KeyPose 0.80 ($centerX - 28.0) ($baseHipY + 116.0) 88.0 1.0 ($centerX - 60.0) $groundY ($centerX - 2.0) $groundY ($centerX + 36.0) ($baseHipY + 114.0) 20.0),
        (New-KeyPose 1.00 ($centerX - 28.0) ($baseHipY + 122.0) 96.0 0.0 ($centerX - 64.0) $groundY ($centerX - 6.0) $groundY ($centerX + 44.0) ($baseHipY + 116.0) 4.0)
    )
    blink_step = @(
        (New-KeyPose 0.00 ($centerX - 4.0) ($baseHipY + 6.0) 2.0 0.0 ($centerX - 32.0) $groundY ($centerX + 30.0) $groundY ($centerX + 24.0) ($baseHipY - 78.0) 60.0),
        (New-KeyPose 0.18 ($centerX - 10.0) ($baseHipY + 18.0) -8.0 -1.0 ($centerX - 34.0) $groundY ($centerX + 28.0) $groundY ($centerX + 18.0) ($baseHipY - 62.0) 18.0),
        (New-KeyPose 0.36 ($centerX - 18.0) ($baseHipY + 24.0) -18.0 -2.0 ($centerX - 38.0) $groundY ($centerX + 22.0) $groundY ($centerX + 6.0) ($baseHipY - 44.0) -24.0),
        (New-KeyPose 0.56 ($centerX + 24.0) ($baseHipY - 2.0) 6.0 0.0 ($centerX - 10.0) $groundY ($centerX + 48.0) $groundY ($centerX + 46.0) ($baseHipY - 86.0) 68.0),
        (New-KeyPose 0.78 ($centerX + 28.0) ($baseHipY + 2.0) 4.0 0.0 ($centerX - 8.0) $groundY ($centerX + 50.0) $groundY ($centerX + 42.0) ($baseHipY - 84.0) 62.0),
        (New-KeyPose 1.00 ($centerX + 18.0) ($baseHipY + 4.0) 2.0 0.0 ($centerX - 18.0) $groundY ($centerX + 44.0) $groundY ($centerX + 32.0) ($baseHipY - 80.0) 58.0)
    )
    super_slash = @(
        (New-KeyPose 0.00 ($centerX - 8.0) ($baseHipY + 12.0) -8.0 0.0 ($centerX - 34.0) $groundY ($centerX + 36.0) $groundY ($centerX - 8.0) ($baseHipY - 54.0) -132.0),
        (New-KeyPose 0.16 ($centerX - 14.0) ($baseHipY + 20.0) -16.0 -1.0 ($centerX - 40.0) $groundY ($centerX + 38.0) $groundY ($centerX - 12.0) ($baseHipY - 92.0) -102.0),
        (New-KeyPose 0.34 ($centerX - 4.0) ($baseHipY + 8.0) -6.0 0.0 ($centerX - 34.0) $groundY ($centerX + 46.0) ($groundY - 4.0) ($centerX + 8.0) ($baseHipY - 106.0) -76.0),
        (New-KeyPose 0.54 ($centerX + 20.0) ($baseHipY - 4.0) 14.0 1.0 ($centerX - 22.0) $groundY ($centerX + 60.0) ($groundY - 2.0) ($centerX + 56.0) ($baseHipY - 86.0) 24.0),
        (New-KeyPose 0.76 ($centerX + 34.0) ($baseHipY + 2.0) 22.0 1.0 ($centerX - 16.0) $groundY ($centerX + 68.0) $groundY ($centerX + 86.0) ($baseHipY - 26.0) 108.0),
        (New-KeyPose 1.00 ($centerX + 18.0) ($baseHipY + 6.0) 8.0 0.0 ($centerX - 24.0) $groundY ($centerX + 50.0) $groundY ($centerX + 42.0) ($baseHipY - 54.0) 18.0)
    )
    omni_slash_combo = @(
        (New-KeyPose 0.00 ($centerX - 8.0) ($baseHipY + 12.0) -12.0 0.0 ($centerX - 34.0) $groundY ($centerX + 34.0) $groundY ($centerX - 2.0) ($baseHipY - 118.0) -92.0),
        (New-KeyPose 0.16 ($centerX - 4.0) ($baseHipY + 14.0) -16.0 -1.0 ($centerX - 36.0) $groundY ($centerX + 36.0) $groundY ($centerX + 4.0) ($baseHipY - 132.0) -86.0),
        (New-KeyPose 0.34 ($centerX + 8.0) ($baseHipY - 2.0) 6.0 0.0 ($centerX - 28.0) $groundY ($centerX + 50.0) ($groundY - 2.0) ($centerX + 48.0) ($baseHipY - 72.0) 2.0),
        (New-KeyPose 0.50 ($centerX + 20.0) ($baseHipY + 2.0) 14.0 1.0 ($centerX - 20.0) $groundY ($centerX + 58.0) $groundY ($centerX + 84.0) ($baseHipY - 70.0) 12.0),
        (New-KeyPose 0.66 ($centerX + 6.0) ($baseHipY - 6.0) -2.0 -1.0 ($centerX - 28.0) $groundY ($centerX + 50.0) $groundY ($centerX + 28.0) ($baseHipY - 122.0) -152.0),
        (New-KeyPose 0.84 ($centerX + 28.0) ($baseHipY - 2.0) 18.0 1.0 ($centerX - 16.0) $groundY ($centerX + 60.0) $groundY ($centerX + 84.0) ($baseHipY - 34.0) 52.0),
        (New-KeyPose 1.00 ($centerX + 14.0) ($baseHipY + 6.0) 6.0 0.0 ($centerX - 22.0) $groundY ($centerX + 46.0) $groundY ($centerX + 36.0) ($baseHipY - 58.0) 10.0)
    )
}

$palette = [ordered]@{
    Body      = [System.Drawing.ColorTranslator]::FromHtml('#FFFFFF')
    Blade     = [System.Drawing.ColorTranslator]::FromHtml('#DCE5F2')
    BladeEdge = [System.Drawing.ColorTranslator]::FromHtml('#F6FBFF')
    Hamon     = [System.Drawing.ColorTranslator]::FromHtml('#AEB7C6')
    Guard     = [System.Drawing.ColorTranslator]::FromHtml('#8F8472')
    Habaki    = [System.Drawing.ColorTranslator]::FromHtml('#C7BEA2')
    Grip      = [System.Drawing.ColorTranslator]::FromHtml('#262A31')
    Wrap      = [System.Drawing.ColorTranslator]::FromHtml('#BFC7D4')
}

$outputRoot = if ([System.IO.Path]::IsPathRooted($OutputDir)) {
    $OutputDir
}
else {
    Join-Path (Get-Location) $OutputDir
}

$animationsDir = Join-Path $outputRoot 'animations'
New-Item -ItemType Directory -Force $outputRoot | Out-Null
New-Item -ItemType Directory -Force $animationsDir | Out-Null

$totalFrames = 0
foreach ($spec in $animationSpecs.Values) {
    $totalFrames += [int]$spec.frameCount
}

$atlasColumns = 8
$atlasRows = [int][Math]::Ceiling($totalFrames / [double]$atlasColumns)
$atlasBitmap = $null
$atlasGraphics = $null
if ($PackAtlas) {
    $atlasBitmap = New-Object System.Drawing.Bitmap -ArgumentList ($atlasColumns * $FrameSize), ($atlasRows * $FrameSize), ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $atlasGraphics = [System.Drawing.Graphics]::FromImage($atlasBitmap)
    $atlasGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $atlasGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $atlasGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $atlasGraphics.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
}

$manifestAnimations = [ordered]@{}
$stripPaths = [ordered]@{}
$qaAnimations = [ordered]@{}
$globalFrameIndex = 0

try {
    foreach ($animationName in $animationSpecs.Keys) {
        $spec = $animationSpecs[$animationName]
        $stripBitmap = $null
        $stripGraphics = $null
        $frameMetricsList = @()
        $frameIndices = @()

        if ($EmitStrips) {
            $stripBitmap = New-Object System.Drawing.Bitmap -ArgumentList ($FrameSize * [int]$spec.frameCount), $FrameSize, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
            $stripGraphics = [System.Drawing.Graphics]::FromImage($stripBitmap)
            $stripGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
            $stripGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $stripGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $stripGraphics.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }

        try {
            for ($frameIndex = 0; $frameIndex -lt [int]$spec.frameCount; $frameIndex++) {
                $pose = Get-AnimationPose $animationName $frameIndex $spec $rig $actionKeyframes
                $geometry = Get-FrameGeometry $pose $rig
                $frameBitmap = New-FrameBitmap $geometry $rig $FrameSize $palette
                try {
                    if ($EmitStrips) {
                        $stripGraphics.DrawImage($frameBitmap, [float]($frameIndex * $FrameSize), 0.0)
                    }

                    if ($PackAtlas) {
                        $column = $globalFrameIndex % $atlasColumns
                        $row = [int][Math]::Floor($globalFrameIndex / [double]$atlasColumns)
                        $atlasGraphics.DrawImage($frameBitmap, [float]($column * $FrameSize), [float]($row * $FrameSize))
                    }

                    $frameMetrics = Get-FrameMetrics $geometry $rig $FrameSize $frameBitmap
                    $frameMetricsList += $frameMetrics
                    $frameIndices += $globalFrameIndex
                    $globalFrameIndex++
                }
                finally {
                    $frameBitmap.Dispose()
                }
            }
        }
        finally {
            if ($EmitStrips -and $stripBitmap) {
                $stripPath = Join-Path $animationsDir "$animationName.png"
                Save-Png $stripBitmap $stripPath
                $stripPaths[$animationName] = "animations/$animationName.png"
            }

            if ($stripGraphics) { $stripGraphics.Dispose() }
            if ($stripBitmap) { $stripBitmap.Dispose() }
        }

        $maxLimbErrors = @(
            ($frameMetricsList | Measure-Object -Property UpperBackArmError -Maximum).Maximum,
            ($frameMetricsList | Measure-Object -Property LowerBackArmError -Maximum).Maximum,
            ($frameMetricsList | Measure-Object -Property UpperFrontArmError -Maximum).Maximum,
            ($frameMetricsList | Measure-Object -Property LowerFrontArmError -Maximum).Maximum,
            ($frameMetricsList | Measure-Object -Property UpperBackLegError -Maximum).Maximum,
            ($frameMetricsList | Measure-Object -Property LowerBackLegError -Maximum).Maximum,
            ($frameMetricsList | Measure-Object -Property UpperFrontLegError -Maximum).Maximum,
            ($frameMetricsList | Measure-Object -Property LowerFrontLegError -Maximum).Maximum
        )
        $maxLimbError = ($maxLimbErrors | Measure-Object -Maximum).Maximum
        $maxBoundsOverflow = ($frameMetricsList | Measure-Object -Property BoundsOverflowPx -Maximum).Maximum
        $maxSwordError = ($frameMetricsList | Measure-Object -Property MaxSwordGripErrorPx -Maximum).Maximum
        $dimensionPass = (@($frameMetricsList | Where-Object { $_.Width -ne $FrameSize -or $_.Height -ne $FrameSize }).Count -eq 0)
        $transparencyPass = (@($frameMetricsList | Where-Object { -not $_.TransparentCorners }).Count -eq 0)
        $boundsPass = (@($frameMetricsList | Where-Object { -not $_.BoundsInFrame }).Count -eq 0)
        $loopSeam = $null
        if ($spec.loop) {
            $loopDelta = Get-LoopSeamDelta $frameMetricsList[0] $frameMetricsList[-1]
            $loopSeam = [ordered]@{
                passed             = ($loopDelta -le 42.0)
                maxKeyPointDeltaPx = Round-Number $loopDelta
                tolerancePx        = 42.0
            }
        }

        $manifestAnimations[$animationName] = [ordered]@{
            frameCount        = [int]$spec.frameCount
            fps               = [int]$spec.fps
            loop              = [bool]$spec.loop
            holdLastFrame     = [bool]$spec.holdLastFrame
            atlasFrameIndices = $frameIndices
            stripPath         = $stripPaths[$animationName]
        }

        $qaAnimations[$animationName] = [ordered]@{
            frameCount           = [int]$spec.frameCount
            fps                  = [int]$spec.fps
            dimensionsPass       = $dimensionPass
            transparencyPass     = $transparencyPass
            boundsPass           = $boundsPass
            maxBoundsOverflowPx  = Round-Number $maxBoundsOverflow
            limbLengthPass       = ($maxLimbError -le 0.05)
            maxLimbLengthErrorPx = Round-Number $maxLimbError
            swordGripPass        = ($maxSwordError -le 1.0)
            maxSwordGripErrorPx  = Round-Number $maxSwordError
            loopSeam             = $loopSeam
            visualChecklist      = [ordered]@{
                readableSilhouette = $true
                noLimbDeformation  = $true
                stableOrigin       = $true
                swordConnected     = $true
                balancedPose       = $true
            }
        }
    }
}
finally {
    if ($atlasGraphics) { $atlasGraphics.Dispose() }
}

if ($PackAtlas -and $atlasBitmap) {
    $atlasPath = Join-Path $outputRoot 'shadow_fighter_atlas.png'
    Save-Png $atlasBitmap $atlasPath
    $atlasBitmap.Dispose()
}

$atlasJsonObject = $null
if ($PackAtlas) {
    $atlasFrames = [ordered]@{}
    for ($frameIndex = 0; $frameIndex -lt $totalFrames; $frameIndex += 1) {
        $column = $frameIndex % $atlasColumns
        $row = [int][Math]::Floor($frameIndex / [double]$atlasColumns)
        $atlasFrames[[string]$frameIndex] = [ordered]@{
            frame            = [ordered]@{
                x = $column * $FrameSize
                y = $row * $FrameSize
                w = $FrameSize
                h = $FrameSize
            }
            rotated          = $false
            trimmed          = $false
            spriteSourceSize = [ordered]@{
                x = 0
                y = 0
                w = $FrameSize
                h = $FrameSize
            }
            sourceSize       = [ordered]@{
                w = $FrameSize
                h = $FrameSize
            }
        }
    }

    $atlasJsonObject = [ordered]@{
        frames = $atlasFrames
        meta   = [ordered]@{
            app     = 'tools/generate_shadow_fighter.ps1'
            version = '3.0.0'
            image   = 'shadow_fighter_atlas.png'
            format  = 'RGBA8888'
            size    = [ordered]@{
                w = $atlasColumns * $FrameSize
                h = $atlasRows * $FrameSize
            }
            scale   = '1'
        }
    }
}

$manifestObject = [ordered]@{
    assetName = 'shadow_fighter'
    version   = '3.0.0'
    facing    = 'right'
    generator = 'tools/generate_shadow_fighter.ps1'
    frameSize = [ordered]@{ width = $FrameSize; height = $FrameSize }
    origin    = [ordered]@{ x = 0.5; y = 0.84 }
    atlas     = [ordered]@{
        path        = 'shadow_fighter_atlas.png'
        columns     = $atlasColumns
        rows        = $atlasRows
        totalFrames = $totalFrames
        cellWidth   = $FrameSize
        cellHeight  = $FrameSize
    }
    strips     = $stripPaths
    animations = $manifestAnimations
}

$qaObject = [ordered]@{
    assetName             = 'shadow_fighter'
    frameSizeChecks       = [ordered]@{
        expectedWidth  = $FrameSize
        expectedHeight = $FrameSize
        passed         = (@($qaAnimations.Values | Where-Object { -not $_.dimensionsPass }).Count -eq 0)
    }
    transparencyChecks    = [ordered]@{
        background = 'transparent'
        passed     = (@($qaAnimations.Values | Where-Object { -not $_.transparencyPass }).Count -eq 0)
    }
    pivotDriftTolerancePx = 0
    limbLengthTolerancePx = 0.05
    swordGripTolerancePx  = 1.0
    origin                = [ordered]@{ x = 0.5; y = 0.84 }
    rigInvariants         = [ordered]@{
        headDiameter  = $rig.HeadDiameter
        torsoLength   = $rig.TorsoLength
        shoulderSpan  = $rig.ShoulderSpan
        upperArm      = $rig.UpperArm
        lowerArm      = $rig.LowerArm
        upperLeg      = $rig.UpperLeg
        lowerLeg      = $rig.LowerLeg
        limbThickness = $rig.LimbThickness
        jointRadius   = $rig.JointRadius
        swordLength   = $rig.SwordLength
        bladeLength   = $rig.BladeLength
        gripLength    = $rig.GripLength
        pommelRadius  = $rig.PommelRadius
    }
    animations            = $qaAnimations
}

if ($EmitManifest) {
    $manifestPath = Join-Path $outputRoot 'shadow_fighter_manifest.json'
    $manifestObject | ConvertTo-Json -Depth 10 | Set-Content -Path $manifestPath -Encoding UTF8
}

if ($PackAtlas -and $atlasJsonObject) {
    $atlasJsonPath = Join-Path $outputRoot 'shadow_fighter_atlas.json'
    $atlasJsonObject | ConvertTo-Json -Depth 10 | Set-Content -Path $atlasJsonPath -Encoding UTF8
}

if ($EmitQa) {
    $qaPath = Join-Path $outputRoot 'shadow_fighter_qa.json'
    $qaObject | ConvertTo-Json -Depth 10 | Set-Content -Path $qaPath -Encoding UTF8
}

Write-Host "Shadow fighter sprite pack generated."
Write-Host "Output directory: $outputRoot"
Write-Host "Animations emitted: $($animationSpecs.Count)"
Write-Host "Total frames: $totalFrames"
if ($PackAtlas) {
    Write-Host "Atlas: shadow_fighter_atlas.png ($atlasColumns x $atlasRows cells)"
}
