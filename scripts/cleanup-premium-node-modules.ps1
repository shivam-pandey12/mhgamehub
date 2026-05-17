$ErrorActionPreference = "Stop"

$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$gameRoots = @(
    (Join-Path $workspaceRoot "games"),
    (Join-Path $workspaceRoot "premium\premium-games")
)

function Test-IsInsideRoot {
    param(
        [string] $PathToCheck,
        [string[]] $AllowedRoots
    )

    $normalizedPath = $PathToCheck.TrimEnd('\')
    foreach ($allowedRoot in $AllowedRoots) {
        $normalizedRoot = $allowedRoot.TrimEnd('\')
        if ($normalizedPath -eq $normalizedRoot -or $normalizedPath.StartsWith("$normalizedRoot\", [System.StringComparison]::OrdinalIgnoreCase)) {
            return $true
        }
    }

    return $false
}

$existingRoots = $gameRoots | Where-Object { Test-Path -LiteralPath $_ } | ForEach-Object {
    (Resolve-Path -LiteralPath $_).Path
}

if (-not $existingRoots) {
    throw "No game roots were found under: $workspaceRoot"
}

$targets = foreach ($root in $existingRoots) {
    Get-ChildItem -LiteralPath $root -Directory -Filter "node_modules" -Recurse -Force | ForEach-Object {
        $resolved = (Resolve-Path -LiteralPath $_.FullName).Path
        if (-not (Test-IsInsideRoot -PathToCheck $resolved -AllowedRoots $existingRoots)) {
            throw "Refusing to delete unexpected path outside the game roots: $resolved"
        }

        $workspacePrefix = $workspaceRoot.TrimEnd('\')
        $relative = $resolved.Substring($workspacePrefix.Length).TrimStart('\')
        $segments = $relative -split '[\\/]'
        $parentSegments = if ($segments.Length -gt 1) { $segments[0..($segments.Length - 2)] } else { @() }
        if ($parentSegments -contains "node_modules") {
            return
        }

        $resolved
    }
}

$targets = $targets | Sort-Object -Unique

if (-not $targets) {
    Write-Host "No game node_modules folders were found."
    exit 0
}

Write-Host "Removing the following game node_modules folders:"
$targets | ForEach-Object { Write-Host " - $_" }

Remove-Item -LiteralPath $targets -Recurse -Force

Write-Host "Game node_modules cleanup completed."
