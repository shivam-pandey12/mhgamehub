(function () {
    "use strict";

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 500;
    const GAME_TITLE = "Shadow Fighter Duel v2";
    const GAME_VERSION = "v1.0.0";
    const GROUND_TOP = 440;
    const ASSET_BASE = "./assets/shadow-fighter";
    const SOUND_BASE = "./sounds";
    const ATLAS_IMAGE_URL = `${ASSET_BASE}/shadow_fighter_atlas.png`;
    const ATLAS_JSON_URL = `${ASSET_BASE}/shadow_fighter_atlas.json`;
    const CLASH_SOUND_URL = `${SOUND_BASE}/freesound_community-sword-35999.mp3`;
    const TEXTURE_KEY = "fighter";
    const CLASH_SOUND_KEY = "sword-clash";
    const STATUS_ID = "status";
    const SPRITE_SCALE = 0.54;
    const SPRITE_ORIGIN = { x: 0.5, y: 0.84 };
    const BODY_SIZE = { width: 82, height: 176 };
    const INTRO = {
        playerSpawnX: 110,
        enemySpawnX: 690,
        playerReadyX: 280,
        enemyReadyX: 520,
        tolerance: 8
    };
    const PHYSICS = {
        gravityY: 1720,
        dragX: 2550,
        maxFallSpeed: 1280,
        maxHorizontalSpeed: 520,
        walkSpeed: 246,
        runSpeed: 476,
        groundAcceleration: 3620,
        runAcceleration: 4460,
        airControl: 0.72,
        jumpVelocity: -840
    };
    const COMBAT = {
        maxHealth: 300,
        parryActiveMs: 120,
        parryEndMs: 240,
        parryAdvantageMs: 260,
        knockdownMs: 1200,
        airClashStunMs: 230,
        hitstopLightMs: 32,
        hitstopHeavyMs: 48,
        hitstopBlockMs: 24,
        hitstopFinisherMs: 68,
        hitstopParryMs: 46,
        hitstopAirClashMs: 54,
        hitstopProjectileMs: 22,
        aiAttackMinMs: 160,
        aiAttackMaxMs: 420,
        aiFarRange: 260,
        aiMidRange: 180,
        aiCloseRange: 124,
        aiReactionCooldownMs: 130,
        aiReactionWindowMs: 300,
        aiParryChance: 16,
        aiGuardChance: 34,
        aiPressureRange: 178,
        aiRetreatRange: 76,
        aiStrategicPickChance: 0.42,
        aiPunishPickChance: 0.78,
        aiFinisherPickChance: 0.86
    };
    const AI_DIFFICULTY_PROFILES = {
        hard: {
            key: "hard",
            label: "Hard",
            summaryLabel: "Hard Duelist",
            summaryNote: "Aggressive pressure, faster punishes, and heavier special-move usage.",
            attackMinMs: COMBAT.aiAttackMinMs,
            attackMaxMs: COMBAT.aiAttackMaxMs,
            farRange: COMBAT.aiFarRange,
            midRange: COMBAT.aiMidRange,
            closeRange: COMBAT.aiCloseRange,
            reactionCooldownMs: COMBAT.aiReactionCooldownMs,
            reactionWindowMs: COMBAT.aiReactionWindowMs,
            parryChance: COMBAT.aiParryChance,
            guardChance: COMBAT.aiGuardChance,
            pressureRange: COMBAT.aiPressureRange,
            retreatRange: COMBAT.aiRetreatRange,
            strategicPickChance: COMBAT.aiStrategicPickChance,
            punishPickChance: COMBAT.aiPunishPickChance,
            finisherPickChance: COMBAT.aiFinisherPickChance,
            forceBestMoveChance: 0.72,
            powerMoveBias: 1.08,
            lowHealthPowerBias: 1.16,
            antiAirJumpChance: 36,
            comboBreakChance: 24,
            blinkFollowMinMs: 80,
            blinkFollowMaxMs: 150,
            punishFollowMinMs: 150,
            punishFollowMaxMs: 280
        },
        boss: {
            key: "boss",
            label: "Boss",
            summaryLabel: "Boss Execution",
            summaryNote: "Relentless pressure, faster reactions, and much stronger preference for supers and finishers.",
            attackMinMs: 90,
            attackMaxMs: 260,
            farRange: 252,
            midRange: 186,
            closeRange: 132,
            reactionCooldownMs: 76,
            reactionWindowMs: 360,
            parryChance: 22,
            guardChance: 42,
            pressureRange: 192,
            retreatRange: 54,
            strategicPickChance: 0.78,
            punishPickChance: 0.98,
            finisherPickChance: 1,
            forceBestMoveChance: 0.94,
            powerMoveBias: 1.2,
            lowHealthPowerBias: 1.34,
            antiAirJumpChance: 52,
            comboBreakChance: 8,
            blinkFollowMinMs: 46,
            blinkFollowMaxMs: 104,
            punishFollowMinMs: 90,
            punishFollowMaxMs: 190
        }
    };
    const INPUT = {
        lightHoldMs: 120,
        heavyHoldMs: 180,
        energyChargeMs: 140,
        energyReleaseMidMs: 320,
        energyReleaseMaxMs: 560
    };
    const CELEBRATION = {
        durationMs: 3400,
        emoteIntervalMs: 560,
        poseIntervalMs: 520,
        hopIntervalMs: 860,
        hopVelocity: -250,
        emotes: [
            { text: "GG", emphasis: 0.08 },
            { text: "HYPE", emphasis: 0.14 },
            { text: "YES!", emphasis: 0.1 },
            { text: "CLEAN", emphasis: 0.18 },
            { text: "LEGEND", emphasis: 0.22 },
            { text: "KATANA!", emphasis: 0.16 }
        ],
        poses: ["idle", "run", "flourish", "showoff", "run", "idle"]
    };
    const HISTORY_PREVIEW_COUNT = 3;
    const TOUCH_CONTROL_KEYS = ["left", "right", "up", "down", "run", "light", "power", "special", "guard", "super", "blink"];
    const THEME_STORAGE_KEY = "shadow_fighter_theme_v1";
    const SOUND_STORAGE_KEY = "shadow_fighter_sound_v1";
    const DIFFICULTY_STORAGE_KEY = "shadow_fighter_difficulty_v1";
    const HUD_LAYOUT_STORAGE_KEY = "shadow_fighter_hud_layout_v1";
    const DEFAULT_HUD_LAYOUT = {
        joystick: { x: 0.18, y: 0.76 },
        run: { x: 0.31, y: 0.64 },
        combat: { x: 0.83, y: 0.76 }
    };
    const SCENE_THEMES = {
        dark: {
            name: "dark",
            cameraBackgroundCss: "#0d1016",
            backdrop: {
                skyBase: 0x0a0f17,
                skyMid: 0x141d2d,
                skyLower: 0x1a2130,
                orbGlow: 0x8ee8ff,
                orbCore: 0xe9fbff,
                orbHalo: 0xa0dbff,
                orbGlowAlpha: 0.08,
                orbGlowPulse: 0.015,
                cloudColors: [
                    { color: 0x3a4f72, alpha: 0.12 },
                    { color: 0x29384f, alpha: 0.10 },
                    { color: 0x344660, alpha: 0.08 }
                ],
                columnColor: 0x243046,
                columnAlpha: 0.88,
                columnGlow: 0x84d4ff,
                columnGlowAlpha: 0.06,
                floorBase: 0x0b1019,
                floorLine: 0x89ebff,
                floorLineAlpha: 0.25,
                floorLineSoftAlpha: 0.12
            },
            ground: {
                fill: 0x232d3d,
                lip: 0x06080c,
                lipAlpha: 0.35
            },
            ui: {
                text: "#eff7ff",
                muted: "#a4afc9",
                title: "#84d4ff",
                panelFill: 0x0f151d,
                panelAlpha: 0.95,
                panelStroke: 0x3a4d66,
                playerBarBg: 0x0f151d,
                enemyBarBg: 0x0f151d,
                overlayFill: 0x090c12,
                overlayAlpha: 0.88,
                overlayStroke: 0x4b5f79
            },
            health: {
                playerFull: 0x75f3a6,
                enemyFull: 0xffb070,
                low: 0xff667d
            },
            actors: {
                playerAccent: 0x86efff,
                enemyAccent: 0xff8bbf,
                enemyBaseTint: 0xd4ddff,
                afterImagePlayer: 0x8ee8ff,
                afterImageEnemy: 0xffb0d8
            },
            effects: {
                moveText: 0x84d4ff,
                focusText: 0x8af8ff,
                queuePulse: 0xdffcff,
                flashBase: 0xe3f7ff,
                spriteFlash: 0xffffff,
                blockSpriteFlash: 0xb5d7ff,
                blockOverlay: 0xbfdcff,
                impactCore: 0xffffff,
                blockedImpact: 0x9fc8ff,
                projectileCore: 0xffffff,
                projectileBlockLine: 0xcfe7ff,
                parryFlash: 0xffffff,
                parryLine: 0xffffff,
                teleportLine: 0xffffff,
                tintWarm: 0x84d4ff,
                tintHighlight: 0xffffff,
                tintMix: 0.04,
                glowMix: 0
            }
        },
        light: {
            name: "light",
            cameraBackgroundCss: "#fffaf0",
            backdrop: {
                skyBase: 0xfffbf4,
                skyMid: 0xf6e9cf,
                skyLower: 0xe9d4a7,
                orbGlow: 0xf0cb7f,
                orbCore: 0xfff9ea,
                orbHalo: 0xf6ddb1,
                orbGlowAlpha: 0.16,
                orbGlowPulse: 0.025,
                cloudColors: [
                    { color: 0xf0e4cb, alpha: 0.42 },
                    { color: 0xe6d6b6, alpha: 0.34 },
                    { color: 0xddc596, alpha: 0.28 }
                ],
                columnColor: 0xc8b18a,
                columnAlpha: 0.88,
                columnGlow: 0xf4d38c,
                columnGlowAlpha: 0.22,
                floorBase: 0xd7bd88,
                floorLine: 0xa77f3f,
                floorLineAlpha: 0.42,
                floorLineSoftAlpha: 0.22
            },
            ground: {
                fill: 0xcfb179,
                lip: 0xa07a41,
                lipAlpha: 0.32
            },
            ui: {
                text: "#3d2f1c",
                muted: "#7d6743",
                title: "#b88a3b",
                panelFill: 0xfff7ec,
                panelAlpha: 0.96,
                panelStroke: 0xcfa55d,
                playerBarBg: 0xf4e7cd,
                enemyBarBg: 0xf4e7cd,
                overlayFill: 0xf6eddd,
                overlayAlpha: 0.94,
                overlayStroke: 0xcfaa68
            },
            health: {
                playerFull: 0x71bf82,
                enemyFull: 0xd8a552,
                low: 0xd66e62
            },
            actors: {
                playerAccent: 0xdab066,
                enemyAccent: 0xc69148,
                enemyBaseTint: 0xf2e2c6,
                afterImagePlayer: 0xe3bc74,
                afterImageEnemy: 0xd4a15f
            },
            effects: {
                moveText: 0xb88a3b,
                focusText: 0xd4a850,
                queuePulse: 0xf2dcb0,
                flashBase: 0xffefcf,
                spriteFlash: 0xfffbf1,
                blockSpriteFlash: 0xf5dfb0,
                blockOverlay: 0xf2d6a5,
                impactCore: 0xfff8ec,
                blockedImpact: 0xe2bf7b,
                projectileCore: 0xfff9ec,
                projectileBlockLine: 0xe5bf72,
                parryFlash: 0xfff7e1,
                parryLine: 0xf7ddb0,
                teleportLine: 0xf4d59c,
                tintWarm: 0xd9a24c,
                tintHighlight: 0xfff6df,
                tintMix: 0.44,
                glowMix: 0.68
            }
        }
    };
    const ANIM_FRAMES = {
        idle: [0, 1, 2, 3, 4, 5],
        walk: [6, 7, 8, 9, 10, 11, 12, 13],
        run: [14, 15, 16, 17, 18, 19, 20, 21],
        jump: [22, 23, 24, 25, 26, 27],
        quick_slash: [28, 29, 30, 31, 32, 33, 34, 35],
        upward_slash: [36, 37, 38, 39, 40, 41, 42, 43],
        downward_strike: [44, 45, 46, 47, 48, 49, 50, 51],
        triple_slash_combo: [52, 53, 54, 55, 56, 57, 58, 59, 60, 61],
        spin_attack: [62, 63, 64, 65, 66, 67, 68, 69],
        dash_slash: [70, 71, 72, 73, 74, 75, 76, 77],
        block: [78, 79, 80, 81, 82],
        parry: [83, 84, 85, 86, 87],
        charged_strike: [88, 89, 90, 91, 92, 93, 94, 95],
        iaido_slash: [96, 97, 98, 99, 100, 101, 102, 103],
        air_combo_finisher: [104, 105, 106, 107, 108, 109, 110, 111],
        teleport_slash: [112, 113, 114, 115, 116, 117, 118, 119],
        energy_slash: [120, 121, 122, 123, 124, 125, 126, 127],
        hit_reaction: [128, 129, 130, 131, 132],
        knockdown: [133, 134, 135, 136, 137, 138, 139, 140],
        blink_step: [141, 142, 143, 144, 145, 146],
        super_slash: [147, 148, 149, 150, 151, 152, 153, 154, 155, 156],
        omni_slash_combo: [157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168]
    };
    const ANIM_CONFIG = {
        idle: { frameRate: 8, repeat: -1 },
        walk: { frameRate: 10, repeat: -1 },
        run: { frameRate: 14, repeat: -1 },
        jump: { frameRate: 12, repeat: 0 },
        quick_slash: { frameRate: 14, repeat: 0 },
        upward_slash: { frameRate: 12, repeat: 0 },
        downward_strike: { frameRate: 12, repeat: 0 },
        triple_slash_combo: { frameRate: 16, repeat: 0 },
        spin_attack: { frameRate: 14, repeat: 0 },
        dash_slash: { frameRate: 15, repeat: 0 },
        block: { frameRate: 10, repeat: 0 },
        parry: { frameRate: 14, repeat: 0 },
        charged_strike: { frameRate: 10, repeat: 0 },
        iaido_slash: { frameRate: 16, repeat: 0 },
        air_combo_finisher: { frameRate: 14, repeat: 0 },
        teleport_slash: { frameRate: 16, repeat: 0 },
        energy_slash: { frameRate: 14, repeat: 0 },
        hit_reaction: { frameRate: 12, repeat: 0 },
        knockdown: { frameRate: 10, repeat: 0 },
        blink_step: { frameRate: 18, repeat: 0 },
        super_slash: { frameRate: 14, repeat: 0 },
        omni_slash_combo: { frameRate: 18, repeat: 0 }
    };
    const MOVE_DEFS = {
        quick_slash: {
            label: "Quick Slash",
            animation: "quick_slash",
            tint: 0x8cecff,
            groundedOnly: true,
            lunge: 90,
            finishMs: 430,
            cooldownMs: 180,
            chain: { start: 150, end: 300, next: "triple_slash_combo", input: "light" },
            windows: [{
                start: 84,
                end: 138,
                damage: 12,
                blockDamage: 3,
                hitStunMs: 220,
                blockStunMs: 145,
                knockbackX: 250,
                blockKnockbackX: 110,
                knockbackY: -90,
                shakeDuration: 90,
                shakeIntensity: 0.0032,
                box: { width: 120, height: 72, forwardOffset: 98, yOffset: -24 },
                slash: { centerOffsetX: 20, centerOffsetY: -58, radius: 88, startAngle: -146, endAngle: -18, tint: 0x8cecff, glow: 0xffffff, thickness: 24, durationMs: 170 }
            }]
        },
        upward_slash: {
            label: "Upward Slash",
            animation: "upward_slash",
            tint: 0x9ff7ff,
            groundedOnly: true,
            lunge: 76,
            finishMs: 480,
            cooldownMs: 210,
            windows: [{
                start: 110,
                end: 176,
                damage: 14,
                blockDamage: 4,
                hitStunMs: 260,
                blockStunMs: 155,
                knockbackX: 185,
                blockKnockbackX: 96,
                knockbackY: -280,
                shakeDuration: 104,
                shakeIntensity: 0.0038,
                box: { width: 104, height: 138, forwardOffset: 70, yOffset: -88 },
                slash: { centerOffsetX: 12, centerOffsetY: -68, radius: 96, startAngle: 138, endAngle: -48, tint: 0x9ff7ff, glow: 0xffffff, thickness: 24, durationMs: 180 }
            }]
        },
        downward_strike: {
            label: "Downward Strike",
            animation: "downward_strike",
            tint: 0xffd8a4,
            airOnly: true,
            lunge: 84,
            finishMs: 560,
            cooldownMs: 260,
            dive: { startAt: 170, velocityY: 560, shockOnLand: true },
            windows: [{
                start: 176,
                end: 262,
                damage: 18,
                blockDamage: 4,
                hitStunMs: 280,
                blockStunMs: 165,
                knockbackX: 260,
                blockKnockbackX: 118,
                knockbackY: 180,
                shakeDuration: 126,
                shakeIntensity: 0.0046,
                box: { width: 96, height: 120, forwardOffset: 40, yOffset: -6 },
                slash: { centerOffsetX: 16, centerOffsetY: -36, radius: 104, startAngle: -72, endAngle: 102, tint: 0xffd8a4, glow: 0xffffff, thickness: 28, durationMs: 190 },
                forceKnockdown: true
            }]
        },
        triple_slash_combo: {
            label: "Triple Slash Combo",
            animation: "triple_slash_combo",
            tint: 0xc99cff,
            groundedOnly: true,
            lunge: 98,
            finishMs: 920,
            cooldownMs: 300,
            windows: [
                {
                    start: 96,
                    end: 146,
                    damage: 9,
                    blockDamage: 2,
                    hitStunMs: 160,
                    blockStunMs: 120,
                    knockbackX: 210,
                    blockKnockbackX: 88,
                    knockbackY: -64,
                    shakeDuration: 72,
                    shakeIntensity: 0.0026,
                    box: { width: 116, height: 70, forwardOffset: 96, yOffset: -28 },
                    slash: { centerOffsetX: 20, centerOffsetY: -64, radius: 88, startAngle: -130, endAngle: -4, tint: 0x8ef4ff, glow: 0xffffff, thickness: 22, durationMs: 150 }
                },
                {
                    start: 240,
                    end: 304,
                    damage: 9,
                    blockDamage: 3,
                    hitStunMs: 180,
                    blockStunMs: 126,
                    knockbackX: 230,
                    blockKnockbackX: 96,
                    knockbackY: -84,
                    shakeDuration: 86,
                    shakeIntensity: 0.003,
                    box: { width: 126, height: 76, forwardOffset: 106, yOffset: -18 },
                    slash: { centerOffsetX: 28, centerOffsetY: -52, radius: 92, startAngle: 30, endAngle: -148, tint: 0xffb7ff, glow: 0xffffff, thickness: 24, durationMs: 165 }
                },
                {
                    start: 404,
                    end: 474,
                    damage: 12,
                    blockDamage: 4,
                    hitStunMs: 310,
                    blockStunMs: 180,
                    knockbackX: 348,
                    blockKnockbackX: 156,
                    knockbackY: -140,
                    shakeDuration: 150,
                    shakeIntensity: 0.0058,
                    box: { width: 162, height: 100, forwardOffset: 118, yOffset: -12 },
                    slash: { centerOffsetX: 18, centerOffsetY: -94, radius: 132, startAngle: -96, endAngle: 86, tint: 0xffd8a8, glow: 0xffffff, thickness: 32, durationMs: 210 }
                }
            ]
        },
        spin_attack: {
            label: "Spin Attack",
            animation: "spin_attack",
            tint: 0xfff2a9,
            groundedOnly: true,
            lunge: 22,
            finishMs: 610,
            cooldownMs: 260,
            windows: [{
                start: 150,
                end: 250,
                damage: 16,
                blockDamage: 4,
                hitStunMs: 240,
                blockStunMs: 150,
                knockbackX: 220,
                blockKnockbackX: 108,
                knockbackY: -70,
                shakeDuration: 120,
                shakeIntensity: 0.0042,
                box: { width: 182, height: 100, forwardOffset: 0, yOffset: -18, bothSides: true },
                slash: { centerOffsetX: 0, centerOffsetY: -56, radius: 112, startAngle: -180, endAngle: 160, tint: 0xfff2a9, glow: 0xffffff, thickness: 28, durationMs: 200 }
            }]
        },
        dash_slash: {
            label: "Dash Slash",
            animation: "dash_slash",
            tint: 0x8fe9ff,
            groundedOnly: true,
            requiresRun: true,
            lunge: 280,
            finishMs: 470,
            cooldownMs: 260,
            windows: [{
                start: 96,
                end: 154,
                damage: 18,
                blockDamage: 4,
                hitStunMs: 250,
                blockStunMs: 150,
                knockbackX: 300,
                blockKnockbackX: 126,
                knockbackY: -90,
                shakeDuration: 120,
                shakeIntensity: 0.0044,
                box: { width: 146, height: 74, forwardOffset: 116, yOffset: -24 },
                slash: { centerOffsetX: 32, centerOffsetY: -56, radius: 96, startAngle: -44, endAngle: 34, tint: 0x8fe9ff, glow: 0xffffff, thickness: 24, durationMs: 140 }
            }]
        },
        charged_strike: {
            label: "Charged Strike",
            animation: "charged_strike",
            tint: 0xffcc7c,
            groundedOnly: true,
            holdFrameIndex: 88,
            chargeMinMs: 320,
            chargeMaxMs: 700,
            lunge: 122,
            finishMs: 760,
            cooldownMs: 420,
            windows: [{
                start: 220,
                end: 310,
                damage: 26,
                blockDamage: 6,
                hitStunMs: 360,
                blockStunMs: 210,
                knockbackX: 380,
                blockKnockbackX: 170,
                knockbackY: -170,
                shakeDuration: 170,
                shakeIntensity: 0.007,
                box: { width: 170, height: 106, forwardOffset: 124, yOffset: -18 },
                slash: { centerOffsetX: 28, centerOffsetY: -88, radius: 136, startAngle: -118, endAngle: 62, tint: 0xffcc7c, glow: 0xffffff, thickness: 36, durationMs: 230 }
            }]
        },
        iaido_slash: {
            label: "Iaido Slash",
            animation: "iaido_slash",
            tint: 0xd6f9ff,
            groundedOnly: true,
            lunge: 210,
            finishMs: 430,
            cooldownMs: 280,
            windows: [{
                start: 108,
                end: 158,
                damage: 20,
                blockDamage: 4,
                hitStunMs: 270,
                blockStunMs: 150,
                knockbackX: 310,
                blockKnockbackX: 130,
                knockbackY: -96,
                shakeDuration: 126,
                shakeIntensity: 0.0048,
                box: { width: 154, height: 74, forwardOffset: 118, yOffset: -26 },
                slash: { centerOffsetX: 28, centerOffsetY: -54, radius: 108, startAngle: -26, endAngle: 16, tint: 0xd6f9ff, glow: 0xffffff, thickness: 20, durationMs: 120 }
            }]
        },
        air_combo_finisher: {
            label: "Air Combo Finisher",
            animation: "air_combo_finisher",
            tint: 0xffc69e,
            airOnly: true,
            lunge: 92,
            finishMs: 640,
            cooldownMs: 300,
            dive: { startAt: 190, velocityY: 620, shockOnLand: true },
            windows: [{
                start: 214,
                end: 300,
                damage: 22,
                blockDamage: 5,
                hitStunMs: 340,
                blockStunMs: 180,
                knockbackX: 280,
                blockKnockbackX: 132,
                knockbackY: 220,
                shakeDuration: 168,
                shakeIntensity: 0.0068,
                box: { width: 110, height: 136, forwardOffset: 42, yOffset: -6 },
                slash: { centerOffsetX: 18, centerOffsetY: -38, radius: 116, startAngle: -78, endAngle: 108, tint: 0xffc69e, glow: 0xffffff, thickness: 30, durationMs: 210 },
                forceKnockdown: true
            }]
        },
        teleport_slash: {
            label: "Teleport Slash",
            animation: "teleport_slash",
            tint: 0xc7a5ff,
            groundedOnly: true,
            lunge: 0,
            finishMs: 560,
            cooldownMs: 520,
            teleport: { vanishAt: 90, reappearAt: 210, reappearOffset: 92 },
            windows: [{
                start: 232,
                end: 292,
                damage: 18,
                blockDamage: 4,
                hitStunMs: 250,
                blockStunMs: 150,
                knockbackX: 280,
                blockKnockbackX: 124,
                knockbackY: -92,
                shakeDuration: 124,
                shakeIntensity: 0.0048,
                box: { width: 144, height: 76, forwardOffset: 108, yOffset: -26 },
                slash: { centerOffsetX: 24, centerOffsetY: -58, radius: 102, startAngle: -138, endAngle: 4, tint: 0xc7a5ff, glow: 0xffffff, thickness: 26, durationMs: 160 }
            }]
        },
        energy_slash: {
            label: "Energy Slash",
            animation: "energy_slash",
            tint: 0x8af8ff,
            groundedOnly: true,
            lunge: 56,
            finishMs: 560,
            cooldownMs: 420,
            projectile: {
                spawnAt: 210,
                speed: 600,
                lifetimeMs: 520,
                width: 64,
                height: 22,
                yOffset: -58,
                tint: 0x8af8ff,
                glow: 0xffffff,
                damage: 12,
                blockDamage: 3,
                hitStunMs: 200,
                blockStunMs: 140,
                knockbackX: 220,
                blockKnockbackX: 96,
                knockbackY: -66,
                shakeDuration: 86,
                shakeIntensity: 0.0034
            },
            windows: [{
                start: 136,
                end: 208,
                damage: 16,
                blockDamage: 4,
                hitStunMs: 220,
                blockStunMs: 150,
                knockbackX: 240,
                blockKnockbackX: 112,
                knockbackY: -84,
                shakeDuration: 100,
                shakeIntensity: 0.0038,
                box: { width: 132, height: 78, forwardOffset: 106, yOffset: -30 },
                slash: { centerOffsetX: 20, centerOffsetY: -60, radius: 98, startAngle: -122, endAngle: 18, tint: 0x8af8ff, glow: 0xffffff, thickness: 24, durationMs: 180 }
            }]
        },
        blink_step: {
            label: "Blink Step",
            animation: "blink_step",
            tint: 0xb6f7ff,
            groundedOnly: true,
            finishMs: 260,
            cooldownMs: 240,
            teleport: { vanishAt: 36, reappearAt: 108, reappearOffset: 82, side: "front" },
            windows: []
        },
        super_slash: {
            label: "Super Slash",
            animation: "super_slash",
            tint: 0xffe69a,
            groundedOnly: true,
            lunge: 158,
            finishMs: 780,
            cooldownMs: 720,
            windows: [{
                start: 216,
                end: 320,
                damage: 34,
                blockDamage: 7,
                hitStunMs: 420,
                blockStunMs: 220,
                knockbackX: 420,
                blockKnockbackX: 166,
                knockbackY: -180,
                shakeDuration: 220,
                shakeIntensity: 0.0086,
                box: { width: 190, height: 114, forwardOffset: 144, yOffset: -30 },
                slash: { centerOffsetX: 26, centerOffsetY: -78, radius: 144, startAngle: -142, endAngle: 44, tint: 0xffe69a, glow: 0xffffff, thickness: 36, durationMs: 250 },
                edgeSnap: true,
                forceKnockdown: "both"
            }]
        },
        omni_slash_combo: {
            label: "Omni Slash Combo",
            animation: "omni_slash_combo",
            tint: 0x9cefff,
            groundedOnly: true,
            lunge: 126,
            finishMs: 1180,
            cooldownMs: 460,
            windows: [
                {
                    start: 92,
                    end: 148,
                    damage: 10,
                    blockDamage: 3,
                    hitStunMs: 160,
                    blockStunMs: 116,
                    knockbackX: 196,
                    blockKnockbackX: 88,
                    knockbackY: -80,
                    shakeDuration: 78,
                    shakeIntensity: 0.003,
                    box: { width: 92, height: 166, forwardOffset: 58, yOffset: -108 },
                    slashes: [{
                        kind: "line",
                        startOffsetX: 18,
                        startOffsetY: -14,
                        endOffsetX: 18,
                        endOffsetY: -154,
                        tint: 0x9cefff,
                        glow: 0xffffff,
                        thickness: 18,
                        endThickness: 10,
                        durationMs: 148
                    }]
                },
                {
                    start: 228,
                    end: 302,
                    damage: 11,
                    blockDamage: 3,
                    hitStunMs: 170,
                    blockStunMs: 124,
                    knockbackX: 226,
                    blockKnockbackX: 102,
                    knockbackY: -88,
                    shakeDuration: 90,
                    shakeIntensity: 0.0032,
                    box: { width: 168, height: 76, forwardOffset: 118, yOffset: -56 },
                    slashes: [{
                        kind: "line",
                        startOffsetX: 6,
                        startOffsetY: -74,
                        endOffsetX: 154,
                        endOffsetY: -64,
                        tint: 0xb7faff,
                        glow: 0xffffff,
                        thickness: 20,
                        endThickness: 14,
                        durationMs: 156
                    }]
                },
                {
                    start: 400,
                    end: 478,
                    damage: 13,
                    blockDamage: 4,
                    hitStunMs: 220,
                    blockStunMs: 138,
                    knockbackX: 252,
                    blockKnockbackX: 118,
                    knockbackY: -110,
                    shakeDuration: 112,
                    shakeIntensity: 0.0042,
                    box: { width: 156, height: 122, forwardOffset: 114, yOffset: -60 },
                    slashes: [{
                        kind: "line",
                        startOffsetX: 4,
                        startOffsetY: -24,
                        endOffsetX: 128,
                        endOffsetY: -132,
                        tint: 0x8ff0ff,
                        glow: 0xffffff,
                        thickness: 24,
                        endThickness: 12,
                        durationMs: 172
                    }]
                },
                {
                    start: 582,
                    end: 694,
                    damage: 18,
                    blockDamage: 5,
                    hitStunMs: 320,
                    blockStunMs: 176,
                    knockbackX: 338,
                    blockKnockbackX: 142,
                    knockbackY: -136,
                    shakeDuration: 150,
                    shakeIntensity: 0.0061,
                    box: { width: 180, height: 136, forwardOffset: 126, yOffset: -54 },
                    slashes: [
                        {
                            kind: "line",
                            startOffsetX: 14,
                            startOffsetY: -136,
                            endOffsetX: 136,
                            endOffsetY: -24,
                            tint: 0xdffcff,
                            glow: 0xffffff,
                            thickness: 26,
                            endThickness: 14,
                            durationMs: 198
                        },
                        {
                            kind: "line",
                            startOffsetX: 18,
                            startOffsetY: -22,
                            endOffsetX: 128,
                            endOffsetY: -146,
                            tint: 0xb8fdff,
                            glow: 0xffffff,
                            thickness: 18,
                            endThickness: 10,
                            durationMs: 182
                        },
                        {
                            kind: "arc",
                            centerOffsetX: 24,
                            centerOffsetY: -92,
                            radius: 138,
                            startAngle: -126,
                            endAngle: 96,
                            tint: 0xdffcff,
                            glow: 0xffffff,
                            thickness: 30,
                            durationMs: 214
                        }
                    ]
                }
            ]
        }
    };

    function setStatus(message, isError) {
        const status = document.getElementById(STATUS_ID);
        if (!status) {
            return;
        }

        status.textContent = message;
        status.classList.toggle("error", Boolean(isError));
    }

    function isHttpProtocol() {
        return window.location.protocol === "http:" || window.location.protocol === "https:";
    }

    async function detectAssetMode() {
        const explicitMode = window.__SHADOW_FIGHTER_ASSET_MODE;
        if (explicitMode === "atlas") {
            return "atlas";
        }

        if (explicitMode === "grid") {
            return "grid";
        }

        if (!isHttpProtocol()) {
            return "grid";
        }

        try {
            const response = await fetch(ATLAS_JSON_URL, { cache: "no-store" });
            return response.ok ? "atlas" : "grid";
        } catch (error) {
            return "grid";
        }
    }

    function mirrorAngle(angle) {
        return 180 - angle;
    }

    function buildArcPoints(radius, startAngle, endAngle, facing, segments) {
        const adjustedStart = facing < 0 ? mirrorAngle(startAngle) : startAngle;
        const adjustedEnd = facing < 0 ? mirrorAngle(endAngle) : endAngle;
        const points = [];

        for (let index = 0; index <= segments; index++) {
            const t = index / segments;
            const angle = Phaser.Math.DegToRad(Phaser.Math.Linear(adjustedStart, adjustedEnd, t));
            points.push(new Phaser.Math.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius));
        }

        return points;
    }

    function buildLineRibbon(startPoint, endPoint, startThickness, endThickness) {
        const direction = new Phaser.Math.Vector2(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        if (direction.lengthSq() <= 0.0001) {
            return [startPoint.clone()];
        }

        direction.normalize();
        const normal = new Phaser.Math.Vector2(-direction.y, direction.x);
        const startHalf = (startThickness || 0) * 0.5;
        const endHalf = (endThickness || startThickness || 0) * 0.5;

        return [
            new Phaser.Math.Vector2(startPoint.x + (normal.x * startHalf), startPoint.y + (normal.y * startHalf)),
            new Phaser.Math.Vector2(endPoint.x + (normal.x * endHalf), endPoint.y + (normal.y * endHalf)),
            new Phaser.Math.Vector2(endPoint.x - (normal.x * endHalf), endPoint.y - (normal.y * endHalf)),
            new Phaser.Math.Vector2(startPoint.x - (normal.x * startHalf), startPoint.y - (normal.y * startHalf))
        ];
    }

    const ANALYTICS_STORAGE_KEY = "shadow_fighter_duel_analytics_v3";
    const TRACKED_MOVE_KEYS = [
        "quick_slash",
        "upward_slash",
        "downward_strike",
        "triple_slash_combo",
        "spin_attack",
        "dash_slash",
        "charged_strike",
        "iaido_slash",
        "air_combo_finisher",
        "teleport_slash",
        "energy_slash",
        "blink_step",
        "super_slash",
        "omni_slash_combo"
    ];

    function createMoveUsageMap(source) {
        const map = {};
        TRACKED_MOVE_KEYS.forEach((key) => {
            map[key] = source && Number.isFinite(Number(source[key])) ? Number(source[key]) : 0;
        });
        return map;
    }

    function createFighterStats() {
        return {
            damageDealt: 0,
            damageTaken: 0,
            hitsLanded: 0,
            hitsBlocked: 0,
            parries: 0,
            guards: 0,
            movesUsed: createMoveUsageMap()
        };
    }

    function createMatchStats() {
        return {
            createdAt: Date.now(),
            fightStartedAt: null,
            fightEndedAt: null,
            resultText: "",
            playerWon: false,
            durationMs: 0,
            player: createFighterStats(),
            enemy: createFighterStats()
        };
    }

    function createPersistentAnalytics() {
        return {
            version: 3,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            totalFightTimeMs: 0,
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            totalHitsLanded: 0,
            totalHitsBlocked: 0,
            totalParries: 0,
            totalGuards: 0,
            totalMovesUsed: createMoveUsageMap(),
            bestWinMs: null,
            longestMatchMs: 0,
            lastPlayedAt: null,
            recentMatches: []
        };
    }

    function hydratePersistentAnalytics(raw) {
        const base = createPersistentAnalytics();
        if (!raw || typeof raw !== "object") {
            return base;
        }

        base.matchesPlayed = Number(raw.matchesPlayed) || 0;
        base.wins = Number(raw.wins) || 0;
        base.losses = Number(raw.losses) || 0;
        base.totalFightTimeMs = Number(raw.totalFightTimeMs) || 0;
        base.totalDamageDealt = Number(raw.totalDamageDealt) || 0;
        base.totalDamageTaken = Number(raw.totalDamageTaken) || 0;
        base.totalHitsLanded = Number(raw.totalHitsLanded) || 0;
        base.totalHitsBlocked = Number(raw.totalHitsBlocked) || 0;
        base.totalParries = Number(raw.totalParries) || 0;
        base.totalGuards = Number(raw.totalGuards) || 0;
        base.totalMovesUsed = createMoveUsageMap(raw.totalMovesUsed);
        base.bestWinMs = Number.isFinite(Number(raw.bestWinMs)) ? Number(raw.bestWinMs) : null;
        base.longestMatchMs = Number(raw.longestMatchMs) || 0;
        base.lastPlayedAt = raw.lastPlayedAt || null;
        base.recentMatches = Array.isArray(raw.recentMatches) ? raw.recentMatches.slice(0, 8) : [];
        return base;
    }

    function loadPersistentAnalytics() {
        try {
            const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
            return raw ? hydratePersistentAnalytics(JSON.parse(raw)) : createPersistentAnalytics();
        } catch (error) {
            return createPersistentAnalytics();
        }
    }

    function savePersistentAnalytics(analytics) {
        try {
            window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
        } catch (error) {
            // Ignore storage failures and keep gameplay responsive.
        }
    }

    function normalizeThemeName(themeName) {
        return themeName === "light" ? "light" : "dark";
    }

    function clampNumber(value, min, max, fallback) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return fallback;
        }
        return Math.min(max, Math.max(min, numeric));
    }

    function safeSetPointerCapture(node, pointerId) {
        if (!node || typeof node.setPointerCapture !== "function") {
            return;
        }

        try {
            node.setPointerCapture(pointerId);
        } catch (error) {
            // Ignore pointer capture failures on browsers/devices that reject it.
        }
    }

    function loadStoredTheme() {
        try {
            return normalizeThemeName(window.localStorage.getItem(THEME_STORAGE_KEY));
        } catch (error) {
            return "dark";
        }
    }

    function saveStoredTheme(themeName) {
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, normalizeThemeName(themeName));
        } catch (error) {
            // Ignore storage failures and keep gameplay responsive.
        }
    }

    function loadStoredSoundEnabled() {
        try {
            const storedValue = window.localStorage.getItem(SOUND_STORAGE_KEY);
            return storedValue === null ? true : storedValue !== "off";
        } catch (error) {
            return true;
        }
    }

    function saveStoredSoundEnabled(isEnabled) {
        try {
            window.localStorage.setItem(SOUND_STORAGE_KEY, isEnabled ? "on" : "off");
        } catch (error) {
            // Ignore storage failures and keep gameplay responsive.
        }
    }

    function normalizeDifficultyName(difficultyName) {
        return difficultyName === "boss" ? "boss" : "hard";
    }

    function loadStoredDifficulty() {
        try {
            return normalizeDifficultyName(window.localStorage.getItem(DIFFICULTY_STORAGE_KEY));
        } catch (error) {
            return "hard";
        }
    }

    function saveStoredDifficulty(difficultyName) {
        try {
            window.localStorage.setItem(DIFFICULTY_STORAGE_KEY, normalizeDifficultyName(difficultyName));
        } catch (error) {
            // Ignore storage failures and keep gameplay responsive.
        }
    }

    function normalizeHudPoint(point, fallback) {
        const source = point && typeof point === "object" ? point : fallback;
        return {
            x: clampNumber(source && source.x, 0.12, 0.88, fallback.x),
            y: clampNumber(source && source.y, 0.18, 0.88, fallback.y)
        };
    }

    function normalizeHudLayout(layout) {
        const source = layout && typeof layout === "object" ? layout : {};
        return {
            joystick: normalizeHudPoint(source.joystick, DEFAULT_HUD_LAYOUT.joystick),
            run: normalizeHudPoint(source.run, DEFAULT_HUD_LAYOUT.run),
            combat: normalizeHudPoint(source.combat, DEFAULT_HUD_LAYOUT.combat)
        };
    }

    function cloneHudLayout(layout) {
        return normalizeHudLayout(JSON.parse(JSON.stringify(normalizeHudLayout(layout))));
    }

    function loadStoredHudLayout() {
        try {
            const storedValue = window.localStorage.getItem(HUD_LAYOUT_STORAGE_KEY);
            return storedValue ? normalizeHudLayout(JSON.parse(storedValue)) : cloneHudLayout(DEFAULT_HUD_LAYOUT);
        } catch (error) {
            return cloneHudLayout(DEFAULT_HUD_LAYOUT);
        }
    }

    function saveStoredHudLayout(layout) {
        try {
            window.localStorage.setItem(HUD_LAYOUT_STORAGE_KEY, JSON.stringify(normalizeHudLayout(layout)));
        } catch (error) {
            // Ignore storage failures and keep gameplay responsive.
        }
    }

    function isCustomHudLayout(layout) {
        const normalized = normalizeHudLayout(layout);
        return ["joystick", "run", "combat"].some((key) => {
            const point = normalized[key];
            const fallback = DEFAULT_HUD_LAYOUT[key];
            return Math.abs(point.x - fallback.x) > 0.01 || Math.abs(point.y - fallback.y) > 0.01;
        });
    }

    function mixColor(colorA, colorB, ratio) {
        const amount = clampNumber(ratio, 0, 1, 0);
        const red = Math.round((((colorA >> 16) & 0xff) * (1 - amount)) + (((colorB >> 16) & 0xff) * amount));
        const green = Math.round((((colorA >> 8) & 0xff) * (1 - amount)) + (((colorB >> 8) & 0xff) * amount));
        const blue = Math.round(((colorA & 0xff) * (1 - amount)) + ((colorB & 0xff) * amount));
        return Phaser.Display.Color.GetColor(red, green, blue);
    }

    function createTouchControlState() {
        return TOUCH_CONTROL_KEYS.reduce((state, key) => {
            state[key] = false;
            return state;
        }, {});
    }

    function formatDuration(durationMs) {
        const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    function formatMoveName(moveKey) {
        return moveKey
            .split("_")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }

    function getFavoriteMove(moveUsage) {
        return TRACKED_MOVE_KEYS
            .map((key) => ({ key, count: Number(moveUsage[key]) || 0 }))
            .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))[0];
    }

    class AppController {
        constructor(assetMode) {
            this.assetMode = assetMode;
            this.analytics = loadPersistentAnalytics();
            this.themeName = loadStoredTheme();
            this.soundEnabled = loadStoredSoundEnabled();
            this.difficultyName = loadStoredDifficulty();
            this.hudLayout = loadStoredHudLayout();
            this.hudDraftLayout = cloneHudLayout(this.hudLayout);
            this.touchControlState = createTouchControlState();
            this.touchUiEnabled = false;
            this.activeScreen = "start";
            this.settingsOpen = false;
            this.hudDragSession = null;
            this.game = null;
            this.scene = null;
            this.currentMatch = null;
            this.startHistoryExpanded = false;
            this.endHistoryExpanded = false;
            this.ui = {
                startScreen: document.getElementById("start-screen"),
                gameScreen: document.getElementById("game-screen"),
                endScreen: document.getElementById("end-screen"),
                startButton: document.getElementById("start-button"),
                rematchButton: document.getElementById("rematch-button"),
                homeButton: document.getElementById("home-button"),
                resetButton: document.getElementById("reset-analytics-button"),
                themeButton: document.getElementById("theme-button"),
                soundButton: document.getElementById("sound-button"),
                difficultyButton: document.getElementById("difficulty-button"),
                settingsButton: document.getElementById("settings-button"),
                headerBadges: document.querySelector(".header-badges"),
                settingsModal: document.getElementById("settings-modal"),
                settingsClose: document.getElementById("settings-close"),
                settingsCancel: document.getElementById("settings-cancel"),
                settingsSave: document.getElementById("settings-save"),
                settingsReset: document.getElementById("settings-reset"),
                hudPreviewSurface: document.getElementById("hud-preview-surface"),
                hudPreviewNodes: Array.from(document.querySelectorAll("[data-hud-node]")),
                homeHudSummaryCard: document.getElementById("home-hud-summary-card"),
                hudSummaryValue: document.getElementById("home-hud-summary-value"),
                hudSummaryNote: document.getElementById("home-hud-summary-note"),
                touchButtons: Array.from(document.querySelectorAll("[data-touch-control-button]")),
                touchJoystick: document.getElementById("touch-joystick"),
                touchJoystickThumb: document.getElementById("touch-joystick-thumb"),
                touchJoystickNode: document.getElementById("touch-joystick-node"),
                touchRunNode: document.getElementById("touch-run-node"),
                touchCombatNode: document.getElementById("touch-combat-node"),
                startAnalyticsGrid: document.getElementById("start-analytics-grid"),
                recentHistory: document.getElementById("recent-history"),
                startHistoryToggle: document.getElementById("start-history-toggle"),
                homeControlModeValue: document.getElementById("home-control-mode-value"),
                homeControlModeNote: document.getElementById("home-control-mode-note"),
                homeThemeSummaryValue: document.getElementById("home-theme-summary-value"),
                homeThemeSummaryNote: document.getElementById("home-theme-summary-note"),
                homeSoundSummaryValue: document.getElementById("home-sound-summary-value"),
                homeSoundSummaryNote: document.getElementById("home-sound-summary-note"),
                homeDifficultySummaryValue: document.getElementById("home-difficulty-summary-value"),
                homeDifficultySummaryNote: document.getElementById("home-difficulty-summary-note"),
                homeArchiveSummaryValue: document.getElementById("home-archive-summary-value"),
                homeArchiveSummaryNote: document.getElementById("home-archive-summary-note"),
                endResultLabel: document.getElementById("end-result-label"),
                endResultTitle: document.getElementById("end-result-title"),
                endResultCopy: document.getElementById("end-result-copy"),
                endMatchGrid: document.getElementById("end-match-grid"),
                endMoveList: document.getElementById("end-move-list"),
                endLifetimeGrid: document.getElementById("end-lifetime-grid"),
                endHistory: document.getElementById("end-history"),
                endHistoryToggle: document.getElementById("end-history-toggle")
            };
        }

        init() {
            this.renderVersionBadge();
            this.applyTheme(this.themeName, false);
            this.applySoundSetting(this.soundEnabled, false);
            this.applyDifficultySetting(this.difficultyName, false);
            this.setupTouchControls();
            this.setupHudSettings();
            this.applyHudLayout(this.hudLayout, false);
            this.updateTouchUiState();
            window.addEventListener("resize", () => this.updateTouchUiState());
            this.ui.startButton.disabled = false;
            this.ui.startButton.textContent = "Start Duel";
            this.ui.startButton.addEventListener("click", () => this.startMatch());
            this.ui.rematchButton.addEventListener("click", () => this.startMatch());
            this.ui.homeButton.addEventListener("click", () => this.showHome());
            this.ui.resetButton.addEventListener("click", () => this.resetAnalytics());
            this.ui.themeButton.addEventListener("click", () => this.toggleTheme());
            this.ui.soundButton.addEventListener("click", () => this.toggleSound());
            this.ui.difficultyButton.addEventListener("click", () => this.toggleDifficulty());
            this.ui.settingsButton.addEventListener("click", () => this.openSettings());
            this.ui.startHistoryToggle.addEventListener("click", () => this.toggleHistory("start"));
            this.ui.endHistoryToggle.addEventListener("click", () => this.toggleHistory("end"));
            this.renderHomeAnalytics();
            this.showScreen("start");
            setStatus("Arena ready. Start a duel when you are.", false);
        }

        renderVersionBadge() {
            document.title = `${GAME_TITLE} | ${GAME_VERSION}`;
            if (!this.ui.headerBadges) {
                return;
            }
            let badge = this.ui.headerBadges.querySelector("[data-game-version]");
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "header-badge";
                badge.dataset.gameVersion = "true";
                this.ui.headerBadges.prepend(badge);
            }
            badge.textContent = `Version ${GAME_VERSION}`;
            badge.setAttribute("aria-label", `Game version ${GAME_VERSION}`);
        }

        getSceneTheme() {
            return SCENE_THEMES[this.themeName];
        }

        applyTheme(themeName, persist) {
            this.themeName = normalizeThemeName(themeName);
            document.body.dataset.theme = this.themeName;
            document.documentElement.style.colorScheme = this.themeName;
            this.ui.themeButton.textContent = this.themeName === "dark" ? "Switch To Light Theme" : "Switch To Dark Theme";
            if (persist !== false) {
                saveStoredTheme(this.themeName);
            }

            if (this.scene && typeof this.scene.applyTheme === "function") {
                this.scene.applyTheme(this.getSceneTheme());
            }

            this.renderHomeSummary();
        }

        toggleTheme() {
            const nextTheme = this.themeName === "dark" ? "light" : "dark";
            this.applyTheme(nextTheme, true);
            setStatus(`${nextTheme === "light" ? "Light" : "Dark"} theme active.`, false);
        }

        getSoundEnabled() {
            return this.soundEnabled;
        }

        applySoundSetting(isEnabled, persist) {
            this.soundEnabled = Boolean(isEnabled);
            this.ui.soundButton.textContent = this.soundEnabled ? "Sound: On" : "Sound: Off";
            if (persist !== false) {
                saveStoredSoundEnabled(this.soundEnabled);
            }

            if (this.scene && typeof this.scene.applyAudioPreference === "function") {
                this.scene.applyAudioPreference(this.soundEnabled);
            }

            this.renderHomeSummary();
        }

        toggleSound() {
            const nextValue = !this.soundEnabled;
            this.applySoundSetting(nextValue, true);
            setStatus(`Sound ${nextValue ? "enabled" : "muted"}.`, false);
        }

        getDifficultyName() {
            return this.difficultyName;
        }

        getDifficultyProfile() {
            return AI_DIFFICULTY_PROFILES[normalizeDifficultyName(this.difficultyName)] || AI_DIFFICULTY_PROFILES.hard;
        }

        applyDifficultySetting(difficultyName, persist) {
            this.difficultyName = normalizeDifficultyName(difficultyName);
            const profile = this.getDifficultyProfile();
            if (this.ui.difficultyButton) {
                this.ui.difficultyButton.textContent = `AI: ${profile.label}`;
            }
            if (persist !== false) {
                saveStoredDifficulty(this.difficultyName);
            }
            this.renderHomeSummary();
        }

        toggleDifficulty() {
            const nextDifficulty = this.difficultyName === "hard" ? "boss" : "hard";
            this.applyDifficultySetting(nextDifficulty, true);
            const profile = this.getDifficultyProfile();
            setStatus(`${profile.label} AI active. ${profile.summaryNote}`, false);
        }

        getHudLayout() {
            return this.hudLayout;
        }

        applyHudLayout(layout, persist) {
            this.hudLayout = cloneHudLayout(layout);
            if (persist !== false) {
                saveStoredHudLayout(this.hudLayout);
            }

            this.syncHudLayoutToGame(this.hudLayout);
            this.syncHudPreview(this.hudLayout);
            this.renderHomeSummary();
        }

        syncHudNodePosition(node, position) {
            if (!node || !position) {
                return;
            }

            const x = clampNumber(position.x, 0.12, 0.88, 0.5);
            const y = clampNumber(position.y, 0.18, 0.88, 0.5);
            node.style.left = `${(x * 100).toFixed(2)}%`;
            node.style.top = `${(y * 100).toFixed(2)}%`;
        }

        syncHudLayoutToGame(layout) {
            this.syncHudNodePosition(this.ui.touchJoystickNode, layout.joystick);
            this.syncHudNodePosition(this.ui.touchRunNode, layout.run);
            this.syncHudNodePosition(this.ui.touchCombatNode, layout.combat);
        }

        syncHudPreview(layout) {
            this.ui.hudPreviewNodes.forEach((node) => {
                const key = node.dataset.hudNode;
                this.syncHudNodePosition(node, layout[key]);
            });
        }

        setupHudSettings() {
            const closeWithBackdrop = (event) => {
                if (event.target === this.ui.settingsModal) {
                    this.closeSettings(false);
                }
            };

            this.ui.settingsClose.addEventListener("click", () => this.closeSettings(false));
            this.ui.settingsCancel.addEventListener("click", () => this.closeSettings(false));
            this.ui.settingsSave.addEventListener("click", () => this.closeSettings(true));
            this.ui.settingsReset.addEventListener("click", () => {
                this.hudDraftLayout = cloneHudLayout(DEFAULT_HUD_LAYOUT);
                this.syncHudPreview(this.hudDraftLayout);
            });
            this.ui.settingsModal.addEventListener("pointerdown", closeWithBackdrop);

            const startDrag = (node, event) => {
                event.preventDefault();
                const hudKey = node.dataset.hudNode;
                if (!hudKey || !this.settingsOpen) {
                    return;
                }

                this.hudDragSession = { key: hudKey, pointerId: event.pointerId };
                safeSetPointerCapture(node, event.pointerId);
                node.dataset.dragging = "true";
                this.updateHudDraftFromPointer(event);
            };

            this.ui.hudPreviewNodes.forEach((node) => {
                node.addEventListener("pointerdown", (event) => startDrag(node, event));
            });

            window.addEventListener("pointermove", (event) => this.updateHudDraftFromPointer(event));
            window.addEventListener("pointerup", (event) => this.finishHudDrag(event));
            window.addEventListener("pointercancel", (event) => this.finishHudDrag(event));
        }

        clampHudPosition(position) {
            return {
                x: Phaser.Math.Clamp(position.x, 0.12, 0.88),
                y: Phaser.Math.Clamp(position.y, 0.18, 0.88)
            };
        }

        updateHudDraftFromPointer(event) {
            if (!this.hudDragSession || !this.ui.hudPreviewSurface) {
                return;
            }
            if (event.pointerId !== undefined && event.pointerId !== this.hudDragSession.pointerId) {
                return;
            }

            const rect = this.ui.hudPreviewSurface.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) {
                return;
            }
            const x = clampNumber((event.clientX - rect.left) / rect.width, 0, 1, 0.5);
            const y = clampNumber((event.clientY - rect.top) / rect.height, 0, 1, 0.5);
            this.hudDraftLayout[this.hudDragSession.key] = this.clampHudPosition({ x, y });
            this.syncHudPreview(this.hudDraftLayout);
        }

        finishHudDrag(event) {
            if (!this.hudDragSession) {
                return;
            }
            if (event && event.pointerId !== undefined && event.pointerId !== this.hudDragSession.pointerId) {
                return;
            }

            this.ui.hudPreviewNodes.forEach((node) => {
                node.dataset.dragging = "false";
            });
            this.hudDragSession = null;
        }

        openSettings() {
            if (!this.touchUiEnabled) {
                setStatus("Custom HUD settings are only available on touch devices.", false);
                return;
            }

            if (this.activeScreen === "game") {
                setStatus("Custom HUD is locked during a live fight. Open settings before the duel or after the result screen.", false);
                return;
            }

            this.settingsOpen = true;
            this.hudDraftLayout = cloneHudLayout(this.hudLayout);
            this.syncHudPreview(this.hudDraftLayout);
            this.ui.settingsModal.hidden = false;
            document.body.dataset.settingsOpen = "true";
        }

        closeSettings(saveChanges) {
            if (!this.settingsOpen) {
                return;
            }

            this.finishHudDrag();
            if (saveChanges) {
                this.applyHudLayout(this.hudDraftLayout, true);
                setStatus("Custom HUD saved. The new layout will be used in the next fight.", false);
            } else {
                this.syncHudPreview(this.hudLayout);
            }

            this.settingsOpen = false;
            this.ui.settingsModal.hidden = true;
            document.body.dataset.settingsOpen = "false";
        }

        detectTouchUi() {
            const coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
            const narrowViewport = window.innerWidth <= 900;
            const touchCapable = coarsePointer || navigator.maxTouchPoints > 0 || ("ontouchstart" in window);
            return touchCapable || narrowViewport;
        }

        setupTouchControls() {
            const setTouchControl = (button, isDown, event) => {
                if (event) {
                    event.preventDefault();
                }

                const control = button.dataset.control;
                if (!control || !(control in this.touchControlState)) {
                    return;
                }

                this.touchControlState[control] = isDown && this.touchUiEnabled;
                button.dataset.active = this.touchControlState[control] ? "true" : "false";
            };

            this.ui.touchButtons.forEach((button) => {
                button.addEventListener("pointerdown", (event) => {
                    safeSetPointerCapture(button, event.pointerId);
                    setTouchControl(button, true, event);
                });

                ["pointerup", "pointercancel", "pointerleave", "lostpointercapture"].forEach((eventName) => {
                    button.addEventListener(eventName, (event) => setTouchControl(button, false, event));
                });
            });

            const resetJoystick = () => {
                ["left", "right", "up", "down"].forEach((key) => {
                    this.touchControlState[key] = false;
                });
                if (this.ui.touchJoystick) {
                    this.ui.touchJoystick.dataset.active = "false";
                }
                if (this.ui.touchJoystickThumb) {
                    this.ui.touchJoystickThumb.style.transform = "translate(-50%, -50%)";
                }
                this.joystickPointerId = null;
            };

            const updateJoystickFromEvent = (event) => {
                if (!this.touchUiEnabled || !this.ui.touchJoystick) {
                    resetJoystick();
                    return;
                }

                const rect = this.ui.touchJoystick.getBoundingClientRect();
                const centerX = rect.left + (rect.width / 2);
                const centerY = rect.top + (rect.height / 2);
                const rawX = event.clientX - centerX;
                const rawY = event.clientY - centerY;
                const radius = rect.width * 0.28;
                const distance = Math.hypot(rawX, rawY) || 1;
                const scale = Math.min(distance, radius) / distance;
                const clampedX = rawX * scale;
                const clampedY = rawY * scale;
                const normX = clampedX / radius;
                const normY = clampedY / radius;

                this.touchControlState.left = normX < -0.32;
                this.touchControlState.right = normX > 0.32;
                this.touchControlState.up = normY < -0.38;
                this.touchControlState.down = normY > 0.28;

                this.ui.touchJoystick.dataset.active = "true";
                this.ui.touchJoystickThumb.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;
            };

            if (this.ui.touchJoystick) {
                this.ui.touchJoystick.addEventListener("pointerdown", (event) => {
                    if (!this.touchUiEnabled) {
                        return;
                    }

                    event.preventDefault();
                    this.joystickPointerId = event.pointerId;
                    safeSetPointerCapture(this.ui.touchJoystick, event.pointerId);
                    updateJoystickFromEvent(event);
                });

                this.ui.touchJoystick.addEventListener("pointermove", (event) => {
                    if (event.pointerId === this.joystickPointerId) {
                        updateJoystickFromEvent(event);
                    }
                });

                ["pointerup", "pointercancel", "pointerleave", "lostpointercapture"].forEach((eventName) => {
                    this.ui.touchJoystick.addEventListener(eventName, (event) => {
                        if (this.joystickPointerId === null || event.pointerId === this.joystickPointerId) {
                            resetJoystick();
                        }
                    });
                });
            }

            window.addEventListener("blur", () => this.resetTouchControls());
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    this.resetTouchControls();
                }
            });
        }

        resetTouchControls() {
            TOUCH_CONTROL_KEYS.forEach((key) => {
                this.touchControlState[key] = false;
            });
            this.ui.touchButtons.forEach((button) => {
                button.dataset.active = "false";
            });
            if (this.ui.touchJoystick) {
                this.ui.touchJoystick.dataset.active = "false";
            }
            if (this.ui.touchJoystickThumb) {
                this.ui.touchJoystickThumb.style.transform = "translate(-50%, -50%)";
            }
            this.joystickPointerId = null;
        }

        updateTouchUiState() {
            this.touchUiEnabled = this.detectTouchUi();
            document.body.dataset.touchUi = this.touchUiEnabled ? "true" : "false";
            this.ui.settingsButton.hidden = !this.touchUiEnabled;
            this.ui.homeHudSummaryCard.hidden = !this.touchUiEnabled;
            this.syncHudLayoutToGame(this.hudLayout);
            if (!this.touchUiEnabled && this.settingsOpen) {
                this.closeSettings(false);
            }
            if (!this.touchUiEnabled) {
                this.resetTouchControls();
            }
            this.renderHomeSummary();
        }

        getTouchControlState() {
            return this.touchControlState;
        }

        showScreen(screenName) {
            this.activeScreen = screenName;
            const mapping = {
                start: this.ui.startScreen,
                game: this.ui.gameScreen,
                end: this.ui.endScreen
            };

            Object.keys(mapping).forEach((key) => {
                mapping[key].classList.toggle("active", key === screenName);
            });

            this.ui.settingsButton.disabled = false;
            this.ui.settingsButton.hidden = !this.touchUiEnabled;
            this.ui.settingsButton.title = screenName === "game"
                ? "Custom HUD editing is locked during a live fight."
                : "Open custom HUD settings";
        }

        startMatch() {
            this.closeSettings(false);
            this.resetTouchControls();
            this.showScreen("game");
            setStatus(this.touchUiEnabled ? "Preparing fight scene. Circular touch controls will appear inside the arena." : "Preparing fight scene...", false);
            if (!this.game) {
                this.game = createGame(this.assetMode, this);
                return;
            }

            if (this.scene) {
                this.scene.scene.restart();
            }
        }

        showHome() {
            this.closeSettings(false);
            this.startHistoryExpanded = false;
            this.resetTouchControls();
            this.showScreen("start");
            this.renderHomeAnalytics();
            setStatus("Home screen ready. Start another duel when you want.", false);
        }

        toggleHistory(scope) {
            if (scope === "start") {
                this.startHistoryExpanded = !this.startHistoryExpanded;
                this.renderHomeAnalytics();
                return;
            }

            this.endHistoryExpanded = !this.endHistoryExpanded;
            if (this.currentMatch) {
                this.renderEndScreen(this.currentMatch);
            }
        }

        attachScene(scene) {
            this.scene = scene;
            this.currentMatch = createMatchStats();
            if (typeof scene.applyAudioPreference === "function") {
                scene.applyAudioPreference(this.soundEnabled);
            }
        }

        noteFightStarted() {
            if (this.currentMatch && !this.currentMatch.fightStartedAt) {
                this.currentMatch.fightStartedAt = Date.now();
            }
        }

        getActorStats(fighterId) {
            if (!this.currentMatch) {
                this.currentMatch = createMatchStats();
            }
            return fighterId === "enemy" ? this.currentMatch.enemy : this.currentMatch.player;
        }

        recordMoveUsage(fighterId, moveKey) {
            const actor = this.getActorStats(fighterId);
            actor.movesUsed[moveKey] = (actor.movesUsed[moveKey] || 0) + 1;
        }

        recordGuard(fighterId) {
            this.getActorStats(fighterId).guards += 1;
        }

        recordParry(fighterId) {
            this.getActorStats(fighterId).parries += 1;
        }

        recordImpact(attackerId, defenderId, damage, blocked) {
            const attacker = this.getActorStats(attackerId);
            const defender = this.getActorStats(defenderId);
            attacker.damageDealt += damage;
            defender.damageTaken += damage;
            if (blocked) {
                defender.hitsBlocked += 1;
            } else {
                attacker.hitsLanded += 1;
            }
        }

        finalizeMatch(resultText) {
            const match = this.currentMatch || createMatchStats();
            match.fightStartedAt = match.fightStartedAt || match.createdAt;
            match.fightEndedAt = Date.now();
            match.durationMs = Math.max(0, match.fightEndedAt - match.fightStartedAt);
            match.resultText = resultText;
            match.playerWon = resultText === "You Win";

            const analytics = this.analytics;
            analytics.matchesPlayed += 1;
            analytics.wins += match.playerWon ? 1 : 0;
            analytics.losses += match.playerWon ? 0 : 1;
            analytics.totalFightTimeMs += match.durationMs;
            analytics.totalDamageDealt += match.player.damageDealt;
            analytics.totalDamageTaken += match.player.damageTaken;
            analytics.totalHitsLanded += match.player.hitsLanded;
            analytics.totalHitsBlocked += match.player.hitsBlocked;
            analytics.totalParries += match.player.parries;
            analytics.totalGuards += match.player.guards;
            TRACKED_MOVE_KEYS.forEach((key) => {
                analytics.totalMovesUsed[key] = (analytics.totalMovesUsed[key] || 0) + (match.player.movesUsed[key] || 0);
            });
            analytics.longestMatchMs = Math.max(analytics.longestMatchMs, match.durationMs);
            if (match.playerWon) {
                analytics.bestWinMs = analytics.bestWinMs === null ? match.durationMs : Math.min(analytics.bestWinMs, match.durationMs);
            }
            analytics.lastPlayedAt = new Date().toISOString();
            analytics.recentMatches.unshift({
                timestamp: analytics.lastPlayedAt,
                resultText: match.resultText,
                durationMs: match.durationMs,
                damageDealt: match.player.damageDealt,
                damageTaken: match.player.damageTaken,
                parries: match.player.parries,
                favoriteMove: getFavoriteMove(match.player.movesUsed).count > 0 ? getFavoriteMove(match.player.movesUsed).key : null
            });
            analytics.recentMatches = analytics.recentMatches.slice(0, 24);
            savePersistentAnalytics(analytics);
            this.renderHomeAnalytics();
            return match;
        }

        renderStatGrid(container, items) {
            container.innerHTML = "";
            items.forEach((item) => {
                const card = document.createElement("div");
                card.className = "stat-card";
                const label = document.createElement("span");
                label.className = "stat-label";
                label.textContent = item.label;
                const value = document.createElement("span");
                value.className = "stat-value";
                value.textContent = item.value;
                card.append(label, value);
                if (item.note) {
                    const note = document.createElement("div");
                    note.className = "stat-note";
                    note.textContent = item.note;
                    card.append(note);
                }
                container.append(card);
            });
        }

        renderHistory(container, recentMatches, toggleButton, expanded) {
            container.innerHTML = "";
            if (!recentMatches.length) {
                const empty = document.createElement("div");
                empty.className = "empty-state";
                empty.textContent = "No duels logged yet. Your local match history will start building after the first round.";
                container.append(empty);
                if (toggleButton) {
                    toggleButton.hidden = true;
                }
                return;
            }

            const shouldCollapse = recentMatches.length > HISTORY_PREVIEW_COUNT;
            const visibleEntries = expanded || !shouldCollapse
                ? recentMatches
                : recentMatches.slice(0, HISTORY_PREVIEW_COUNT);

            visibleEntries.forEach((entry) => {
                const item = document.createElement("div");
                item.className = "history-item";
                const title = document.createElement("strong");
                title.textContent = `${entry.resultText} in ${formatDuration(entry.durationMs)}`;
                const copy = document.createElement("div");
                const favoriteText = entry.favoriteMove ? formatMoveName(entry.favoriteMove) : "No signature move";
                copy.textContent = `${new Date(entry.timestamp).toLocaleString()} | Damage ${entry.damageDealt}/${entry.damageTaken} | Favorite ${favoriteText}`;
                item.append(title, copy);
                container.append(item);
            });

            if (toggleButton) {
                toggleButton.hidden = !shouldCollapse;
                toggleButton.textContent = expanded ? "Show Less" : `Show More (${recentMatches.length - HISTORY_PREVIEW_COUNT} More)`;
            }
        }

        renderMoveList(container, moveUsage) {
            container.innerHTML = "";
            const rankedMoves = TRACKED_MOVE_KEYS
                .map((key) => ({ key, count: moveUsage[key] || 0 }))
                .filter((entry) => entry.count > 0)
                .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));

            if (!rankedMoves.length) {
                const empty = document.createElement("div");
                empty.className = "empty-state";
                empty.textContent = "No player move usage recorded in this match yet.";
                container.append(empty);
                return;
            }

            rankedMoves.forEach((entry) => {
                const item = document.createElement("div");
                item.className = "move-item";
                const title = document.createElement("strong");
                title.textContent = formatMoveName(entry.key);
                const copy = document.createElement("div");
                copy.textContent = `${entry.count} use${entry.count === 1 ? "" : "s"}`;
                item.append(title, copy);
                container.append(item);
            });
        }

        renderHomeSummary() {
            const favorite = getFavoriteMove(this.analytics.totalMovesUsed);
            const totalMatches = this.analytics.matchesPlayed;
            const recentCount = this.analytics.recentMatches.length;
            const customHud = isCustomHudLayout(this.hudLayout);
            const difficultyProfile = this.getDifficultyProfile();

            this.ui.homeControlModeValue.textContent = this.touchUiEnabled ? "Touch + Keyboard" : "Keyboard Ready";
            this.ui.homeControlModeNote.textContent = this.touchUiEnabled
                ? "A live joystick, separate run button, and combat cluster appear inside the arena corners automatically on touch devices."
                : "Desktop keyboard controls are active now, and touch controls will appear automatically on phones and tablets.";

            this.ui.homeThemeSummaryValue.textContent = this.themeName === "light" ? "Light: Ivory Gold" : "Dark: Neon Night";
            this.ui.homeThemeSummaryNote.textContent = this.themeName === "light"
                ? "Warm white and golden-beige surfaces are active across the shell and the duel arena."
                : "The darker contrast-first arena is active, with cooler lighting and sharper combat separation.";

            this.ui.homeSoundSummaryValue.textContent = this.soundEnabled ? "Sound Enabled" : "Sound Muted";
            this.ui.homeSoundSummaryNote.textContent = this.soundEnabled
                ? "Sword clash feedback and combat audio are live for the next duel."
                : "Audio is muted right now. You can turn it back on instantly from the header.";

            this.ui.homeDifficultySummaryValue.textContent = difficultyProfile.summaryLabel;
            this.ui.homeDifficultySummaryNote.textContent = difficultyProfile.summaryNote;

            if (this.touchUiEnabled) {
                this.ui.hudSummaryValue.textContent = customHud ? "Custom HUD Saved" : "Default HUD Layout";
                this.ui.hudSummaryNote.textContent = customHud
                    ? "Your joystick, run button, and combat cluster positions are saved locally and will load into the next mobile match from the header gear."
                    : "The default in-arena HUD layout is active. Use the header gear to drag the mobile controls into a custom position.";
            }

            this.ui.homeArchiveSummaryValue.textContent = `${totalMatches} Total Match${totalMatches === 1 ? "" : "es"}`;
            this.ui.homeArchiveSummaryNote.textContent = favorite.count > 0
                ? `${recentCount} recent duel${recentCount === 1 ? "" : "s"} stored locally. Signature move so far: ${formatMoveName(favorite.key)}.`
                : `${recentCount} recent duel${recentCount === 1 ? "" : "s"} stored locally. Your signature move will appear here once you start building history.`;
        }

        renderHomeAnalytics() {
            const favorite = getFavoriteMove(this.analytics.totalMovesUsed);
            this.renderStatGrid(this.ui.startAnalyticsGrid, [
                { label: "Matches", value: `${this.analytics.matchesPlayed}` },
                { label: "Win Rate", value: this.analytics.matchesPlayed ? `${Math.round((this.analytics.wins / this.analytics.matchesPlayed) * 100)}%` : "0%" },
                { label: "Damage Dealt", value: `${this.analytics.totalDamageDealt}` },
                { label: "Parries", value: `${this.analytics.totalParries}` },
                { label: "Best Win", value: this.analytics.bestWinMs === null ? "--" : formatDuration(this.analytics.bestWinMs) },
                { label: "Favorite Move", value: favorite.count > 0 ? formatMoveName(favorite.key) : "--", note: favorite.count > 0 ? `${favorite.count} total uses` : "Use attacks to establish a signature." }
            ]);
            this.renderHomeSummary();
            this.renderHistory(this.ui.recentHistory, this.analytics.recentMatches, this.ui.startHistoryToggle, this.startHistoryExpanded);
        }

        renderEndScreen(match) {
            const favorite = getFavoriteMove(this.analytics.totalMovesUsed);
            const favoriteMatchMove = getFavoriteMove(match.player.movesUsed);
            this.ui.endResultLabel.textContent = match.playerWon ? "Victory Logged" : "Defeat Logged";
            this.ui.endResultTitle.textContent = match.resultText;
            this.ui.endResultCopy.textContent = `Duration ${formatDuration(match.durationMs)}. Damage dealt ${match.player.damageDealt}, damage taken ${match.player.damageTaken}, parries ${match.player.parries}, guards ${match.player.guards}.`;
            this.renderStatGrid(this.ui.endMatchGrid, [
                { label: "Duration", value: formatDuration(match.durationMs) },
                { label: "Damage Dealt", value: `${match.player.damageDealt}` },
                { label: "Damage Taken", value: `${match.player.damageTaken}` },
                { label: "Hits Landed", value: `${match.player.hitsLanded}` },
                { label: "Hits Blocked", value: `${match.player.hitsBlocked}` },
                { label: "Parries", value: `${match.player.parries}` },
                { label: "Guards", value: `${match.player.guards}` },
                { label: "Top Match Move", value: favoriteMatchMove.count > 0 ? formatMoveName(favoriteMatchMove.key) : "--", note: favoriteMatchMove.count > 0 ? `${favoriteMatchMove.count} use${favoriteMatchMove.count === 1 ? "" : "s"}` : "No player move usage recorded." }
            ]);
            this.renderMoveList(this.ui.endMoveList, match.player.movesUsed);
            this.renderStatGrid(this.ui.endLifetimeGrid, [
                { label: "Matches", value: `${this.analytics.matchesPlayed}` },
                { label: "Wins", value: `${this.analytics.wins}` },
                { label: "Losses", value: `${this.analytics.losses}` },
                { label: "Damage Dealt", value: `${this.analytics.totalDamageDealt}` },
                { label: "Fight Time", value: formatDuration(this.analytics.totalFightTimeMs) },
                { label: "Longest Match", value: formatDuration(this.analytics.longestMatchMs) },
                { label: "Favorite Move", value: favorite.count > 0 ? formatMoveName(favorite.key) : "--", note: favorite.count > 0 ? `${favorite.count} total uses` : "No move usage yet." },
                { label: "Last Played", value: this.analytics.lastPlayedAt ? new Date(this.analytics.lastPlayedAt).toLocaleDateString() : "--" }
            ]);
            this.renderHistory(this.ui.endHistory, this.analytics.recentMatches, this.ui.endHistoryToggle, this.endHistoryExpanded);
            this.showScreen("end");
        }

        onMatchFinished(resultText) {
            const match = this.finalizeMatch(resultText);
            this.endHistoryExpanded = false;
            this.renderEndScreen(match);
            setStatus(`${resultText}. Match analytics saved locally.`, false);
        }

        resetAnalytics() {
            if (!window.confirm("Reset all locally saved duel analytics?")) {
                return;
            }

            this.analytics = createPersistentAnalytics();
            this.startHistoryExpanded = false;
            this.endHistoryExpanded = false;
            savePersistentAnalytics(this.analytics);
            this.renderHomeAnalytics();
            this.renderHistory(this.ui.endHistory, this.analytics.recentMatches, this.ui.endHistoryToggle, this.endHistoryExpanded);
            setStatus("Local analytics reset.", false);
        }
    }

    class FightScene extends Phaser.Scene {
        constructor(assetMode, appController) {
            super({ key: "FightScene" });
            this.assetMode = assetMode;
            this.app = appController;
            this.activeSceneTheme = SCENE_THEMES.dark;
            this.phase = "intro";
            this.roundOver = false;
            this.player = null;
            this.enemy = null;
            this.ground = null;
            this.cursors = null;
            this.keys = null;
            this.touchControls = null;
            this.touchFrame = createTouchControlState();
            this.previousTouchFrame = createTouchControlState();
            this.ui = null;
            this.resultPanel = null;
            this.resultTitle = null;
            this.resultSubtitle = null;
            this.moonGlow = null;
            this.flashOverlay = null;
            this.afterImageLayer = null;
            this.slashLayer = null;
            this.impactLayer = null;
            this.projectileLayer = null;
            this.emoteLayer = null;
            this.audioEnabled = true;
            this.nextClashSoundAt = 0;
            this.projectiles = [];
            this.themeNodes = {};
            this.roundEndSequence = null;
            this.hitstopActive = false;
            this.hitstopReleaseAt = 0;
        }

        preload() {
            if (this.assetMode === "atlas") {
                this.load.atlas(TEXTURE_KEY, ATLAS_IMAGE_URL, ATLAS_JSON_URL);
            } else {
                this.load.spritesheet(TEXTURE_KEY, ATLAS_IMAGE_URL, { frameWidth: 512, frameHeight: 512 });
            }
            this.load.audio(CLASH_SOUND_KEY, [CLASH_SOUND_URL]);
        }

        create() {
            this.phase = "intro";
            this.roundOver = false;
            this.projectiles = [];
            this.roundEndSequence = null;
            this.nextClashSoundAt = 0;
            this.hitstopActive = false;
            this.hitstopReleaseAt = 0;
            this.physics.world.resume();
            this.time.paused = false;
            this.anims.resumeAll();
            this.tweens.resumeAll();
            this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
            this.physics.world.gravity.y = PHYSICS.gravityY;
            const initialTheme = this.app ? this.app.getSceneTheme() : SCENE_THEMES.dark;
            const actorTheme = initialTheme.actors;

            this.createBackdrop();
            this.createEffectLayers();
            this.createGround();
            this.registerAnimations();
            this.createUi();

            this.player = this.createFighter({
                id: "player",
                x: INTRO.playerSpawnX,
                y: GROUND_TOP - (BODY_SIZE.height / 2),
                facing: 1,
                accentTint: actorTheme.playerAccent,
                baseTint: null,
                readyX: INTRO.playerReadyX
            });

            this.enemy = this.createFighter({
                id: "enemy",
                x: INTRO.enemySpawnX,
                y: GROUND_TOP - (BODY_SIZE.height / 2),
                facing: -1,
                accentTint: actorTheme.enemyAccent,
                baseTint: actorTheme.enemyBaseTint,
                readyX: INTRO.enemyReadyX
            });

            this.applyTheme(initialTheme);
            this.applyAudioPreference(this.app ? this.app.getSoundEnabled() : true);

            this.physics.add.collider(this.player.body, this.ground);
            this.physics.add.collider(this.enemy.body, this.ground);
            this.physics.add.collider(this.player.body, this.enemy.body);

            this.cursors = this.input.keyboard.createCursorKeys();
            this.keys = this.input.keyboard.addKeys({
                light: Phaser.Input.Keyboard.KeyCodes.A,
                super: Phaser.Input.Keyboard.KeyCodes.B,
                power: Phaser.Input.Keyboard.KeyCodes.D,
                special: Phaser.Input.Keyboard.KeyCodes.F,
                guard: Phaser.Input.Keyboard.KeyCodes.S,
                blink: Phaser.Input.Keyboard.KeyCodes.Y,
                run: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                restart: Phaser.Input.Keyboard.KeyCodes.R
            });
            this.touchControls = this.app ? this.app.getTouchControlState() : createTouchControlState();

            this.syncFighterVisual(this.player, this.time.now);
            this.syncFighterVisual(this.enemy, this.time.now);
            this.updateHealthBars();
            this.showMoveText("Enter Stance", initialTheme.effects.moveText);
            if (this.resultPanel) {
                this.resultPanel.setVisible(false);
            }
            if (this.app) {
                this.app.attachScene(this);
            }
            setStatus("Opening stance. Fighters are taking position.", false);
        }

        createBackdrop() {
            const columns = [];
            const columnGlows = [];

            const skyBase = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xffffff).setDepth(-16);
            const skyMid = this.add.rectangle(GAME_WIDTH / 2, 300, GAME_WIDTH, 240, 0xffffff).setDepth(-15);
            const skyLower = this.add.rectangle(GAME_WIDTH / 2, 392, GAME_WIDTH, 160, 0xffffff).setDepth(-14);
            const orbGlow = this.add.ellipse(624, 92, 230, 230, 0xffffff).setDepth(-13);
            const orbCore = this.add.ellipse(626, 96, 112, 112, 0xffffff).setDepth(-12);
            const orbHalo = this.add.ellipse(626, 96, 132, 132, 0xffffff).setDepth(-13);
            const cloudA = this.add.ellipse(170, 118, 220, 76, 0xffffff).setDepth(-13);
            const cloudB = this.add.ellipse(330, 160, 280, 90, 0xffffff).setDepth(-13);
            const cloudC = this.add.ellipse(540, 138, 260, 84, 0xffffff).setDepth(-13);

            for (let index = 0; index < 6; index++) {
                const x = 72 + (index * 136);
                const height = 86 + ((index + 1) % 3) * 24;
                columns.push(this.add.rectangle(x, 392 - (height / 2), 18, height, 0xffffff).setDepth(-11));
                columnGlows.push(this.add.rectangle(x + 10, 392 - (height / 2), 8, height - 20, 0xffffff).setDepth(-10));
            }

            const floorBase = this.add.rectangle(GAME_WIDTH / 2, GROUND_TOP + 26, GAME_WIDTH, 96, 0xffffff).setDepth(-9);
            const floorLine = this.add.rectangle(GAME_WIDTH / 2, GROUND_TOP + 3, 760, 4, 0xffffff).setDepth(-8);
            const floorLineSoft = this.add.rectangle(GAME_WIDTH / 2, GROUND_TOP + 16, 740, 1, 0xffffff).setDepth(-8);

            this.moonGlow = orbGlow;
            this.themeNodes.backdrop = {
                skyBase,
                skyMid,
                skyLower,
                orbGlow,
                orbCore,
                orbHalo,
                clouds: [cloudA, cloudB, cloudC],
                columns,
                columnGlows,
                floorBase,
                floorLine,
                floorLineSoft
            };
        }

        createEffectLayers() {
            this.afterImageLayer = this.add.layer().setDepth(4);
            this.slashLayer = this.add.layer().setDepth(14);
            this.projectileLayer = this.add.layer().setDepth(18);
            this.impactLayer = this.add.layer().setDepth(22);
            this.emoteLayer = this.add.layer().setDepth(26);
            this.flashOverlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xe3f7ff, 0).setDepth(28);
            this.flashOverlay.setBlendMode(Phaser.BlendModes.ADD);
        }

        createGround() {
            this.ground = this.add.rectangle(GAME_WIDTH / 2, 470, 860, 60, 0xffffff, 1);
            this.physics.add.existing(this.ground, true);
            const groundLip = this.add.rectangle(GAME_WIDTH / 2, 459, 780, 10, 0xffffff);
            this.themeNodes.ground = {
                ground: this.ground,
                lip: groundLip
            };
        }

        createUi() {
            const playerLabel = this.add.text(24, 18, "PLAYER", { fontFamily: "Segoe UI, Tahoma, sans-serif", fontSize: "16px", color: "#eff7ff" });
            const enemyLabel = this.add.text(GAME_WIDTH - 24, 18, "ENEMY", { fontFamily: "Segoe UI, Tahoma, sans-serif", fontSize: "16px", color: "#eff7ff" }).setOrigin(1, 0);
            const titleLabel = this.add.text(GAME_WIDTH / 2, 16, GAME_TITLE, { fontFamily: "Segoe UI, Tahoma, sans-serif", fontSize: "18px", color: "#84d4ff" }).setOrigin(0.5, 0);
            const playerBarBack = this.add.rectangle(24, 48, 254, 18, 0xffffff).setOrigin(0, 0.5).setStrokeStyle(1, 0xffffff, 1);
            const enemyBarBack = this.add.rectangle(GAME_WIDTH - 24, 48, 254, 18, 0xffffff).setOrigin(1, 0.5).setStrokeStyle(1, 0xffffff, 1);

            this.ui = {
                playerLabel,
                enemyLabel,
                titleLabel,
                playerBarBack,
                enemyBarBack,
                playerBarFill: this.add.rectangle(26, 48, 250, 14, 0x75f3a6).setOrigin(0, 0.5),
                enemyBarFill: this.add.rectangle(GAME_WIDTH - 26, 48, 250, 14, 0xff7a7a).setOrigin(1, 0.5),
                playerValue: this.add.text(26, 62, `${COMBAT.maxHealth}`, { fontFamily: "Segoe UI, Tahoma, sans-serif", fontSize: "12px", color: "#a4afc9" }),
                enemyValue: this.add.text(GAME_WIDTH - 26, 62, `${COMBAT.maxHealth}`, { fontFamily: "Segoe UI, Tahoma, sans-serif", fontSize: "12px", color: "#a4afc9" }).setOrigin(1, 0),
                moveText: this.add.text(GAME_WIDTH / 2, 58, "", { fontFamily: "Segoe UI, Tahoma, sans-serif", fontSize: "14px", color: "#dff8ff" }).setOrigin(0.5, 0).setAlpha(0)
            };

            this.resultPanel = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2).setDepth(34).setVisible(false);
            this.resultPanelBackground = this.add.rectangle(0, 0, 390, 160, 0xffffff, 0.9).setStrokeStyle(1, 0xffffff, 0.95);
            this.resultPanel.add(this.resultPanelBackground);
            this.resultTitle = this.add.text(0, -20, "", { fontFamily: "Segoe UI, Tahoma, sans-serif", fontSize: "38px", color: "#eff7ff" }).setOrigin(0.5);
            this.resultSubtitle = this.add.text(0, 30, "Press R to restart", { fontFamily: "Segoe UI, Tahoma, sans-serif", fontSize: "16px", color: "#9ea9c2" }).setOrigin(0.5);
            this.resultPanel.add([this.resultTitle, this.resultSubtitle]);
        }

        createFighter(config) {
            const aiProfile = this.getEnemyDifficultyProfile();
            const hurtbox = this.add.rectangle(config.x, config.y, BODY_SIZE.width, BODY_SIZE.height, 0xffffff, 0);
            this.physics.add.existing(hurtbox);
            hurtbox.body.setCollideWorldBounds(true);
            hurtbox.body.setDragX(PHYSICS.dragX);
            hurtbox.body.setMaxVelocity(PHYSICS.maxHorizontalSpeed, PHYSICS.maxFallSpeed);

            const shadow = this.add.ellipse(config.x, GROUND_TOP + 10, 126, 28, 0x000000, 0.24).setDepth(1);
            const aura = this.add.ellipse(config.x, GROUND_TOP + 8, 112, 16, config.accentTint, 0.08).setDepth(2);
            aura.setBlendMode(Phaser.BlendModes.ADD);

            const sprite = this.add.sprite(config.x, GROUND_TOP, TEXTURE_KEY, 0)
                .setOrigin(SPRITE_ORIGIN.x, SPRITE_ORIGIN.y)
                .setScale(SPRITE_SCALE)
                .setDepth(6);

            if (config.baseTint !== null) {
                sprite.setTint(config.baseTint);
            }

            return {
                id: config.id,
                body: hurtbox,
                sprite,
                shadow,
                aura,
                health: COMBAT.maxHealth,
                baseTint: config.baseTint,
                accentTint: config.accentTint,
                afterImageTint: config.accentTint,
                facing: config.id === "player" ? 1 : -1,
                state: "idle",
                dead: false,
                readyX: config.readyX,
                introReady: false,
                moveSession: null,
                chargeSession: null,
                parrySession: null,
                hitStunUntil: 0,
                blockStunUntil: 0,
                downUntil: 0,
                attackCooldownUntil: 0,
                hurtboxRect: new Phaser.Geom.Rectangle(config.x - (BODY_SIZE.width / 2), config.y - (BODY_SIZE.height / 2), BODY_SIZE.width, BODY_SIZE.height),
                hitbox: { active: false, rect: new Phaser.Geom.Rectangle(config.x, config.y, 0, 0), windowIndex: -1 },
                flashTimer: null,
                currentAnimationKey: null,
                lightInput: null,
                heavyInput: null,
                energyInput: null,
                afterImageAt: 0,
                wasGrounded: true,
                celebrationPose: "idle",
                aiNextAttackAt: this.time.now + Phaser.Math.Between(aiProfile.attackMinMs, aiProfile.attackMaxMs),
                aiGuardHoldUntil: 0,
                aiQueuedAirMoveAt: 0,
                aiQueuedAirMoveKey: null,
                aiReactionCooldownUntil: 0,
                aiLastReactedMoveStartedAt: -1,
                aiLastMoveKey: null,
                aiRecentMoves: []
            };
        }

        getEnemyDifficultyProfile() {
            if (this.app && typeof this.app.getDifficultyProfile === "function") {
                return this.app.getDifficultyProfile();
            }
            return AI_DIFFICULTY_PROFILES.hard;
        }

        registerAnimations() {
            Object.keys(ANIM_FRAMES).forEach((key) => {
                if (this.anims.exists(key)) {
                    return;
                }

                this.anims.create({
                    key,
                    frames: this.getAnimationFrames(key),
                    frameRate: ANIM_CONFIG[key].frameRate,
                    repeat: ANIM_CONFIG[key].repeat
                });
            });
        }

        getAnimationFrames(key) {
            if (this.assetMode === "atlas") {
                return ANIM_FRAMES[key].map((frameIndex) => ({ key: TEXTURE_KEY, frame: this.getFrameRef(frameIndex) }));
            }

            return this.anims.generateFrameNumbers(TEXTURE_KEY, { frames: ANIM_FRAMES[key] });
        }

        getFrameRef(frameIndex) {
            if (this.assetMode !== "atlas") {
                return frameIndex;
            }

            const texture = this.textures.get(TEXTURE_KEY);
            const names = texture.getFrameNames();
            const stringIndex = String(frameIndex);
            if (names.includes(stringIndex)) {
                return stringIndex;
            }

            const padded = String(frameIndex).padStart(4, "0");
            const variants = [padded, `${padded}.png`, `${frameIndex}.png`, `frame_${frameIndex}`, `frame-${frameIndex}`, `sprite_${padded}`, `sprite_${frameIndex}`];
            const direct = variants.find((name) => names.includes(name));
            if (direct) {
                return direct;
            }

            const exact = names
                .map((name) => {
                    const match = name.match(/(\d+)/);
                    return match ? { name, value: Number(match[1]) } : null;
                })
                .filter(Boolean)
                .sort((a, b) => a.value - b.value || a.name.localeCompare(b.name))
                .find((entry) => entry.value === frameIndex);

            return exact ? exact.name : (names[frameIndex] || names[0]);
        }

        captureTouchFrame() {
            const frame = {};
            TOUCH_CONTROL_KEYS.forEach((key) => {
                const isDown = Boolean(this.touchControls && this.touchControls[key]);
                frame[key] = {
                    down: isDown,
                    justPressed: isDown && !this.previousTouchFrame[key]
                };
            });
            this.touchFrame = frame;
        }

        commitTouchFrame() {
            TOUCH_CONTROL_KEYS.forEach((key) => {
                this.previousTouchFrame[key] = Boolean(this.touchFrame && this.touchFrame[key] && this.touchFrame[key].down);
            });
        }

        isControlDown(controlName) {
            const touchDown = Boolean(this.touchFrame && this.touchFrame[controlName] && this.touchFrame[controlName].down);
            switch (controlName) {
            case "left":
                return this.cursors.left.isDown || touchDown;
            case "right":
                return this.cursors.right.isDown || touchDown;
            case "up":
                return this.cursors.up.isDown || touchDown;
            case "down":
                return this.cursors.down.isDown || touchDown;
            case "run":
                return this.keys.run.isDown || touchDown;
            case "light":
                return this.keys.light.isDown || touchDown;
            case "power":
                return this.keys.power.isDown || touchDown;
            case "special":
                return this.keys.special.isDown || touchDown;
            case "guard":
                return this.keys.guard.isDown || touchDown;
            case "super":
                return this.keys.super.isDown || touchDown;
            case "blink":
                return this.keys.blink.isDown || touchDown;
            default:
                return touchDown;
            }
        }

        isControlJustPressed(controlName) {
            const touchPressed = Boolean(this.touchFrame && this.touchFrame[controlName] && this.touchFrame[controlName].justPressed);
            switch (controlName) {
            case "up":
                return Phaser.Input.Keyboard.JustDown(this.cursors.up) || touchPressed;
            case "light":
                return Phaser.Input.Keyboard.JustDown(this.keys.light) || touchPressed;
            case "power":
                return Phaser.Input.Keyboard.JustDown(this.keys.power) || touchPressed;
            case "special":
                return Phaser.Input.Keyboard.JustDown(this.keys.special) || touchPressed;
            case "guard":
                return Phaser.Input.Keyboard.JustDown(this.keys.guard) || touchPressed;
            case "super":
                return Phaser.Input.Keyboard.JustDown(this.keys.super) || touchPressed;
            case "blink":
                return Phaser.Input.Keyboard.JustDown(this.keys.blink) || touchPressed;
            default:
                return touchPressed;
            }
        }

        update(time, delta) {
            this.captureTouchFrame();
            if (this.updateHitstop(time)) {
                this.commitTouchFrame();
                return;
            }
            if (this.roundOver && Phaser.Input.Keyboard.JustDown(this.keys.restart)) {
                if (this.app) {
                    this.app.startMatch();
                } else {
                    this.scene.restart();
                }
                return;
            }

            this.updateBackdrop(time);

            if (this.phase === "intro") {
                this.updateIntro(time);
            } else if (this.phase === "celebration") {
                this.updateCelebration(time);
            } else if (!this.roundOver) {
                this.refreshFighterState(this.player, time);
                this.refreshFighterState(this.enemy, time);
                this.handlePlayerInput(time);
                this.handleEnemyAI(time);
                this.updateMoveState(this.player, time);
                this.updateMoveState(this.enemy, time);
                this.updateProjectiles(time, delta);
                this.checkMoveCollision(this.player, this.enemy, time);
                this.checkMoveCollision(this.enemy, this.player, time);
            } else {
                this.player.body.body.setAccelerationX(0);
                this.enemy.body.body.setAccelerationX(0);
            }

            this.updateFighterAnimation(this.player, time);
            this.updateFighterAnimation(this.enemy, time);
            this.syncFighterVisual(this.player, time);
            this.syncFighterVisual(this.enemy, time);
            this.updateHealthBars();
            this.commitTouchFrame();
        }

        updateHitstop(time) {
            if (!this.hitstopActive) {
                return false;
            }

            if (time < this.hitstopReleaseAt) {
                return true;
            }

            this.hitstopActive = false;
            this.hitstopReleaseAt = 0;
            if (this.physics && this.physics.world && this.physics.world.isPaused) {
                this.physics.world.resume();
            }
            this.time.paused = false;
            this.anims.resumeAll();
            this.tweens.resumeAll();
            return false;
        }

        startHitstop(time, durationMs) {
            const duration = Math.max(0, Math.round(durationMs || 0));
            if (!duration) {
                return;
            }

            this.hitstopReleaseAt = Math.max(this.hitstopReleaseAt, time + duration);
            if (this.hitstopActive) {
                return;
            }

            this.hitstopActive = true;
            this.physics.world.pause();
            this.time.paused = true;
            this.anims.pauseAll();
            this.tweens.pauseAll();
        }

        getImpactHitstopMs(windowConfig, blocked, defenderHealth) {
            if (defenderHealth <= 0) {
                return COMBAT.hitstopFinisherMs;
            }
            if (blocked) {
                return windowConfig.edgeSnap ? (COMBAT.hitstopBlockMs + 6) : COMBAT.hitstopBlockMs;
            }
            if (windowConfig.edgeSnap || windowConfig.forceKnockdown) {
                return COMBAT.hitstopFinisherMs - 4;
            }
            return windowConfig.shakeIntensity >= 0.005 ? COMBAT.hitstopHeavyMs : COMBAT.hitstopLightMs;
        }

        getProjectileHitstopMs(projectileData, blocked, defenderHealth) {
            if (defenderHealth <= 0) {
                return COMBAT.hitstopFinisherMs - 10;
            }
            if (blocked) {
                return COMBAT.hitstopBlockMs - 4;
            }
            return projectileData.shakeIntensity >= 0.005 ? (COMBAT.hitstopProjectileMs + 8) : COMBAT.hitstopProjectileMs;
        }

        updateBackdrop(time) {
            if (this.moonGlow && this.activeSceneTheme) {
                const backdropTheme = this.activeSceneTheme.backdrop;
                this.moonGlow.setAlpha(backdropTheme.orbGlowAlpha + (Math.sin(time / 500) * backdropTheme.orbGlowPulse));
            }
        }

        applyTheme(sceneTheme) {
            this.activeSceneTheme = sceneTheme || SCENE_THEMES.dark;
            const backdropTheme = this.activeSceneTheme.backdrop;
            const uiTheme = this.activeSceneTheme.ui;
            const groundTheme = this.activeSceneTheme.ground;
            const actorTheme = this.activeSceneTheme.actors;
            const effectTheme = this.activeSceneTheme.effects;

            if (this.cameras && this.cameras.main) {
                this.cameras.main.setBackgroundColor(this.activeSceneTheme.cameraBackgroundCss);
            }

            if (this.themeNodes.backdrop) {
                const backdrop = this.themeNodes.backdrop;
                backdrop.skyBase.setFillStyle(backdropTheme.skyBase, 1);
                backdrop.skyMid.setFillStyle(backdropTheme.skyMid, 1);
                backdrop.skyLower.setFillStyle(backdropTheme.skyLower, 1);
                backdrop.orbGlow.setFillStyle(backdropTheme.orbGlow, backdropTheme.orbGlowAlpha);
                backdrop.orbCore.setFillStyle(backdropTheme.orbCore, 0.95);
                backdrop.orbHalo.setFillStyle(backdropTheme.orbHalo, 0.1);
                backdrop.clouds.forEach((cloud, index) => {
                    const cloudTheme = backdropTheme.cloudColors[index];
                    cloud.setFillStyle(cloudTheme.color, cloudTheme.alpha);
                });
                backdrop.columns.forEach((column) => {
                    column.setFillStyle(backdropTheme.columnColor, backdropTheme.columnAlpha);
                });
                backdrop.columnGlows.forEach((columnGlow) => {
                    columnGlow.setFillStyle(backdropTheme.columnGlow, backdropTheme.columnGlowAlpha);
                });
                backdrop.floorBase.setFillStyle(backdropTheme.floorBase, 1);
                backdrop.floorLine.setFillStyle(backdropTheme.floorLine, backdropTheme.floorLineAlpha);
                backdrop.floorLineSoft.setFillStyle(backdropTheme.floorLine, backdropTheme.floorLineSoftAlpha);
            }

            if (this.themeNodes.ground) {
                this.themeNodes.ground.ground.setFillStyle(groundTheme.fill, 1);
                this.themeNodes.ground.lip.setFillStyle(groundTheme.lip, groundTheme.lipAlpha);
            }

            if (this.ui) {
                this.ui.playerLabel.setColor(uiTheme.text);
                this.ui.enemyLabel.setColor(uiTheme.text);
                this.ui.titleLabel.setColor(uiTheme.title);
                this.ui.playerBarBack.setFillStyle(uiTheme.playerBarBg, uiTheme.panelAlpha).setStrokeStyle(1, uiTheme.panelStroke, 1);
                this.ui.enemyBarBack.setFillStyle(uiTheme.enemyBarBg, uiTheme.panelAlpha).setStrokeStyle(1, uiTheme.panelStroke, 1);
                this.ui.playerValue.setColor(uiTheme.muted);
                this.ui.enemyValue.setColor(uiTheme.muted);
                this.ui.moveText.setColor(uiTheme.title);
            }

            if (this.resultPanelBackground) {
                this.resultPanelBackground.setFillStyle(uiTheme.overlayFill, uiTheme.overlayAlpha).setStrokeStyle(1, uiTheme.overlayStroke, 0.95);
                this.resultTitle.setColor(uiTheme.text);
                this.resultSubtitle.setColor(uiTheme.muted);
            }

            if (this.flashOverlay) {
                this.flashOverlay.setFillStyle(effectTheme.flashBase, 0);
            }

            if (this.player) {
                this.player.accentTint = actorTheme.playerAccent;
                this.player.afterImageTint = actorTheme.afterImagePlayer;
                this.player.baseTint = null;
                if (!this.player.flashTimer) {
                    this.player.sprite.clearTint();
                }
            }

            if (this.enemy) {
                this.enemy.accentTint = actorTheme.enemyAccent;
                this.enemy.afterImageTint = actorTheme.afterImageEnemy;
                this.enemy.baseTint = actorTheme.enemyBaseTint;
                if (!this.enemy.flashTimer) {
                    this.enemy.sprite.setTint(this.enemy.baseTint);
                }
            }

            this.updateHealthBars();
        }

        getThemeEffects() {
            return (this.activeSceneTheme && this.activeSceneTheme.effects) ? this.activeSceneTheme.effects : SCENE_THEMES.dark.effects;
        }

        applyAudioPreference(isEnabled) {
            this.audioEnabled = Boolean(isEnabled);
            if (this.sound) {
                this.sound.mute = !this.audioEnabled;
            }
        }

        playClashSound(kind) {
            if (!this.audioEnabled || !this.sound || !this.cache.audio.exists(CLASH_SOUND_KEY)) {
                return;
            }

            const now = this.time ? this.time.now : 0;
            const variants = {
                hit: { volume: 0.24, rate: 1.04, detune: 0, seek: 0.012, cooldownMs: 64 },
                block: { volume: 0.2, rate: 0.92, detune: -60, seek: 0.018, cooldownMs: 72 },
                parry: { volume: 0.3, rate: 1.12, detune: 140, seek: 0.01, cooldownMs: 88 },
                projectile: { volume: 0.18, rate: 0.98, detune: 80, seek: 0.014, cooldownMs: 70 },
                finisher: { volume: 0.34, rate: 0.88, detune: -100, seek: 0.008, cooldownMs: 110 }
            };
            const config = variants[kind] || variants.hit;
            if (now < this.nextClashSoundAt) {
                return;
            }

            this.nextClashSoundAt = now + config.cooldownMs;
            const { cooldownMs, ...playbackConfig } = config;
            this.sound.play(CLASH_SOUND_KEY, playbackConfig);
        }

        themeMoveTint(tint, emphasis) {
            const effectTheme = this.getThemeEffects();
            if (!this.activeSceneTheme || this.activeSceneTheme.name !== "light") {
                return tint;
            }

            const mixedWarm = mixColor(tint, effectTheme.tintWarm, effectTheme.tintMix + (emphasis || 0));
            return mixColor(mixedWarm, effectTheme.tintHighlight, 0.1 + ((emphasis || 0) * 0.08));
        }

        themeGlowTint(tint) {
            const effectTheme = this.getThemeEffects();
            if (!this.activeSceneTheme || this.activeSceneTheme.name !== "light") {
                return tint;
            }

            return mixColor(tint, effectTheme.tintHighlight, effectTheme.glowMix);
        }

        updateIntro(time) {
            const playerReady = this.advanceToReadyMarker(this.player, INTRO.playerReadyX);
            const enemyReady = this.advanceToReadyMarker(this.enemy, INTRO.enemyReadyX);

            if (playerReady && enemyReady) {
                this.phase = "fight";
                this.player.state = "idle";
                this.enemy.state = "idle";
                this.player.body.body.setVelocityX(0);
                this.enemy.body.body.setVelocityX(0);
                this.player.body.body.setAccelerationX(0);
                this.enemy.body.body.setAccelerationX(0);
                this.showMoveText("Fight!", this.getThemeEffects().moveText);
                if (this.app) {
                    this.app.noteFightStarted();
                }
                const difficultyLabel = this.app && typeof this.app.getDifficultyProfile === "function"
                    ? this.app.getDifficultyProfile().label
                    : "Hard";
                setStatus(
                    this.app && this.app.touchUiEnabled
                        ? `Fight live on ${difficultyLabel} AI. Circular touch controls are active inside the arena: left cluster moves, right cluster handles A, D, F, S, B, and Y.`
                        : `Fight live on ${difficultyLabel} AI. Tap A = slash, hold A = omni combo, Left/Right + B = super slash, Y = blink, D = heavy, F = energy, S = parry or guard.`,
                    false
                );
            }
        }

        updateCelebration(time) {
            const sequence = this.roundEndSequence;
            if (!sequence) {
                return;
            }

            const winner = sequence.winner;
            const loser = sequence.loser;
            winner.body.body.setAccelerationX(0);
            loser.body.body.setAccelerationX(0);
            winner.body.body.setVelocityX(0);
            loser.body.body.setVelocityX(0);

            winner.state = "celebrate";
            winner.facing = this.getOpponentDirection(winner);
            loser.state = loser.dead ? "dead" : "down";

            if (time >= sequence.nextPoseAt) {
                sequence.poseIndex = (sequence.poseIndex + 1) % CELEBRATION.poses.length;
                winner.celebrationPose = CELEBRATION.poses[sequence.poseIndex];
                winner.currentAnimationKey = null;
                sequence.nextPoseAt = time + CELEBRATION.poseIntervalMs;
                this.spawnQueuePulse(winner, winner.accentTint, 0.18);
            }

            if (time >= sequence.nextEmoteAt) {
                const emote = CELEBRATION.emotes[sequence.emoteIndex % CELEBRATION.emotes.length];
                this.spawnCelebrationEmote(winner, emote.text, this.themeMoveTint(winner.accentTint, emote.emphasis));
                sequence.emoteIndex += 1;
                sequence.nextEmoteAt = time + CELEBRATION.emoteIntervalMs;
            }

            if (time >= sequence.nextHopAt && this.isGrounded(winner)) {
                winner.body.body.setVelocityY(CELEBRATION.hopVelocity);
                sequence.nextHopAt = time + CELEBRATION.hopIntervalMs;
                this.spawnLandingRing(winner, winner.accentTint, true);
            }

            if (time >= sequence.finishAt) {
                this.concludeRoundCelebration();
            }
        }

        advanceToReadyMarker(fighter, readyX) {
            const deltaX = readyX - fighter.body.x;
            const distance = Math.abs(deltaX);

            if (distance <= INTRO.tolerance) {
                fighter.body.x = readyX;
                fighter.facing = fighter.id === "player" ? 1 : -1;
                fighter.body.body.setVelocityX(0);
                fighter.body.body.setAccelerationX(0);
                fighter.state = "idle";
                fighter.introReady = true;
                return true;
            }

            fighter.introReady = false;
            fighter.facing = Math.sign(deltaX);
            fighter.body.body.setAccelerationX(fighter.facing * PHYSICS.runAcceleration);
            if (Math.abs(fighter.body.body.velocity.x) > PHYSICS.runSpeed) {
                fighter.body.body.setVelocityX(fighter.facing * PHYSICS.runSpeed);
            }
            fighter.state = "run";
            return false;
        }

        refreshFighterState(fighter, time) {
            if (fighter.state === "charge" && fighter.chargeSession) {
                const charge = fighter.chargeSession;
                if (fighter.id === "player") {
                    if (!this.isControlDown("power") && time >= charge.minReadyAt) {
                        this.releaseChargeStrike(fighter, time);
                    } else if (!this.isControlDown("power") && time < charge.minReadyAt) {
                        fighter.chargeSession = null;
                        fighter.state = this.isGrounded(fighter) ? "idle" : "jump";
                    } else if (time >= charge.autoReleaseAt) {
                        this.releaseChargeStrike(fighter, time);
                    }
                } else if (time >= charge.releaseAt) {
                    this.releaseChargeStrike(fighter, time);
                }
            }

            if (fighter.state === "attack" && fighter.moveSession) {
                const session = fighter.moveSession;
                if ((time - session.startedAt) >= session.move.finishMs) {
                    const queuedNextKey = session.queuedNextKey;
                    fighter.moveSession = null;
                    fighter.hitbox.active = false;
                    fighter.hitbox.windowIndex = -1;
                    fighter.sprite.setAlpha(1);

                    if (!fighter.dead && queuedNextKey) {
                        this.startMove(fighter, time, queuedNextKey, true);
                        return;
                    }

                    fighter.attackCooldownUntil = time + session.move.cooldownMs;
                    fighter.state = this.isGrounded(fighter) ? "idle" : "jump";
                }
            }

            if (fighter.state === "parry" && fighter.parrySession && time >= fighter.parrySession.endAt) {
                fighter.parrySession = null;
                if (fighter.id === "player" ? this.isControlDown("guard") : time < fighter.aiGuardHoldUntil) {
                    this.startBlock(fighter, time);
                } else {
                    fighter.state = this.isGrounded(fighter) ? "idle" : "jump";
                }
            }

            if (fighter.state === "block" && time >= fighter.blockStunUntil) {
                const stillHolding = fighter.id === "player" ? this.isControlDown("guard") : time < fighter.aiGuardHoldUntil;
                if (!stillHolding || !this.isGrounded(fighter)) {
                    fighter.state = this.isGrounded(fighter) ? "idle" : "jump";
                }
            }

            if (fighter.state === "hit" && time >= fighter.hitStunUntil) {
                fighter.state = this.isGrounded(fighter) ? "idle" : "jump";
            }

            if (fighter.state === "down" && time >= fighter.downUntil) {
                fighter.body.body.setAccelerationX(0);
                fighter.body.body.setVelocityX(0);
                fighter.state = fighter.dead ? "dead" : (this.isGrounded(fighter) ? "idle" : "jump");
            }

            if (fighter.id === "player" && (fighter.dead || fighter.state === "hit" || fighter.state === "down" || fighter.state === "dead")) {
                this.clearBufferedInputs(fighter);
            }
        }

        handlePlayerInput(time) {
            const fighter = this.player;
            if (fighter.dead || this.phase !== "fight") {
                fighter.body.body.setAccelerationX(0);
                return;
            }

            const grounded = this.isGrounded(fighter);
            const moveIntent = this.getMoveIntent();
            const wantsRun = grounded && moveIntent !== 0 && this.isControlDown("run");

            if (fighter.state !== "attack" && fighter.state !== "charge" && fighter.state !== "parry" && fighter.state !== "block") {
                fighter.facing = this.getOpponentDirection(fighter);
            }

            if (this.isControlJustPressed("guard") && grounded && this.canDefend(fighter, time)) {
                this.startParry(fighter, time, true);
                return;
            }

            const handledBlink = this.handlePlayerBlinkInput(fighter, time, grounded);
            if (handledBlink) {
                return;
            }

            const handledSuper = this.handlePlayerSuperInput(fighter, time, grounded);
            if (handledSuper) {
                return;
            }

            const handledHeavy = this.handlePlayerHeavyInput(fighter, time, grounded);
            if (handledHeavy) {
                return;
            }

            const handledEnergy = this.handlePlayerEnergyInput(fighter, time, grounded);
            if (handledEnergy) {
                return;
            }

            if (fighter.state === "charge") {
                fighter.body.body.setAccelerationX(0);
                fighter.body.body.setVelocityX(0);
                return;
            }

            if (fighter.state === "parry" || fighter.state === "block" || fighter.state === "focus") {
                fighter.body.body.setAccelerationX(0);
                if (fighter.state === "block" || fighter.state === "focus") {
                    fighter.body.body.setVelocityX(0);
                }
                return;
            }

            const startedAttack = this.processPlayerOffense(fighter, time, grounded, moveIntent, wantsRun);
            if (startedAttack) {
                return;
            }

            if (this.isControlJustPressed("up") && grounded && this.canMove(fighter, time)) {
                fighter.body.body.setVelocityY(PHYSICS.jumpVelocity);
                fighter.state = "jump";
                this.spawnLandingRing(fighter, fighter.accentTint, true);
            }

            if (!this.canMove(fighter, time)) {
                fighter.body.body.setAccelerationX(0);
                return;
            }

            const maxSpeed = grounded ? (wantsRun ? PHYSICS.runSpeed : PHYSICS.walkSpeed) : PHYSICS.runSpeed;
            const acceleration = grounded ? (wantsRun ? PHYSICS.runAcceleration : PHYSICS.groundAcceleration) : (PHYSICS.groundAcceleration * PHYSICS.airControl);
            fighter.body.body.setAccelerationX(moveIntent * acceleration);

            if (moveIntent === 0) {
                fighter.body.body.setAccelerationX(0);
            }

            if (Math.abs(fighter.body.body.velocity.x) > maxSpeed && moveIntent !== 0) {
                fighter.body.body.setVelocityX(Math.sign(fighter.body.body.velocity.x) * maxSpeed);
            }

            if (!grounded) {
                fighter.state = "jump";
            } else if (wantsRun && moveIntent !== 0) {
                fighter.state = "run";
            } else if (moveIntent !== 0 || Math.abs(fighter.body.body.velocity.x) > 18) {
                fighter.state = "walk";
            } else {
                fighter.state = "idle";
            }
        }

        handlePlayerBlinkInput(fighter, time, grounded) {
            if (!this.isControlJustPressed("blink")) {
                return false;
            }

            if (!grounded || !this.canStartMove(fighter, time)) {
                return false;
            }

            this.startMove(fighter, time, "blink_step");
            return true;
        }

        handlePlayerSuperInput(fighter, time, grounded) {
            if (!this.isControlJustPressed("super")) {
                return false;
            }

            if (!grounded || !this.canStartMove(fighter, time)) {
                return false;
            }

            this.startMove(fighter, time, "super_slash", false, {
                edgeDirection: this.getSuperSlashDirection(fighter)
            });
            return true;
        }

        processPlayerOffense(fighter, time, grounded, moveIntent, wantsRun) {
            if (fighter.lightInput) {
                if (!grounded || fighter.dead || fighter.state === "hit" || fighter.state === "down") {
                    fighter.lightInput = null;
                    return false;
                }

                const heldMs = time - fighter.lightInput.startedAt;
                if (this.isControlDown("light")) {
                    if (heldMs >= INPUT.lightHoldMs && this.canStartMove(fighter, time)) {
                        fighter.lightInput = null;
                        this.startMove(fighter, time, "omni_slash_combo");
                        return true;
                    }
                    return true;
                }

                fighter.lightInput = null;
                if (this.canStartMove(fighter, time)) {
                    this.startMove(fighter, time, "quick_slash");
                    return true;
                }
                return false;
            }

            if (this.isControlJustPressed("light")) {
                if (fighter.state === "attack" && fighter.moveSession) {
                    this.tryQueueMove(fighter, time, "light");
                    return true;
                }

                if (!this.canStartMove(fighter, time)) {
                    return false;
                }

                if (!grounded && this.isControlDown("down")) {
                    this.startMove(fighter, time, "downward_strike");
                    return true;
                }

                if (grounded && wantsRun && moveIntent !== 0) {
                    this.startMove(fighter, time, "dash_slash");
                    return true;
                }

                if (grounded && this.isControlDown("up")) {
                    this.startMove(fighter, time, "upward_slash");
                    return true;
                }

                if (grounded) {
                    fighter.lightInput = { startedAt: time };
                    return true;
                }
            }

            return false;
        }

        getSuperSlashDirection(fighter) {
            const moveIntent = this.getMoveIntent();
            if (moveIntent !== 0) {
                return moveIntent;
            }
            return fighter.facing || this.getOpponentDirection(fighter);
        }

        getEnemySuperSlashDirection(fighter, target) {
            const targetTowardNearestEdge = target.body.x >= (GAME_WIDTH * 0.5) ? 1 : -1;
            if (Math.abs(target.body.x - fighter.body.x) < 108) {
                return targetTowardNearestEdge;
            }
            return fighter.facing || targetTowardNearestEdge;
        }

        startEnemyMove(fighter, target, time, moveKey) {
            const moveContext = moveKey === "super_slash"
                ? { edgeDirection: this.getEnemySuperSlashDirection(fighter, target) }
                : null;
            this.startMove(fighter, time, moveKey, false, moveContext);
        }

        handleEnemyAI(time) {
            const fighter = this.enemy;
            const target = this.player;
            const aiProfile = this.getEnemyDifficultyProfile();

            if (fighter.dead || this.phase !== "fight") {
                fighter.body.body.setAccelerationX(0);
                return;
            }

            const grounded = this.isGrounded(fighter);
            const deltaX = target.body.x - fighter.body.x;
            const distance = Math.abs(deltaX);
            const lowHealthThreshold = COMBAT.maxHealth * 0.34;
            fighter.facing = deltaX >= 0 ? 1 : -1;

            if (fighter.state === "attack") {
                this.queueEnemyComboFollowUp(fighter, target, time);
                fighter.body.body.setAccelerationX(0);
                return;
            }

            if (fighter.state === "charge" || fighter.state === "parry" || fighter.state === "block") {
                fighter.body.body.setAccelerationX(0);
                if (fighter.state === "block") {
                    fighter.body.body.setVelocityX(0);
                }
                return;
            }

            if (fighter.aiQueuedAirMoveAt && grounded) {
                fighter.aiQueuedAirMoveAt = 0;
                fighter.aiQueuedAirMoveKey = null;
            }

            if (fighter.aiQueuedAirMoveAt && !grounded && time >= fighter.aiQueuedAirMoveAt && this.canStartMove(fighter, time)) {
                const queuedAirMove = fighter.aiQueuedAirMoveKey || this.pickEnemyAirMove(fighter, target, distance);
                fighter.aiQueuedAirMoveAt = 0;
                fighter.aiQueuedAirMoveKey = null;
                this.startMove(fighter, time, queuedAirMove || "air_combo_finisher");
                return;
            }

            if (!grounded) {
                fighter.state = "jump";
                fighter.body.body.setAccelerationX(0);
                return;
            }

            if (target.state === "down" || target.dead) {
                fighter.body.body.setAccelerationX(0);
                if (Math.abs(fighter.body.body.velocity.x) < 18) {
                    fighter.body.body.setVelocityX(0);
                }
                fighter.state = "idle";
                fighter.aiNextAttackAt = Math.max(fighter.aiNextAttackAt, time + 220);
                return;
            }

            const punishOpportunity = this.isEnemyPunishOpportunity(target, time);
            if (punishOpportunity &&
                distance < 240 &&
                this.canStartMove(fighter, time) &&
                time >= (fighter.aiNextAttackAt - 90)) {
                const punishMove = this.pickEnemyPunishMove(fighter, target, distance);
                if (punishMove) {
                    this.startEnemyMove(fighter, target, time, punishMove);
                    if (punishMove === "blink_step") {
                        this.scheduleEnemyNextAttack(fighter, time, aiProfile.blinkFollowMinMs, aiProfile.blinkFollowMaxMs);
                    } else {
                        this.scheduleEnemyNextAttack(fighter, time, aiProfile.punishFollowMinMs, aiProfile.punishFollowMaxMs);
                    }
                    return;
                }
            }

            const canReactToPlayerMove = target.moveSession &&
                this.canDefend(fighter, time) &&
                distance < 142 &&
                time >= fighter.aiReactionCooldownUntil &&
                target.moveSession.startedAt !== fighter.aiLastReactedMoveStartedAt &&
                (time - target.moveSession.startedAt) <= aiProfile.reactionWindowMs;

            if (canReactToPlayerMove) {
                const currentMove = target.moveSession.move;
                const highThreatMove = currentMove.projectile || currentMove.windows.some((windowConfig) => windowConfig.damage >= 18 || windowConfig.forceKnockdown);
                const parryChance = aiProfile.parryChance + (highThreatMove ? 10 : 0) + (distance < 92 ? 4 : 0);
                const guardChance = aiProfile.guardChance + (currentMove.projectile ? 18 : 6) + (highThreatMove ? 8 : 0);
                fighter.aiLastReactedMoveStartedAt = target.moveSession.startedAt;
                fighter.aiReactionCooldownUntil = time + aiProfile.reactionCooldownMs;

                if (!currentMove.projectile && Phaser.Math.Between(0, 99) < parryChance) {
                    this.startParry(fighter, time, false);
                    this.scheduleEnemyNextAttack(fighter, time, 160, 260);
                    return;
                }

                if (Phaser.Math.Between(0, 99) < guardChance) {
                    this.startBlock(fighter, time);
                    fighter.aiGuardHoldUntil = time + (currentMove.projectile ? 380 : 320);
                    this.scheduleEnemyNextAttack(fighter, time, 150, 240);
                    return;
                }
            }

            if (!this.isGrounded(target) &&
                distance < 160 &&
                this.canMove(fighter, time) &&
                !fighter.aiQueuedAirMoveAt &&
                time >= fighter.aiReactionCooldownUntil &&
                Phaser.Math.Between(0, 99) < (target.moveSession ? (aiProfile.antiAirJumpChance + 6) : aiProfile.antiAirJumpChance)) {
                const queuedAirMove = this.pickEnemyAirMove(fighter, target, distance) || "air_combo_finisher";
                fighter.aiReactionCooldownUntil = time + aiProfile.reactionCooldownMs;
                fighter.aiQueuedAirMoveKey = queuedAirMove;
                fighter.body.body.setVelocityY(PHYSICS.jumpVelocity * 0.94);
                fighter.body.body.setVelocityX(fighter.facing * 96);
                fighter.aiQueuedAirMoveAt = time + (queuedAirMove === "downward_strike" ? 96 : 120);
                fighter.state = "jump";
                return;
            }

            if (time >= fighter.aiNextAttackAt && this.canStartMove(fighter, time)) {
                const plannedMove = this.pickEnemyMove(fighter, target, distance);
                if (plannedMove === "charged_strike") {
                    this.startCharge(fighter, time, Phaser.Math.Between(360, 540));
                    this.scheduleEnemyNextAttack(fighter, time, 520, 760);
                    return;
                }

                if (plannedMove) {
                    this.startEnemyMove(fighter, target, time, plannedMove);
                    if (plannedMove === "blink_step") {
                        this.scheduleEnemyNextAttack(fighter, time, aiProfile.blinkFollowMinMs, aiProfile.blinkFollowMaxMs);
                    } else {
                        this.scheduleEnemyNextAttack(fighter, time, aiProfile.attackMinMs, aiProfile.attackMaxMs);
                    }
                    return;
                }
            }

            const preferredRange = this.getEnemyPreferredRange(fighter, target);
            const wantsRetreat = !punishOpportunity &&
                distance < aiProfile.retreatRange &&
                (target.state === "attack" || target.state === "charge" || target.state === "focus" || fighter.health < lowHealthThreshold);
            let moveDirection = 0;
            let wantsRun = false;

            if (wantsRetreat) {
                moveDirection = -fighter.facing;
                wantsRun = true;
            } else if (distance > (preferredRange + 22)) {
                moveDirection = fighter.facing;
                wantsRun = distance > aiProfile.farRange || punishOpportunity || target.state === "focus";
            } else if (distance < (preferredRange - 28)) {
                moveDirection = -fighter.facing;
                wantsRun = fighter.health < lowHealthThreshold || target.state === "attack";
            }

            if (moveDirection === 0) {
                fighter.body.body.setAccelerationX(0);
                if (Math.abs(fighter.body.body.velocity.x) < 18) {
                    fighter.body.body.setVelocityX(0);
                }
                fighter.state = "idle";
                return;
            }

            const targetSpeed = wantsRun ? PHYSICS.runSpeed : PHYSICS.walkSpeed;
            const acceleration = wantsRun ? PHYSICS.runAcceleration : PHYSICS.groundAcceleration;

            fighter.body.body.setAccelerationX(moveDirection * acceleration);
            if (Math.abs(fighter.body.body.velocity.x) > targetSpeed) {
                fighter.body.body.setVelocityX(moveDirection * targetSpeed);
            }
            fighter.state = wantsRun ? "run" : "walk";
        }

        scheduleEnemyNextAttack(fighter, time, minMs, maxMs) {
            fighter.aiNextAttackAt = time + Phaser.Math.Between(minMs, maxMs);
        }

        isMoveRecovering(fighter, time) {
            if (!fighter.moveSession) {
                return time < fighter.attackCooldownUntil;
            }

            const moveWindows = fighter.moveSession.move.windows || [];
            if (!moveWindows.length) {
                return (time - fighter.moveSession.startedAt) > Math.max(90, fighter.moveSession.move.finishMs * 0.45);
            }
            const lastWindow = moveWindows[moveWindows.length - 1];
            return (time - fighter.moveSession.startedAt) > (lastWindow.end + 24);
        }

        isEnemyPunishOpportunity(target, time) {
            return !target.dead && (
                target.state === "hit" ||
                target.state === "block" ||
                target.state === "charge" ||
                target.state === "focus" ||
                (target.state === "attack" && this.isMoveRecovering(target, time)) ||
                time < target.attackCooldownUntil
            );
        }

        queueEnemyComboFollowUp(fighter, target, time) {
            const aiProfile = this.getEnemyDifficultyProfile();
            const session = fighter.moveSession;
            if (!session || !session.move.chain || session.queuedNextKey) {
                return false;
            }

            const elapsed = time - session.startedAt;
            const chain = session.move.chain;
            const distance = Math.abs(target.body.x - fighter.body.x);
            if (elapsed < chain.start || elapsed > chain.end || distance > 160 || !this.isGrounded(target)) {
                return false;
            }

            const targetPinned = target.state === "hit" || target.state === "block" || this.isEnemyPunishOpportunity(target, time);
            if (!targetPinned && fighter.health >= target.health && Phaser.Math.Between(0, 99) < aiProfile.comboBreakChance) {
                return false;
            }

            session.queuedNextKey = chain.next;
            return true;
        }

        pickEnemyAirMove(fighter, target, distance) {
            return this.pickWeightedEnemyMove(fighter, target, distance, [
                { key: "air_combo_finisher", weight: distance < 138 ? 6 : 4 },
                { key: "downward_strike", weight: distance < 124 ? 5 : 3 }
            ], { airborne: true, preferPower: true });
        }

        isEnemyPowerMove(moveKey) {
            return [
                "super_slash",
                "charged_strike",
                "teleport_slash",
                "iaido_slash",
                "energy_slash",
                "omni_slash_combo",
                "air_combo_finisher",
                "downward_strike",
                "triple_slash_combo"
            ].includes(moveKey);
        }

        getEnemyMoveWeight(fighter, target, distance, moveKey, baseWeight, context) {
            if (!moveKey || !baseWeight) {
                return 0;
            }

            const aiProfile = this.getEnemyDifficultyProfile();
            let weight = baseWeight;
            const targetAirborne = !this.isGrounded(target);
            const targetDefending = target.state === "block" || target.state === "parry";
            const targetCommitted = target.state === "charge" || target.state === "focus";
            const targetRecovering = this.isEnemyPunishOpportunity(target, this.time.now);
            const behindOnHealth = fighter.health < target.health;
            const targetLow = target.health <= (COMBAT.maxHealth * 0.4);
            const fighterLow = fighter.health <= (COMBAT.maxHealth * 0.34);
            const recentMoves = fighter.aiRecentMoves || [];
            const recentIndex = recentMoves.indexOf(moveKey);

            if (recentIndex === 0) {
                weight *= 0.34;
            } else if (recentIndex === 1) {
                weight *= 0.58;
            } else if (recentIndex === 2) {
                weight *= 0.74;
            } else if (recentIndex >= 3) {
                weight *= 0.88;
            } else {
                weight *= 1.08;
            }

            if (this.isEnemyPowerMove(moveKey)) {
                weight *= aiProfile.powerMoveBias;
                if (targetLow || (context && context.finisher)) {
                    weight *= aiProfile.lowHealthPowerBias;
                }
            }

            switch (moveKey) {
                case "quick_slash":
                    weight *= distance < 96 ? 1.35 : 0.52;
                    if (targetDefending) {
                        weight *= 0.78;
                    }
                    if (targetRecovering && distance < 100) {
                        weight *= 1.15;
                    }
                    break;
                case "triple_slash_combo":
                    weight *= distance < 128 ? 1.32 : 0.48;
                    if (targetDefending || targetRecovering || targetCommitted) {
                        weight *= 1.2;
                    }
                    if (behindOnHealth) {
                        weight *= 1.05;
                    }
                    break;
                case "spin_attack":
                    weight *= distance < 118 ? 1.25 : 0.66;
                    if (targetDefending) {
                        weight *= 1.35;
                    }
                    if (targetRecovering && distance < 110) {
                        weight *= 1.08;
                    }
                    break;
                case "dash_slash":
                    weight *= distance > 92 && distance < 212 ? 1.28 : (distance <= 92 ? 0.46 : 0.9);
                    if (targetCommitted || targetRecovering) {
                        weight *= 1.15;
                    }
                    break;
                case "charged_strike":
                    weight *= distance >= 120 && distance < 260 ? 1.22 : 0.58;
                    if (behindOnHealth) {
                        weight *= 1.28;
                    }
                    if (fighterLow) {
                        weight *= 1.12;
                    }
                    if (targetRecovering && distance < 170) {
                        weight *= 0.8;
                    }
                    break;
                case "iaido_slash":
                    weight *= distance >= 96 && distance < 196 ? 1.34 : (distance < 78 ? 0.68 : 0.82);
                    if (targetCommitted || targetRecovering) {
                        weight *= 1.25;
                    }
                    break;
                case "teleport_slash":
                    weight *= distance >= 156 ? 1.36 : (distance < 108 ? 0.5 : 0.92);
                    if (targetCommitted || targetRecovering) {
                        weight *= 1.18;
                    }
                    if (targetDefending) {
                        weight *= 1.06;
                    }
                    break;
                case "energy_slash":
                    weight *= distance >= 118 ? 1.28 : 0.56;
                    if (targetDefending) {
                        weight *= 1.32;
                    }
                    if (targetAirborne && distance > 118) {
                        weight *= 1.08;
                    }
                    break;
                case "blink_step":
                    weight *= distance >= 188 ? 1.55 : (distance < 132 ? 0.46 : 0.9);
                    if (targetCommitted || targetRecovering) {
                        weight *= 1.18;
                    }
                    if (behindOnHealth) {
                        weight *= 1.08;
                    }
                    break;
                case "super_slash":
                    weight *= distance < 132 ? 1.42 : 0.34;
                    if (targetCommitted || targetRecovering) {
                        weight *= 1.22;
                    }
                    if (targetLow) {
                        weight *= 1.18;
                    }
                    if (targetDefending) {
                        weight *= 1.1;
                    }
                    break;
                case "omni_slash_combo":
                    weight *= distance < 136 ? 1.32 : 0.46;
                    if (targetDefending || targetRecovering) {
                        weight *= 1.26;
                    }
                    if (!targetDefending && !targetRecovering && !targetCommitted) {
                        weight *= 0.82;
                    }
                    if (targetAirborne) {
                        weight *= 0.8;
                    }
                    break;
                case "upward_slash":
                    weight *= targetAirborne ? 1.78 : (distance < 120 ? 0.92 : 0.44);
                    if (targetRecovering && targetAirborne) {
                        weight *= 1.1;
                    }
                    break;
                case "downward_strike":
                    weight *= context && context.airborne ? 1.28 : 0.3;
                    if (fighter.body.y < (target.body.y - 10) || distance < 108) {
                        weight *= 1.24;
                    }
                    if (targetAirborne) {
                        weight *= 0.78;
                    }
                    break;
                case "air_combo_finisher":
                    weight *= context && context.airborne ? 1.38 : 0.28;
                    if (distance < 132 || targetRecovering) {
                        weight *= 1.18;
                    }
                    if (targetAirborne) {
                        weight *= 1.08;
                    }
                    break;
                default:
                    break;
            }

            return Math.max(0, Math.round(weight * 1000) / 1000);
        }

        pickWeightedEnemyMove(fighter, target, distance, options, context) {
            const aiProfile = this.getEnemyDifficultyProfile();
            const viableOptions = options
                .filter((option) => option)
                .map((option) => ({
                    key: option.key,
                    weight: this.getEnemyMoveWeight(fighter, target, distance, option.key, option.weight, context)
                }))
                .filter((option) => option.weight > 0.01);
            if (!viableOptions.length) {
                return null;
            }

            const filteredOptions = viableOptions.filter((option) => option.key !== fighter.aiLastMoveKey || viableOptions.length === 1);
            const pool = filteredOptions.length ? filteredOptions : viableOptions;
            const sortedPool = pool
                .slice()
                .sort((a, b) => b.weight - a.weight || a.key.localeCompare(b.key));
            const topOption = sortedPool[0];
            const runnerUp = sortedPool[1] || null;
            const playerLow = target.health <= (COMBAT.maxHealth * 0.4);
            const behindOnHealth = fighter.health < target.health;
            let strategicChance = aiProfile.strategicPickChance;

            if (context && context.punish) {
                strategicChance = Math.max(strategicChance, aiProfile.punishPickChance);
            }
            if (context && context.finisher) {
                strategicChance = Math.max(strategicChance, aiProfile.finisherPickChance);
            }
            if (context && context.preferPower) {
                strategicChance += 0.12;
            }
            if (behindOnHealth) {
                strategicChance += 0.08;
            }
            if (playerLow) {
                strategicChance += 0.12;
            }
            if (topOption && this.isEnemyPowerMove(topOption.key)) {
                strategicChance += 0.08;
            }
            if (runnerUp && topOption.weight >= (runnerUp.weight * 1.25)) {
                strategicChance += 0.08;
            }

            strategicChance = Phaser.Math.Clamp(strategicChance, 0.24, 0.9);
            const topOptionClearlyBest = !runnerUp || topOption.weight >= (runnerUp.weight * 1.1);
            const shouldForceBestMove = topOption &&
                topOptionClearlyBest &&
                (context && (context.punish || context.finisher || context.preferPower || context.mustUseBest)) &&
                (this.isEnemyPowerMove(topOption.key) || aiProfile.key === "boss") &&
                Phaser.Math.FloatBetween(0, 1) < aiProfile.forceBestMoveChance;

            if (shouldForceBestMove) {
                return topOption.key;
            }

            if (topOption && Phaser.Math.FloatBetween(0, 1) < strategicChance) {
                return topOption.key;
            }

            const shortlist = sortedPool.slice(0, Math.min(sortedPool.length, context && context.preferPower ? 2 : 3));
            const shortlistTotal = shortlist.reduce((sum, option) => sum + option.weight, 0);
            if (shortlistTotal > 0) {
                let shortlistRoll = Phaser.Math.FloatBetween(0, shortlistTotal);
                for (let index = 0; index < shortlist.length; index += 1) {
                    shortlistRoll -= shortlist[index].weight;
                    if (shortlistRoll <= 0) {
                        return shortlist[index].key;
                    }
                }
            }

            const totalWeight = pool.reduce((sum, option) => sum + option.weight, 0);
            let roll = Phaser.Math.FloatBetween(0, totalWeight);

            for (let index = 0; index < pool.length; index += 1) {
                roll -= pool[index].weight;
                if (roll <= 0) {
                    return pool[index].key;
                }
            }

            return pool[pool.length - 1].key;
        }

        pickEnemyPunishMove(fighter, target, distance) {
            const aiProfile = this.getEnemyDifficultyProfile();
            const targetAirborne = !this.isGrounded(target);
            const finisherWindow = target.health <= (COMBAT.maxHealth * 0.4);
            if (targetAirborne && distance < 150) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "upward_slash", weight: 7 },
                    { key: "energy_slash", weight: distance > 118 ? 4 : 0 },
                    { key: "air_combo_finisher", weight: distance < 128 ? 5 : 0 }
                ], { punish: true, preferPower: true, finisher: finisherWindow });
            }

            if (distance < 124 && (target.state === "charge" || target.state === "focus")) {
                return "super_slash";
            }

            if (distance < 90 &&
                target.state === "block" &&
                (aiProfile.key === "boss" || fighter.health <= target.health || finisherWindow)) {
                return "super_slash";
            }

            if (target.state === "charge" || target.state === "focus") {
                if (distance < 124) {
                    return this.pickWeightedEnemyMove(fighter, target, distance, [
                        { key: "super_slash", weight: 8 },
                        { key: "omni_slash_combo", weight: 3 },
                        { key: "triple_slash_combo", weight: 2 }
                    ], { punish: true, preferPower: true, finisher: true });
                }
                if (distance < 176) {
                    return this.pickWeightedEnemyMove(fighter, target, distance, [
                        { key: "iaido_slash", weight: 6 },
                        { key: "dash_slash", weight: 3 },
                        { key: "super_slash", weight: 3 },
                        { key: "teleport_slash", weight: 4 }
                    ], { punish: true, preferPower: true, finisher: finisherWindow });
                }
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "teleport_slash", weight: distance < 228 ? 7 : 5 },
                    { key: "blink_step", weight: distance >= 200 ? 6 : 3 },
                    { key: "energy_slash", weight: 4 },
                    { key: "charged_strike", weight: distance < 238 ? 4 : 0 }
                ], { punish: true, preferPower: true, finisher: finisherWindow });
            }

            if (distance < 86) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "super_slash", weight: target.state === "block" ? 7 : 7 },
                    { key: "quick_slash", weight: target.state === "block" ? 1 : 4 },
                    { key: "omni_slash_combo", weight: target.state === "block" ? 8 : 4 },
                    { key: "spin_attack", weight: target.state === "block" ? 3 : 3 },
                    { key: "triple_slash_combo", weight: 5 },
                    { key: "iaido_slash", weight: 4 }
                ], { punish: true, preferPower: true, finisher: finisherWindow });
            }

            if (distance < 146) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "dash_slash", weight: 3 },
                    { key: "iaido_slash", weight: 5 },
                    { key: "omni_slash_combo", weight: 3 },
                    { key: "super_slash", weight: finisherWindow ? 6 : 3 },
                    { key: "energy_slash", weight: target.state === "block" ? 4 : 2 },
                    { key: "teleport_slash", weight: 4 }
                ], { punish: true, preferPower: true, finisher: finisherWindow });
            }

            if (distance < 214) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "iaido_slash", weight: 6 },
                    { key: "teleport_slash", weight: 5 },
                    { key: "energy_slash", weight: 4 },
                    { key: "blink_step", weight: 2 },
                    { key: "charged_strike", weight: 4 }
                ], { punish: true, preferPower: true, finisher: finisherWindow });
            }

            return this.pickWeightedEnemyMove(fighter, target, distance, [
                { key: "blink_step", weight: 5 },
                { key: "teleport_slash", weight: 6 },
                { key: "energy_slash", weight: 5 },
                { key: "charged_strike", weight: 4 }
            ], { punish: true, preferPower: true, finisher: finisherWindow });
        }

        getEnemyPreferredRange(fighter, target) {
            const aiProfile = this.getEnemyDifficultyProfile();
            if (target.state === "charge" || target.state === "focus") {
                return 120;
            }

            if (fighter.health <= (COMBAT.maxHealth * 0.34) && fighter.health < target.health) {
                return 156;
            }

            if (!this.isGrounded(target)) {
                return 128;
            }

            return aiProfile.pressureRange;
        }

        pickEnemyMove(fighter, target, distance) {
            const aiProfile = this.getEnemyDifficultyProfile();
            const targetAirborne = !this.isGrounded(target);
            const targetDefending = target.state === "block" || target.state === "parry";
            const targetCommitted = target.state === "charge" || target.state === "focus";
            const behindOnHealth = fighter.health < target.health;
            const finisherWindow = target.health <= (COMBAT.maxHealth * 0.42);
            const closeScramble = distance < Math.min(aiProfile.closeRange, 96) && !targetDefending && !targetCommitted;

            if (targetCommitted) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "quick_slash", weight: distance < 98 ? 3 : 0 },
                    { key: "triple_slash_combo", weight: distance < 126 ? 5 : 0 },
                    { key: "omni_slash_combo", weight: distance < 118 ? 4 : 0 },
                    { key: "super_slash", weight: distance < 128 ? 6 : 0 },
                    { key: "dash_slash", weight: distance >= 102 && distance < 190 ? 3 : 0 },
                    { key: "iaido_slash", weight: distance >= 98 && distance < 188 ? 6 : 0 },
                    { key: "energy_slash", weight: distance >= 134 ? 4 : 0 },
                    { key: "teleport_slash", weight: distance >= 160 ? 5 : 0 },
                    { key: "blink_step", weight: distance >= 188 ? 3 : 0 },
                    { key: "charged_strike", weight: distance >= 124 && distance < 226 ? 4 : 0 }
                ], { punish: true, preferPower: true, finisher: finisherWindow });
            }

            if (closeScramble) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "quick_slash", weight: 6 },
                    { key: "triple_slash_combo", weight: 6 },
                    { key: "spin_attack", weight: 3 },
                    { key: "super_slash", weight: 5 },
                    { key: "iaido_slash", weight: 4 },
                    { key: "omni_slash_combo", weight: 3 }
                ], { finisher: finisherWindow });
            }

            if (targetAirborne && distance < 160) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "upward_slash", weight: 6 },
                    { key: "dash_slash", weight: distance >= 92 && distance < 148 ? 3 : 0 },
                    { key: "omni_slash_combo", weight: distance < 110 ? 1 : 0 },
                    { key: "energy_slash", weight: distance > 118 ? 3 : 0 },
                    { key: "blink_step", weight: distance >= 146 ? 2 : 0 },
                    { key: "air_combo_finisher", weight: distance < 126 ? 5 : 0 }
                ], { preferPower: true, finisher: finisherWindow });
            }

            if (distance < aiProfile.closeRange) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "quick_slash", weight: 4 },
                    { key: "triple_slash_combo", weight: 6 },
                    { key: "spin_attack", weight: targetDefending ? 4 : 3 },
                    { key: "dash_slash", weight: distance > 84 ? 2 : 0 },
                    { key: "omni_slash_combo", weight: targetDefending ? 4 : 3 },
                    { key: "super_slash", weight: targetDefending ? 4 : 6 },
                    { key: "iaido_slash", weight: 4 },
                    { key: "upward_slash", weight: targetAirborne ? 6 : 2 }
                ], { preferPower: targetDefending || behindOnHealth || finisherWindow, finisher: finisherWindow });
            }

            if (distance < aiProfile.midRange) {
                return this.pickWeightedEnemyMove(fighter, target, distance, [
                    { key: "dash_slash", weight: 3 },
                    { key: "triple_slash_combo", weight: distance < 138 ? 4 : 0 },
                    { key: "iaido_slash", weight: 6 },
                    { key: "teleport_slash", weight: 5 },
                    { key: "omni_slash_combo", weight: 2 },
                    { key: "energy_slash", weight: targetDefending ? 5 : 4 },
                    { key: "super_slash", weight: targetDefending ? 4 : 3 },
                    { key: "charged_strike", weight: behindOnHealth ? 5 : 3 }
                ], { preferPower: true, finisher: finisherWindow });
            }

            return this.pickWeightedEnemyMove(fighter, target, distance, [
                { key: "blink_step", weight: 4 },
                { key: "teleport_slash", weight: 6 },
                { key: "energy_slash", weight: 5 },
                { key: "dash_slash", weight: 2 },
                { key: "iaido_slash", weight: distance < 220 ? 2 : 0 },
                { key: "charged_strike", weight: distance < 250 ? (behindOnHealth ? 5 : 3) : 0 }
            ], { preferPower: true, finisher: finisherWindow });
        }

        canDefend(fighter, time) {
            return !fighter.dead &&
                this.isGrounded(fighter) &&
                fighter.state !== "attack" &&
                fighter.state !== "charge" &&
                fighter.state !== "focus" &&
                fighter.state !== "hit" &&
                fighter.state !== "down" &&
                time >= fighter.blockStunUntil;
        }

        canMove(fighter, time) {
            return !fighter.dead &&
                fighter.state !== "attack" &&
                fighter.state !== "charge" &&
                fighter.state !== "focus" &&
                fighter.state !== "parry" &&
                fighter.state !== "hit" &&
                fighter.state !== "down" &&
                fighter.state !== "dead" &&
                time >= fighter.blockStunUntil;
        }

        canStartMove(fighter, time) {
            return !fighter.dead &&
                fighter.state !== "attack" &&
                fighter.state !== "charge" &&
                fighter.state !== "focus" &&
                fighter.state !== "parry" &&
                fighter.state !== "hit" &&
                fighter.state !== "down" &&
                fighter.state !== "block" &&
                time >= fighter.attackCooldownUntil &&
                time >= fighter.blockStunUntil;
        }

        getMoveIntent() {
            return (this.isControlDown("left") ? -1 : 0) + (this.isControlDown("right") ? 1 : 0);
        }

        clearBufferedInputs(fighter) {
            fighter.lightInput = null;
            fighter.heavyInput = null;
            fighter.energyInput = null;
            if (fighter.state === "focus") {
                fighter.state = this.isGrounded(fighter) ? "idle" : "jump";
            }
        }

        getOpponentDirection(fighter) {
            const opponent = fighter.id === "player" ? this.enemy : this.player;
            if (!opponent) {
                return fighter.facing || 1;
            }

            const deltaX = opponent.body.x - fighter.body.x;
            if (Math.abs(deltaX) < 6) {
                return fighter.facing || 1;
            }

            return deltaX >= 0 ? 1 : -1;
        }

        shouldEnterKnockdown(defender, windowConfig) {
            if (defender.health <= 0) {
                return true;
            }

            if (!windowConfig || !windowConfig.forceKnockdown) {
                return false;
            }

            if (windowConfig.forceKnockdown === "both") {
                return true;
            }

            return defender.id !== "player";
        }

        handlePlayerHeavyInput(fighter, time, grounded) {
            if (this.isControlJustPressed("power")) {
                fighter.lightInput = null;
                if (!this.canStartMove(fighter, time)) {
                    return false;
                }

                if (!grounded) {
                    this.clearBufferedInputs(fighter);
                    this.startMove(fighter, time, "air_combo_finisher");
                    return true;
                }

                fighter.heavyInput = { startedAt: time };
                return true;
            }

            if (!fighter.heavyInput) {
                return false;
            }

            if (!grounded || fighter.dead || fighter.state === "hit" || fighter.state === "down") {
                fighter.heavyInput = null;
                return false;
            }

            const heldMs = time - fighter.heavyInput.startedAt;
            if (this.isControlDown("power")) {
                if (heldMs >= INPUT.heavyHoldMs && this.canStartMove(fighter, time)) {
                    fighter.heavyInput = null;
                    this.startMove(fighter, time, "charged_strike");
                    return true;
                }
                return true;
            }

            fighter.heavyInput = null;
            if (heldMs < INPUT.heavyHoldMs && this.canStartMove(fighter, time)) {
                this.startMove(fighter, time, "spin_attack");
                return true;
            }

            return false;
        }

        handlePlayerEnergyInput(fighter, time, grounded) {
            if (this.isControlJustPressed("special")) {
                fighter.lightInput = null;
                if (!grounded || !this.canStartMove(fighter, time)) {
                    return false;
                }

                fighter.energyInput = {
                    startedAt: time,
                    focusStarted: false,
                    energyReadyShown: false,
                    teleportReadyShown: false
                };
                return true;
            }

            const energyInput = fighter.energyInput;
            if (!energyInput) {
                return false;
            }

            if (!grounded || fighter.dead || fighter.state === "hit" || fighter.state === "down") {
                fighter.energyInput = null;
                if (fighter.state === "focus") {
                    fighter.state = this.isGrounded(fighter) ? "idle" : "jump";
                }
                return false;
            }

            const heldMs = time - energyInput.startedAt;
            if (!energyInput.focusStarted && this.isControlDown("special") && heldMs >= INPUT.energyChargeMs) {
                energyInput.focusStarted = true;
                fighter.state = "focus";
                fighter.body.body.setAccelerationX(0);
                fighter.body.body.setVelocityX(0);
                this.showMoveText("Energy Charge", 0x8af8ff);
            }

            if (energyInput.focusStarted) {
                fighter.body.body.setAccelerationX(0);
                fighter.body.body.setVelocityX(0);
                if (!energyInput.energyReadyShown) {
                    energyInput.energyReadyShown = true;
                    this.showMoveText("Energy Slash Ready", MOVE_DEFS.energy_slash.tint);
                }
                if (!energyInput.teleportReadyShown && heldMs >= INPUT.energyReleaseMidMs) {
                    energyInput.teleportReadyShown = true;
                    this.showMoveText("Teleport Slash Ready", MOVE_DEFS.teleport_slash.tint);
                }
            }

            if (this.isControlDown("special") && heldMs < INPUT.energyReleaseMaxMs) {
                return true;
            }

            fighter.energyInput = null;
            if (fighter.state === "focus") {
                fighter.state = this.isGrounded(fighter) ? "idle" : "jump";
            }

            const moveKey = heldMs < INPUT.energyChargeMs
                ? "quick_slash"
                : (heldMs < INPUT.energyReleaseMidMs ? "energy_slash" : "teleport_slash");

            this.startMove(fighter, time, moveKey);
            return true;
        }

        startBlock(fighter, time) {
            const wasBlocking = fighter.state === "block";
            this.clearBufferedInputs(fighter);
            fighter.state = "block";
            fighter.blockStunUntil = Math.max(fighter.blockStunUntil, time + 40);
            fighter.body.body.setVelocityX(0);
            fighter.body.body.setAccelerationX(0);
            if (this.app && !wasBlocking) {
                this.app.recordGuard(fighter.id);
            }
        }

        startParry(fighter, time, holdAfter) {
            this.clearBufferedInputs(fighter);
            fighter.state = "parry";
            fighter.parrySession = {
                activeUntil: time + COMBAT.parryActiveMs,
                endAt: time + COMBAT.parryEndMs,
                holdAfter
            };
            fighter.body.body.setVelocityX(0);
            fighter.body.body.setAccelerationX(0);
            if (fighter.id === "enemy" && holdAfter) {
                fighter.aiGuardHoldUntil = time + 320;
            }
            if (this.app) {
                this.app.recordParry(fighter.id);
            }
            this.spawnQueuePulse(fighter, 0xdffcff, 0.16);
        }

        startCharge(fighter, time, aiReleaseDelay) {
            fighter.state = "charge";
            fighter.chargeSession = {
                moveKey: "charged_strike",
                startedAt: time,
                minReadyAt: time + MOVE_DEFS.charged_strike.chargeMinMs,
                autoReleaseAt: time + MOVE_DEFS.charged_strike.chargeMaxMs,
                releaseAt: fighter.id === "enemy" ? (time + (aiReleaseDelay || Phaser.Math.Between(420, 620))) : Number.POSITIVE_INFINITY
            };
            fighter.body.body.setVelocityX(0);
            fighter.body.body.setAccelerationX(0);
            if (fighter.id === "player") {
                this.showMoveText("Charging Strike", MOVE_DEFS.charged_strike.tint);
            }
        }

        releaseChargeStrike(fighter, time) {
            fighter.chargeSession = null;
            this.startMove(fighter, time, "charged_strike");
        }

        startMove(fighter, time, moveKey, chained, moveContext) {
            const move = MOVE_DEFS[moveKey];
            const context = moveContext || {};
            this.clearBufferedInputs(fighter);
            fighter.facing = this.getOpponentDirection(fighter);
            fighter.state = "attack";
            if (fighter.id === "enemy") {
                fighter.aiLastMoveKey = moveKey;
                fighter.aiRecentMoves = [moveKey].concat(fighter.aiRecentMoves || []).slice(0, 5);
            }
            fighter.moveSession = {
                moveKey,
                move,
                startedAt: time,
                queuedNextKey: null,
                resolvedWindows: new Set(),
                triggeredWindows: new Set(),
                projectileSpawned: false,
                vanished: false,
                teleported: false,
                shockSpawned: false,
                edgeDirection: context.edgeDirection || fighter.facing
            };
            fighter.hitbox.active = false;
            fighter.hitbox.windowIndex = -1;
            fighter.body.body.setAccelerationX(0);
            if (move.lunge) {
                fighter.body.body.setVelocityX(fighter.facing * move.lunge);
            }
            this.playIfChanged(fighter, move.animation);
            this.spawnQueuePulse(fighter, move.tint, chained ? 0.26 : 0.18);
            if (fighter.id === "player") {
                this.showMoveText(move.label, move.tint);
            }
            if (this.app) {
                this.app.recordMoveUsage(fighter.id, moveKey);
            }
        }

        tryQueueMove(fighter, time, inputType) {
            const session = fighter.moveSession;
            if (!session || !session.move.chain || session.queuedNextKey) {
                return false;
            }

            const chain = session.move.chain;
            const elapsed = time - session.startedAt;
            if (inputType === chain.input && elapsed <= chain.end) {
                session.queuedNextKey = chain.next;
                this.showMoveText(`Chain: ${MOVE_DEFS[chain.next].label}`, MOVE_DEFS[chain.next].tint);
                this.spawnQueuePulse(fighter, MOVE_DEFS[chain.next].tint, 0.22);
                return true;
            }

            return false;
        }

        cancelAction(fighter) {
            this.clearBufferedInputs(fighter);
            fighter.moveSession = null;
            fighter.chargeSession = null;
            fighter.parrySession = null;
            fighter.hitbox.active = false;
            fighter.hitbox.windowIndex = -1;
            fighter.sprite.setAlpha(1);
        }

        updateMoveState(fighter, time) {
            const bodyX = fighter.body.x;
            const bodyY = fighter.body.y;
            fighter.hurtboxRect.setTo(bodyX - (BODY_SIZE.width / 2), bodyY - (BODY_SIZE.height / 2), BODY_SIZE.width, BODY_SIZE.height);
            fighter.hitbox.active = false;
            fighter.hitbox.windowIndex = -1;

            const session = fighter.moveSession;
            if (!session) {
                return;
            }

            const move = session.move;
            const elapsed = time - session.startedAt;

            if (move.dive && elapsed >= move.dive.startAt && !session.diveStarted) {
                session.diveStarted = true;
                fighter.body.body.setVelocityY(move.dive.velocityY);
            }

            if (move.dive && move.dive.shockOnLand && !session.shockSpawned && this.isGrounded(fighter) && elapsed > move.dive.startAt) {
                session.shockSpawned = true;
                this.spawnLandingRing(fighter, move.tint, false);
            }

            if (move.teleport) {
                if (!session.vanished && elapsed >= move.teleport.vanishAt) {
                    session.vanished = true;
                    fighter.sprite.setAlpha(0.1);
                    this.spawnTeleportBurst(fighter.body.x, fighter.body.y - 28, move.tint, false);
                }

                if (!session.teleported && elapsed >= move.teleport.reappearAt) {
                    const target = fighter.id === "player" ? this.enemy : this.player;
                    const placementDirection = move.teleport.side === "front" ? 1 : -1;
                    const newX = Phaser.Math.Clamp(
                        target.body.x + (target.facing * move.teleport.reappearOffset * placementDirection),
                        40,
                        GAME_WIDTH - 40
                    );
                    fighter.body.x = newX;
                    fighter.body.body.reset(newX, fighter.body.y);
                    fighter.facing = target.body.x >= newX ? 1 : -1;
                    fighter.sprite.setAlpha(1);
                    session.teleported = true;
                    this.spawnTeleportBurst(newX, fighter.body.y - 28, move.tint, true);
                }
            }

            if (move.projectile && !session.projectileSpawned && elapsed >= move.projectile.spawnAt) {
                session.projectileSpawned = true;
                this.spawnProjectile(fighter, move);
            }

            move.windows.forEach((windowConfig, windowIndex) => {
                if (elapsed >= windowConfig.start && !session.triggeredWindows.has(windowIndex)) {
                    session.triggeredWindows.add(windowIndex);
                    this.spawnSlashEffect(fighter, windowConfig);
                }
            });

            const activeIndex = move.windows.findIndex((windowConfig, windowIndex) => {
                return elapsed >= windowConfig.start &&
                    elapsed <= windowConfig.end &&
                    !session.resolvedWindows.has(windowIndex);
            });

            if (activeIndex === -1) {
                return;
            }

            const activeWindow = move.windows[activeIndex];
            fighter.hitbox.active = true;
            fighter.hitbox.windowIndex = activeIndex;
            if (activeWindow.box.bothSides) {
                fighter.hitbox.rect.setTo(bodyX - (activeWindow.box.width / 2), bodyY + activeWindow.box.yOffset - (activeWindow.box.height / 2), activeWindow.box.width, activeWindow.box.height);
            } else {
                fighter.hitbox.rect.setTo(bodyX + (fighter.facing * activeWindow.box.forwardOffset) - (activeWindow.box.width / 2), bodyY + activeWindow.box.yOffset - (activeWindow.box.height / 2), activeWindow.box.width, activeWindow.box.height);
            }
        }

        checkMoveCollision(attacker, defender, time) {
            if (!attacker.moveSession || !attacker.hitbox.active || defender.dead || defender.state === "down") {
                return;
            }

            const session = attacker.moveSession;
            const windowIndex = attacker.hitbox.windowIndex;
            if (windowIndex < 0 || session.resolvedWindows.has(windowIndex)) {
                return;
            }

            if (!Phaser.Geom.Intersects.RectangleToRectangle(attacker.hitbox.rect, defender.hurtboxRect)) {
                return;
            }

            const windowConfig = session.move.windows[windowIndex];
            session.resolvedWindows.add(windowIndex);
            attacker.hitbox.active = false;

            const attackDirection = attacker.body.x >= defender.body.x ? 1 : -1;
            const frontFacing = attackDirection === defender.facing;
            const parryActive = defender.parrySession && time <= defender.parrySession.activeUntil;

            if (this.shouldResolveAirClash(attacker, defender)) {
                this.handleAirClash(attacker, defender, time);
                return;
            }

            if (parryActive && frontFacing) {
                this.handleParry(defender, attacker, session.move.tint, time);
                return;
            }

            const blocked = defender.state === "block" && this.isGrounded(defender) && frontFacing;
            const damage = blocked ? windowConfig.blockDamage : windowConfig.damage;
            defender.health = Phaser.Math.Clamp(defender.health - damage, 0, COMBAT.maxHealth);
            if (this.app) {
                this.app.recordImpact(attacker.id, defender.id, damage, blocked);
            }

            if (!blocked) {
                this.cancelAction(defender);
            }

            this.spawnHitImpact(attacker, defender, windowConfig, blocked, session.move.tint);
            this.playClashSound(blocked ? "block" : (defender.health <= 0 ? "finisher" : "hit"));
            this.applyImpactFlash(defender, blocked, session.move.tint, windowConfig.shakeIntensity > 0.005);
            this.cameras.main.shake(windowConfig.shakeDuration, blocked ? windowConfig.shakeIntensity * 0.55 : windowConfig.shakeIntensity);
            this.startHitstop(time, this.getImpactHitstopMs(windowConfig, blocked, defender.health));

            const knockbackX = blocked ? windowConfig.blockKnockbackX : windowConfig.knockbackX;
            defender.body.body.setAccelerationX(0);
            if (!blocked && windowConfig.edgeSnap) {
                this.applyEdgeSnap(defender, session.edgeDirection, windowConfig.knockbackY);
            } else {
                defender.body.body.setVelocityX(attacker.facing * knockbackX);
                defender.body.body.setVelocityY(blocked ? -42 : windowConfig.knockbackY);
            }

            if (blocked) {
                this.startBlock(defender, time);
                defender.blockStunUntil = time + windowConfig.blockStunMs;
                return;
            }

            if (this.shouldEnterKnockdown(defender, windowConfig)) {
                if (defender.health <= 0) {
                    defender.dead = true;
                }
                defender.state = "down";
                defender.downUntil = time + COMBAT.knockdownMs;
                if (defender.dead) {
                    this.finishRound(attacker.id === "player" ? "You Win" : "Game Over");
                }
            } else {
                defender.state = "hit";
                defender.hitStunUntil = time + windowConfig.hitStunMs;
            }
        }

        shouldResolveAirClash(attacker, defender) {
            return Boolean(
                attacker.moveSession &&
                defender.moveSession &&
                attacker.hitbox.active &&
                defender.hitbox.active &&
                attacker.state === "attack" &&
                defender.state === "attack" &&
                (!this.isGrounded(attacker) || !this.isGrounded(defender)) &&
                Phaser.Geom.Intersects.RectangleToRectangle(defender.hitbox.rect, attacker.hurtboxRect)
            );
        }

        handleAirClash(attacker, defender, time) {
            const clashTintA = attacker.moveSession ? attacker.moveSession.move.tint : attacker.accentTint;
            const clashTintB = defender.moveSession ? defender.moveSession.move.tint : defender.accentTint;
            const leftIsAttacker = attacker.body.x <= defender.body.x;
            const attackerPush = leftIsAttacker ? -220 : 220;
            const defenderPush = leftIsAttacker ? 220 : -220;

            this.cancelAction(attacker);
            this.cancelAction(defender);
            attacker.state = "hit";
            defender.state = "hit";
            attacker.hitStunUntil = time + COMBAT.airClashStunMs;
            defender.hitStunUntil = time + COMBAT.airClashStunMs;
            attacker.body.body.setAccelerationX(0);
            defender.body.body.setAccelerationX(0);
            attacker.body.body.setVelocityX(attackerPush);
            attacker.body.body.setVelocityY(-210);
            defender.body.body.setVelocityX(defenderPush);
            defender.body.body.setVelocityY(-210);
            this.spawnAirClashBurst((attacker.body.x + defender.body.x) / 2, ((attacker.body.y + defender.body.y) / 2) - 54, clashTintA, clashTintB);
            this.playClashSound("parry");
            this.cameras.main.shake(150, 0.0048);
            if (attacker.id === "player" || defender.id === "player") {
                this.showMoveText("Air Clash", mixColor(clashTintA, clashTintB, 0.5));
            }
            this.startHitstop(time, COMBAT.hitstopAirClashMs);
        }

        handleParry(defender, attacker, tint, time) {
            const effectTheme = this.getThemeEffects();
            this.cancelAction(attacker);
            attacker.state = "hit";
            attacker.hitStunUntil = time + COMBAT.parryAdvantageMs;
            attacker.body.body.setVelocityX(-attacker.facing * 180);
            attacker.body.body.setVelocityY(-80);
            this.spawnParryBurst(defender.body.x + (defender.facing * 24), defender.body.y - 50, tint);
            this.playClashSound("parry");
            this.flashOverlay.setFillStyle(effectTheme.parryFlash);
            this.flashOverlay.setAlpha(0.12);
            this.tweens.killTweensOf(this.flashOverlay);
            this.tweens.add({
                targets: this.flashOverlay,
                alpha: 0,
                duration: 130,
                ease: "Quad.Out"
            });
            this.cameras.main.shake(110, 0.0032);
            this.startHitstop(time, COMBAT.hitstopParryMs);
        }

        applyEdgeSnap(defender, direction, verticalVelocity) {
            const snapPadding = 44;
            const newX = direction < 0 ? snapPadding : (GAME_WIDTH - snapPadding);
            defender.body.x = newX;
            defender.body.body.reset(newX, defender.body.y);
            defender.body.body.setVelocityY(verticalVelocity);
            defender.body.body.setVelocityX(0);
        }

        spawnProjectile(fighter, move) {
            const data = move.projectile;
            const x = fighter.body.x + (fighter.facing * 90);
            const y = fighter.body.y + data.yOffset;
            const effectTheme = this.getThemeEffects();
            const projectileTint = this.themeMoveTint(data.tint, 0.08);
            const projectileCore = this.themeGlowTint(effectTheme.projectileCore);
            const trail = this.add.graphics().setDepth(17);
            trail.setBlendMode(Phaser.BlendModes.ADD);
            const glow = this.add.ellipse(x, y, data.width, data.height + 8, projectileTint, 0.28).setDepth(18);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            const orb = this.add.ellipse(x, y, data.width * 0.55, data.height * 0.8, projectileCore, 0.96).setDepth(19);
            orb.setBlendMode(Phaser.BlendModes.ADD);

            const projectile = {
                owner: fighter,
                data,
                x,
                y,
                direction: fighter.facing,
                expiresAt: this.time.now + data.lifetimeMs,
                rect: new Phaser.Geom.Rectangle(x - (data.width / 2), y - (data.height / 2), data.width, data.height),
                trail,
                glow,
                orb
            };

            this.projectileLayer.add(trail);
            this.projectileLayer.add(glow);
            this.projectileLayer.add(orb);
            this.projectiles.push(projectile);
        }

        updateProjectiles(time, delta) {
            for (let index = this.projectiles.length - 1; index >= 0; index--) {
                const projectile = this.projectiles[index];
                if (time >= projectile.expiresAt) {
                    this.destroyProjectile(index);
                    continue;
                }

                projectile.x += projectile.direction * projectile.data.speed * (delta / 1000);
                projectile.rect.setTo(projectile.x - (projectile.data.width / 2), projectile.y - (projectile.data.height / 2), projectile.data.width, projectile.data.height);
                projectile.glow.setPosition(projectile.x, projectile.y);
                projectile.orb.setPosition(projectile.x, projectile.y);
                projectile.trail.clear();
                projectile.trail.fillStyle(this.themeMoveTint(projectile.data.tint, 0.08), 0.18);
                projectile.trail.fillEllipse(projectile.x - (projectile.direction * 32), projectile.y, projectile.data.width * 0.9, projectile.data.height * 0.8);
                projectile.trail.lineStyle(4, this.themeGlowTint(projectile.data.glow), 0.45);
                projectile.trail.lineBetween(projectile.x - (projectile.direction * 44), projectile.y, projectile.x + (projectile.direction * 10), projectile.y);

                if (projectile.x < -100 || projectile.x > (GAME_WIDTH + 100)) {
                    this.destroyProjectile(index);
                    continue;
                }

                const defender = projectile.owner.id === "player" ? this.enemy : this.player;
                if (defender.dead || defender.state === "down" || !Phaser.Geom.Intersects.RectangleToRectangle(projectile.rect, defender.hurtboxRect)) {
                    continue;
                }

                const frontFacing = projectile.direction === defender.facing;
                const blocked = defender.state === "block" && this.isGrounded(defender) && frontFacing;
                const damage = blocked ? projectile.data.blockDamage : projectile.data.damage;
                defender.health = Phaser.Math.Clamp(defender.health - damage, 0, COMBAT.maxHealth);
                if (this.app) {
                    this.app.recordImpact(projectile.owner.id, defender.id, damage, blocked);
                }
                this.spawnProjectileImpact(projectile, defender, blocked);
                this.playClashSound(blocked ? "block" : (defender.health <= 0 ? "finisher" : "projectile"));
                this.applyImpactFlash(defender, blocked, projectile.data.tint, false);
                this.cameras.main.shake(projectile.data.shakeDuration, blocked ? projectile.data.shakeIntensity * 0.55 : projectile.data.shakeIntensity);
                this.startHitstop(time, this.getProjectileHitstopMs(projectile.data, blocked, defender.health));

                defender.body.body.setAccelerationX(0);
                defender.body.body.setVelocityX(projectile.direction * (blocked ? projectile.data.blockKnockbackX : projectile.data.knockbackX));
                defender.body.body.setVelocityY(blocked ? -36 : projectile.data.knockbackY);

                if (blocked) {
                    this.startBlock(defender, time);
                    defender.blockStunUntil = time + projectile.data.blockStunMs;
                } else if (defender.health <= 0) {
                    defender.dead = true;
                    defender.state = "down";
                    defender.downUntil = time + COMBAT.knockdownMs;
                    this.finishRound(projectile.owner.id === "player" ? "You Win" : "Game Over");
                } else {
                    this.cancelAction(defender);
                    defender.state = "hit";
                    defender.hitStunUntil = time + projectile.data.hitStunMs;
                }

                this.destroyProjectile(index);
            }
        }

        destroyProjectile(index) {
            const projectile = this.projectiles[index];
            if (!projectile) {
                return;
            }
            projectile.trail.destroy();
            projectile.glow.destroy();
            projectile.orb.destroy();
            this.projectiles.splice(index, 1);
        }

        applyImpactFlash(fighter, blocked, tint, heavy) {
            const effectTheme = this.getThemeEffects();
            if (fighter.flashTimer) {
                fighter.flashTimer.remove(false);
                fighter.flashTimer = null;
            }

            fighter.sprite.setTintFill(blocked ? effectTheme.blockSpriteFlash : effectTheme.spriteFlash);
            this.flashOverlay.setFillStyle(blocked ? effectTheme.blockOverlay : this.themeMoveTint(tint, heavy ? 0.12 : 0.04));
            this.flashOverlay.setAlpha(blocked ? 0.055 : (heavy ? 0.12 : 0.09));
            this.tweens.killTweensOf(this.flashOverlay);
            this.tweens.add({
                targets: this.flashOverlay,
                alpha: 0,
                duration: heavy ? 150 : (blocked ? 90 : 130),
                ease: "Quad.Out"
            });

            fighter.flashTimer = this.time.delayedCall(90, () => {
                if (fighter.baseTint !== null) {
                    fighter.sprite.setTint(fighter.baseTint);
                } else {
                    fighter.sprite.clearTint();
                }
                fighter.flashTimer = null;
            });
        }

        spawnSlashEffect(fighter, windowConfig) {
            const slashEntries = windowConfig.slashes || (windowConfig.slash ? [windowConfig.slash] : []);
            slashEntries.forEach((slash) => {
                const slashKind = slash.kind || "arc";
                const x = slashKind === "line"
                    ? fighter.body.x
                    : fighter.body.x + (fighter.facing * (slash.centerOffsetX || 0));
                const y = slashKind === "line"
                    ? fighter.body.y
                    : fighter.body.y + (slash.centerOffsetY || 0);
                const slashTint = this.themeMoveTint(slash.tint, 0.12);
                const slashGlow = this.themeGlowTint(slash.glow);
                const graphics = this.add.graphics({ x, y }).setDepth(15);
                graphics.setBlendMode(Phaser.BlendModes.ADD);

                if (slashKind === "line") {
                    const startPoint = new Phaser.Math.Vector2(fighter.facing * slash.startOffsetX, slash.startOffsetY);
                    const endPoint = new Phaser.Math.Vector2(fighter.facing * slash.endOffsetX, slash.endOffsetY);
                    const ribbon = buildLineRibbon(
                        startPoint,
                        endPoint,
                        slash.thickness,
                        slash.endThickness || Math.max(8, slash.thickness * 0.5)
                    );

                    graphics.fillStyle(slashTint, 0.14);
                    graphics.fillPoints(ribbon, true, true);
                    graphics.lineStyle(slash.thickness, slashTint, 0.16);
                    graphics.lineBetween(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
                    graphics.lineStyle(Math.max(4, slash.thickness * 0.42), slashGlow, 0.84);
                    graphics.lineBetween(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
                    graphics.fillStyle(slashGlow, 0.18);
                    graphics.fillCircle(endPoint.x, endPoint.y, Math.max(8, slash.thickness * 0.3));
                } else {
                    const outerPoints = buildArcPoints(slash.radius + (slash.thickness * 0.3), slash.startAngle, slash.endAngle, fighter.facing, 12);
                    const innerPoints = buildArcPoints(Math.max(10, slash.radius - (slash.thickness * 0.35)), slash.startAngle, slash.endAngle, fighter.facing, 12).reverse();
                    const ribbon = outerPoints.concat(innerPoints);
                    const corePoints = buildArcPoints(slash.radius, slash.startAngle, slash.endAngle, fighter.facing, 12);

                    graphics.fillStyle(slashTint, 0.12);
                    graphics.fillPoints(ribbon, true, true);
                    graphics.lineStyle(slash.thickness, slashTint, 0.14);
                    graphics.strokePoints(corePoints, false, false);
                    graphics.lineStyle(Math.max(4, slash.thickness * 0.42), slashGlow, 0.8);
                    graphics.strokePoints(corePoints, false, false);
                }

                this.slashLayer.add(graphics);

                this.tweens.add({
                    targets: graphics,
                    alpha: 0,
                    scaleX: slashKind === "line" ? 1.12 : 1.16,
                    scaleY: slashKind === "line" ? 1.04 : 1.1,
                    duration: slash.durationMs,
                    ease: "Cubic.Out",
                    onComplete: () => graphics.destroy()
                });
            });
        }

        spawnHitImpact(attacker, defender, windowConfig, blocked, tint) {
            const effectTheme = this.getThemeEffects();
            const impactTint = this.themeMoveTint(tint, blocked ? 0.08 : 0.16);
            const impactCore = this.themeGlowTint(effectTheme.impactCore);
            const x = defender.body.x + (attacker.facing * 12);
            const y = defender.body.y - 34;
            const graphics = this.add.graphics({ x, y }).setDepth(23);
            const burstRadius = blocked ? 24 : 38;
            graphics.setBlendMode(Phaser.BlendModes.ADD);
            graphics.fillStyle(impactCore, blocked ? 0.28 : 0.42);
            graphics.fillCircle(0, 0, blocked ? 14 : 20);
            graphics.fillStyle(blocked ? effectTheme.blockedImpact : impactTint, blocked ? 0.18 : 0.24);
            graphics.fillCircle(0, 0, burstRadius);

            for (let index = 0; index < 7; index++) {
                const angle = Phaser.Math.DegToRad((-38 + (index * 16)) * attacker.facing);
                const startX = Math.cos(angle) * 8;
                const startY = Math.sin(angle) * 8;
                const endX = Math.cos(angle) * (blocked ? 26 : 42);
                const endY = Math.sin(angle) * (blocked ? 26 : 42);
                graphics.lineStyle(index % 2 === 0 ? 3 : 2, index % 2 === 0 ? impactCore : (blocked ? effectTheme.blockedImpact : impactTint), blocked ? 0.5 : 0.7);
                graphics.lineBetween(startX, startY, endX, endY);
            }

            this.impactLayer.add(graphics);
            this.tweens.add({
                targets: graphics,
                alpha: 0,
                scaleX: 1.28,
                scaleY: 1.28,
                duration: blocked ? 130 : 170,
                ease: "Quad.Out",
                onComplete: () => graphics.destroy()
            });
        }

        spawnProjectileImpact(projectile, defender, blocked) {
            const effectTheme = this.getThemeEffects();
            const projectileTint = this.themeMoveTint(projectile.data.tint, 0.12);
            const graphics = this.add.graphics({ x: projectile.x, y: projectile.y }).setDepth(23);
            graphics.setBlendMode(Phaser.BlendModes.ADD);
            graphics.fillStyle(this.themeGlowTint(effectTheme.projectileCore), blocked ? 0.26 : 0.36);
            graphics.fillCircle(0, 0, blocked ? 14 : 20);
            graphics.fillStyle(projectileTint, blocked ? 0.18 : 0.22);
            graphics.fillCircle(0, 0, blocked ? 26 : 36);
            graphics.lineStyle(4, blocked ? effectTheme.projectileBlockLine : this.themeGlowTint(projectile.data.glow), 0.7);
            graphics.lineBetween(-28, 0, 28, 0);
            graphics.lineBetween(0, -16, 0, 16);
            this.impactLayer.add(graphics);
            this.tweens.add({
                targets: graphics,
                alpha: 0,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 160,
                ease: "Quad.Out",
                onComplete: () => graphics.destroy()
            });
        }

        spawnParryBurst(x, y, tint) {
            const effectTheme = this.getThemeEffects();
            const graphics = this.add.graphics({ x, y }).setDepth(24);
            graphics.setBlendMode(Phaser.BlendModes.ADD);
            graphics.fillStyle(this.themeGlowTint(effectTheme.parryFlash), 0.46);
            graphics.fillCircle(0, 0, 22);
            graphics.fillStyle(this.themeMoveTint(tint, 0.16), 0.22);
            graphics.fillCircle(0, 0, 42);

            for (let index = 0; index < 8; index++) {
                const angle = Phaser.Math.DegToRad(index * 45);
                graphics.lineStyle(3, this.themeGlowTint(effectTheme.parryLine), 0.75);
                graphics.lineBetween(Math.cos(angle) * 8, Math.sin(angle) * 8, Math.cos(angle) * 44, Math.sin(angle) * 44);
            }

            this.impactLayer.add(graphics);
            this.tweens.add({
                targets: graphics,
                alpha: 0,
                scaleX: 1.32,
                scaleY: 1.32,
                duration: 170,
                ease: "Quad.Out",
                onComplete: () => graphics.destroy()
            });
        }

        spawnAirClashBurst(x, y, tintA, tintB) {
            const effectTheme = this.getThemeEffects();
            const graphics = this.add.graphics({ x, y }).setDepth(24);
            graphics.setBlendMode(Phaser.BlendModes.ADD);
            graphics.fillStyle(this.themeGlowTint(effectTheme.parryFlash), 0.52);
            graphics.fillCircle(0, 0, 24);
            graphics.fillStyle(this.themeMoveTint(mixColor(tintA, tintB, 0.5), 0.18), 0.24);
            graphics.fillCircle(0, 0, 46);

            for (let index = 0; index < 10; index++) {
                const angle = Phaser.Math.DegToRad(index * 36);
                const primaryTint = index % 2 === 0 ? tintA : tintB;
                graphics.lineStyle(index % 2 === 0 ? 4 : 3, this.themeGlowTint(primaryTint), 0.78);
                graphics.lineBetween(Math.cos(angle) * 8, Math.sin(angle) * 8, Math.cos(angle) * 52, Math.sin(angle) * 52);
            }

            this.impactLayer.add(graphics);
            this.tweens.add({
                targets: graphics,
                alpha: 0,
                scaleX: 1.38,
                scaleY: 1.38,
                duration: 180,
                ease: "Quad.Out",
                onComplete: () => graphics.destroy()
            });
        }

        spawnTeleportBurst(x, y, tint, reappear) {
            const effectTheme = this.getThemeEffects();
            const graphics = this.add.graphics({ x, y }).setDepth(20);
            graphics.setBlendMode(Phaser.BlendModes.ADD);
            graphics.fillStyle(this.themeMoveTint(tint, reappear ? 0.18 : 0.12), reappear ? 0.2 : 0.14);
            graphics.fillEllipse(0, 0, reappear ? 74 : 54, reappear ? 54 : 34);
            graphics.lineStyle(reappear ? 4 : 3, this.themeGlowTint(effectTheme.teleportLine), 0.72);
            graphics.lineBetween(-24, -28, 26, 28);
            graphics.lineBetween(24, -28, -26, 28);
            this.impactLayer.add(graphics);
            this.tweens.add({
                targets: graphics,
                alpha: 0,
                scaleX: reappear ? 1.3 : 1.18,
                scaleY: reappear ? 1.3 : 1.18,
                duration: reappear ? 180 : 140,
                ease: "Cubic.Out",
                onComplete: () => graphics.destroy()
            });
        }

        spawnQueuePulse(fighter, tint, alpha) {
            const pulse = this.add.ellipse(fighter.body.x, GROUND_TOP + 7, 134, 18, this.themeMoveTint(tint, 0.12), alpha || 0.2).setDepth(3);
            pulse.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: pulse,
                scaleX: 1.35,
                scaleY: 1.2,
                alpha: 0,
                duration: 180,
                ease: "Quad.Out",
                onComplete: () => pulse.destroy()
            });
        }

        spawnLandingRing(fighter, tint, inverted) {
            const ring = this.add.ellipse(fighter.body.x, GROUND_TOP + 8, inverted ? 54 : 70, inverted ? 12 : 16, this.themeMoveTint(tint, 0.08), inverted ? 0.18 : 0.14).setDepth(3);
            ring.setBlendMode(Phaser.BlendModes.ADD);
            this.tweens.add({
                targets: ring,
                scaleX: inverted ? 1.6 : 1.35,
                scaleY: inverted ? 1.2 : 1.1,
                alpha: 0,
                duration: inverted ? 160 : 180,
                ease: "Quad.Out",
                onComplete: () => ring.destroy()
            });
        }

        showMoveText(text, tint) {
            if (!this.ui || !this.ui.moveText) {
                return;
            }

            this.ui.moveText.setText(text);
            this.ui.moveText.setColor(`#${this.themeMoveTint(tint, 0.1).toString(16).padStart(6, "0")}`);
            this.ui.moveText.setAlpha(1);
            this.ui.moveText.y = 58;
            this.tweens.killTweensOf(this.ui.moveText);
            this.tweens.add({
                targets: this.ui.moveText,
                alpha: 0,
                y: 48,
                duration: 620,
                ease: "Quad.Out"
            });
        }

        spawnCelebrationEmote(fighter, text, tint) {
            if (!this.emoteLayer) {
                return;
            }

            const uiTheme = this.activeSceneTheme ? this.activeSceneTheme.ui : SCENE_THEMES.dark.ui;
            const backgroundColor = `#${this.themeGlowTint(this.activeSceneTheme.ui.overlayFill).toString(16).padStart(6, "0")}`;
            const emote = this.add.text(
                fighter.body.x,
                fighter.body.y - 154,
                text,
                {
                    fontFamily: "Segoe UI, Tahoma, sans-serif",
                    fontSize: "15px",
                    fontStyle: "bold",
                    color: uiTheme.text,
                    backgroundColor
                }
            )
                .setOrigin(0.5)
                .setPadding(12, 7, 12, 7)
                .setDepth(27)
                .setAlpha(0);

            emote.setStroke(`#${tint.toString(16).padStart(6, "0")}`, 2);
            this.emoteLayer.add(emote);

            this.tweens.add({
                targets: emote,
                alpha: 1,
                y: emote.y - 18,
                duration: 120,
                ease: "Quad.Out"
            });

            this.tweens.add({
                targets: emote,
                alpha: 0,
                y: emote.y - 48,
                delay: 420,
                duration: 340,
                ease: "Quad.In",
                onComplete: () => emote.destroy()
            });
        }

        maybeSpawnAfterImage(fighter, time) {
            if (time < fighter.afterImageAt || fighter.sprite.alpha < 0.95) {
                return;
            }

            const speed = Math.abs(fighter.body.body.velocity.x);
            const shouldTrail = fighter.state === "attack" || fighter.state === "run" || (fighter.state === "jump" && speed > (PHYSICS.walkSpeed * 0.7)) || speed > (PHYSICS.walkSpeed * 0.82);
            if (!shouldTrail) {
                return;
            }

            const ghost = this.add.image(fighter.sprite.x, fighter.sprite.y, TEXTURE_KEY, fighter.sprite.frame.name)
                .setOrigin(SPRITE_ORIGIN.x, SPRITE_ORIGIN.y)
                .setScale(SPRITE_SCALE)
                .setFlipX(fighter.facing < 0)
                .setAlpha(fighter.state === "attack" ? 0.26 : 0.16)
                .setDepth(4);

            ghost.setTint(fighter.afterImageTint || fighter.accentTint);
            this.afterImageLayer.add(ghost);
            this.tweens.add({
                targets: ghost,
                alpha: 0,
                x: ghost.x - (fighter.facing * 8),
                duration: fighter.state === "attack" ? 126 : 104,
                ease: "Cubic.Out",
                onComplete: () => ghost.destroy()
            });

            fighter.afterImageAt = time + (fighter.state === "attack" ? 34 : 54);
        }

        updateFighterAnimation(fighter, time) {
            if (fighter.state === "charge" && fighter.chargeSession) {
                this.setFrameIfChanged(fighter, MOVE_DEFS.charged_strike.holdFrameIndex);
                return;
            }

            if (fighter.state === "focus" && fighter.energyInput) {
                this.setFrameIfChanged(fighter, ANIM_FRAMES.iaido_slash[0]);
                return;
            }

            if (fighter.state === "attack" && fighter.moveSession) {
                this.playIfChanged(fighter, fighter.moveSession.move.animation);
                return;
            }

            if (fighter.state === "celebrate") {
                if (!this.isGrounded(fighter)) {
                    this.playIfChanged(fighter, "jump");
                    return;
                }

                switch (fighter.celebrationPose) {
                case "flourish":
                    this.playIfChanged(fighter, "iaido_slash");
                    break;
                case "showoff":
                    this.playIfChanged(fighter, "quick_slash");
                    break;
                case "run":
                    this.playIfChanged(fighter, "run");
                    break;
                default:
                    this.playIfChanged(fighter, "idle");
                    break;
                }
                return;
            }

            switch (fighter.state) {
            case "block":
                this.playIfChanged(fighter, "block");
                break;
            case "parry":
                this.playIfChanged(fighter, "parry");
                break;
            case "hit":
                this.playIfChanged(fighter, "hit_reaction");
                break;
            case "down":
            case "dead":
                this.playIfChanged(fighter, "knockdown");
                break;
            case "jump":
                this.playIfChanged(fighter, "jump");
                break;
            case "run":
                this.playIfChanged(fighter, "run");
                break;
            case "walk":
                this.playIfChanged(fighter, "walk");
                break;
            default:
                this.playIfChanged(fighter, "idle");
                break;
            }
        }

        playIfChanged(fighter, animationKey) {
            if (fighter.currentAnimationKey === animationKey) {
                return;
            }

            fighter.currentAnimationKey = animationKey;
            fighter.sprite.setAlpha(1);
            fighter.sprite.play(animationKey, true);
        }

        setFrameIfChanged(fighter, frameIndex) {
            const key = `frame:${frameIndex}`;
            if (fighter.currentAnimationKey === key) {
                return;
            }

            fighter.currentAnimationKey = key;
            fighter.sprite.stop();
            fighter.sprite.setFrame(this.getFrameRef(frameIndex));
        }

        syncFighterVisual(fighter, time) {
            fighter.sprite.x = fighter.body.x;
            fighter.sprite.y = fighter.body.y + (BODY_SIZE.height / 2);
            fighter.sprite.setFlipX(fighter.facing < 0);

            const footY = fighter.body.y + (BODY_SIZE.height / 2);
            const airHeight = Phaser.Math.Clamp(GROUND_TOP - footY, 0, 240);
            const shadowScale = Phaser.Math.Clamp(1 - (airHeight / 260), 0.45, 1);
            const auraAlpha = fighter.state === "attack" ? 0.16 : (fighter.state === "block" || fighter.state === "parry" ? 0.12 : 0.08);
            const auraWidth = fighter.state === "run" ? 126 : (fighter.state === "attack" ? 138 : 112);

            fighter.shadow.setPosition(fighter.body.x, GROUND_TOP + 8);
            fighter.shadow.setScale(shadowScale, shadowScale);
            fighter.shadow.setAlpha(0.22 * shadowScale);

            fighter.aura.setPosition(fighter.body.x, GROUND_TOP + 7);
            fighter.aura.setScale((auraWidth / 112) * shadowScale, shadowScale);
            fighter.aura.setFillStyle(fighter.accentTint, auraAlpha * shadowScale);
            fighter.aura.setAlpha(auraAlpha * shadowScale);

            this.maybeSpawnAfterImage(fighter, time);

            const grounded = this.isGrounded(fighter);
            if (!fighter.wasGrounded && grounded && fighter.state !== "down" && !fighter.dead) {
                this.spawnLandingRing(fighter, fighter.accentTint, false);
            }
            fighter.wasGrounded = grounded;
        }

        isGrounded(fighter) {
            return fighter.body.body.blocked.down || fighter.body.body.touching.down;
        }

        updateHealthBars() {
            const healthTheme = this.activeSceneTheme ? this.activeSceneTheme.health : SCENE_THEMES.dark.health;
            const playerRatio = this.player ? (this.player.health / COMBAT.maxHealth) : 1;
            const enemyRatio = this.enemy ? (this.enemy.health / COMBAT.maxHealth) : 1;
            const playerColor = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(healthTheme.low),
                Phaser.Display.Color.ValueToColor(healthTheme.playerFull),
                100,
                Math.round(playerRatio * 100)
            );
            const enemyColor = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(healthTheme.low),
                Phaser.Display.Color.ValueToColor(healthTheme.enemyFull),
                100,
                Math.round(enemyRatio * 100)
            );

            this.ui.playerBarFill.displayWidth = 250 * Phaser.Math.Clamp(playerRatio, 0, 1);
            this.ui.enemyBarFill.displayWidth = 250 * Phaser.Math.Clamp(enemyRatio, 0, 1);
            this.ui.playerBarFill.setFillStyle(Phaser.Display.Color.GetColor(playerColor.r, playerColor.g, playerColor.b));
            this.ui.enemyBarFill.setFillStyle(Phaser.Display.Color.GetColor(enemyColor.r, enemyColor.g, enemyColor.b));
            this.ui.playerValue.setText(`${Math.ceil(this.player.health)}`);
            this.ui.enemyValue.setText(`${Math.ceil(this.enemy.health)}`);
        }

        finishRound(resultText) {
            if (this.roundOver) {
                return;
            }

            const winner = resultText === "You Win" ? this.player : this.enemy;
            const loser = winner === this.player ? this.enemy : this.player;
            const now = this.time.now;

            this.roundOver = true;
            this.phase = "celebration";
            this.roundEndSequence = {
                resultText,
                winner,
                loser,
                finishAt: now + CELEBRATION.durationMs,
                nextEmoteAt: now + 200,
                nextPoseAt: now + 160,
                nextHopAt: now + 420,
                emoteIndex: 0,
                poseIndex: 0
            };
            this.cancelAction(this.player);
            this.cancelAction(this.enemy);
            this.player.hitbox.active = false;
            this.enemy.hitbox.active = false;
            this.player.body.body.setAccelerationX(0);
            this.enemy.body.body.setAccelerationX(0);
            this.player.body.body.setVelocityX(0);
            this.enemy.body.body.setVelocityX(0);
            winner.state = "celebrate";
            winner.celebrationPose = "idle";
            winner.currentAnimationKey = null;
            loser.state = loser.dead ? "dead" : "down";
            loser.body.body.setAccelerationX(0);
            loser.body.body.setVelocityX(0);
            this.projectiles.forEach((projectile) => {
                projectile.trail.destroy();
                projectile.glow.destroy();
                projectile.orb.destroy();
            });
            this.projectiles = [];
            if (this.resultPanel) {
                this.resultPanel.setVisible(false);
            }
            this.showMoveText(winner === this.player ? "Victory Sequence" : "Enemy Celebration", winner.accentTint);
            setStatus(`${resultText}. Hold the arena for a moment while the winner celebrates.`, false);
        }

        concludeRoundCelebration() {
            if (!this.roundEndSequence) {
                return;
            }

            const resultText = this.roundEndSequence.resultText;
            this.phase = "roundOver";
            this.roundEndSequence = null;
            if (this.app) {
                this.app.onMatchFinished(resultText);
            } else {
                setStatus(`${resultText}. R restarts the duel.`, false);
            }
        }
    }

    function createGame(assetMode, appController) {
        return new Phaser.Game({
            type: Phaser.AUTO,
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            parent: "game-shell",
            backgroundColor: appController.getSceneTheme().cameraBackgroundCss,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: PHYSICS.gravityY },
                    debug: false
                }
            },
            scene: [new FightScene(assetMode, appController)]
        });
    }

    if (!window.Phaser) {
        setStatus("Phaser failed to load. Check the CDN or local vendor bundle.", true);
        return;
    }

    setStatus("Checking fighter asset format...", false);
    detectAssetMode()
        .then((assetMode) => {
            const app = new AppController(assetMode);
            window.__shadowFightApp = app;
            app.init();
        })
        .catch(() => {
            const app = new AppController("grid");
            window.__shadowFightApp = app;
            app.init();
        });
})();
