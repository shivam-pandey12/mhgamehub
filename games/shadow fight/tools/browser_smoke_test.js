"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const browserPath = process.argv[2];
const targetUrl = process.argv[3];
const outputDir = process.argv[4] || path.join(process.cwd(), "artifacts", "browser-smoke");
const debugPort = Number(process.argv[5] || 9222);

if (!browserPath || !targetUrl) {
    console.error("Usage: node tools/browser_smoke_test.js <browserPath> <url> [outputDir] [debugPort]");
    process.exit(1);
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${url}`);
    }
    return response.json();
}

async function waitFor(fn, description, timeoutMs = 15000, intervalMs = 100) {
    const startedAt = Date.now();
    let lastError = null;
    while ((Date.now() - startedAt) < timeoutMs) {
        try {
            const value = await fn();
            if (value) {
                return value;
            }
        } catch (error) {
            lastError = error;
        }
        await delay(intervalMs);
    }
    if (lastError) {
        throw new Error(`${description}: ${lastError.message}`);
    }
    throw new Error(`${description}: timed out after ${timeoutMs}ms`);
}

async function main() {
    fs.mkdirSync(outputDir, { recursive: true });
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "shadow-fight-smoke-"));
    const browserArgs = [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--allow-file-access-from-files",
        `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${userDataDir}`,
        "--window-size=1280,900",
        targetUrl
    ];

    const browser = spawn(browserPath, browserArgs, {
        stdio: ["ignore", "ignore", "pipe"]
    });

    let browserClosed = false;
    browser.on("exit", () => {
        browserClosed = true;
    });

    const stderrChunks = [];
    browser.stderr.on("data", (chunk) => {
        stderrChunks.push(String(chunk));
    });

    let ws;
    try {
        const target = await waitFor(async () => {
            const list = await fetchJson(`http://127.0.0.1:${debugPort}/json/list`);
            return list.find((entry) => entry.type === "page" && entry.url.startsWith(targetUrl));
        }, "browser target ready", 15000, 150);

        ws = new WebSocket(target.webSocketDebuggerUrl);

        await new Promise((resolve, reject) => {
            ws.addEventListener("open", resolve, { once: true });
            ws.addEventListener("error", reject, { once: true });
        });

        let nextId = 1;
        const pending = new Map();
        ws.addEventListener("message", (event) => {
            const payload = JSON.parse(String(event.data));
            if (!payload.id) {
                return;
            }
            const resolver = pending.get(payload.id);
            if (!resolver) {
                return;
            }
            pending.delete(payload.id);
            if (payload.error) {
                resolver.reject(new Error(payload.error.message || "CDP error"));
                return;
            }
            resolver.resolve(payload.result || {});
        });

        const cdp = (method, params) => new Promise((resolve, reject) => {
            const id = nextId++;
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });

        const evaluate = async (expression) => {
            const result = await cdp("Runtime.evaluate", {
                expression,
                awaitPromise: true,
                returnByValue: true
            });
            if (result.exceptionDetails) {
                throw new Error(result.exceptionDetails.text || "Runtime evaluation failed");
            }
            return result.result ? result.result.value : null;
        };

        const keyDown = async (code, key, keyCode) => {
            await cdp("Input.dispatchKeyEvent", {
                type: "rawKeyDown",
                code,
                key,
                windowsVirtualKeyCode: keyCode,
                nativeVirtualKeyCode: keyCode
            });
        };

        const keyUp = async (code, key, keyCode) => {
            await cdp("Input.dispatchKeyEvent", {
                type: "keyUp",
                code,
                key,
                windowsVirtualKeyCode: keyCode,
                nativeVirtualKeyCode: keyCode
            });
        };

        const tapKey = async (code, key, keyCode, holdMs = 40) => {
            await keyDown(code, key, keyCode);
            await delay(holdMs);
            await keyUp(code, key, keyCode);
        };

        const captureScreenshot = async (filename) => {
            const shot = await cdp("Page.captureScreenshot", {
                format: "png",
                fromSurface: true
            });
            fs.writeFileSync(path.join(outputDir, filename), Buffer.from(shot.data, "base64"));
        };

        await cdp("Page.enable");
        await cdp("Runtime.enable");
        await cdp("Page.bringToFront");

        await waitFor(() => evaluate("document.readyState === 'complete'"), "document ready");
        await waitFor(() => evaluate("Boolean(document.getElementById('start-button'))"), "start button ready");
        await waitFor(() => evaluate("(() => { const button = document.getElementById('start-button'); return Boolean(button && !button.disabled); })()"), "start button enabled", 12000, 100);
        await evaluate("document.getElementById('start-button').click(); true;");
        await waitFor(() => evaluate("Boolean(window.__shadowFightApp && window.__shadowFightApp.game)"), "Phaser game created", 15000, 100);
        await waitFor(() => evaluate("(() => { const scene = window.__shadowFightApp && window.__shadowFightApp.scene; return Boolean(scene && scene.player && scene.enemy); })()"), "fight scene ready", 20000, 120);
        await waitFor(() => evaluate("(() => { const scene = window.__shadowFightApp.scene; return scene.phase === 'fight'; })()"), "fight phase", 20000, 120);

        await evaluate(`(() => {
            window.__sfTest = {
                getScene() {
                    return window.__shadowFightApp ? window.__shadowFightApp.scene : null;
                },
                clearHitstop(scene) {
                    scene.hitstopActive = false;
                    scene.hitstopReleaseAt = 0;
                    if (scene.physics && scene.physics.world && scene.physics.world.isPaused) {
                        scene.physics.world.resume();
                    }
                    scene.time.paused = false;
                    scene.anims.resumeAll();
                    scene.tweens.resumeAll();
                },
                resetFighters(options = {}) {
                    const scene = this.getScene();
                    const playerX = options.playerX ?? 260;
                    const enemyX = options.enemyX ?? 540;
                    const playerY = scene.player.body.y;
                    const enemyY = scene.enemy.body.y;
                    const now = scene.time.now;
                    if (scene.projectiles.length) {
                        for (let index = scene.projectiles.length - 1; index >= 0; index -= 1) {
                            scene.destroyProjectile(index);
                        }
                    }
                    this.clearHitstop(scene);
                    scene.roundOver = false;
                    scene.phase = "fight";

                    const resetFighter = (fighter, x, y, facing) => {
                        scene.cancelAction(fighter);
                        fighter.dead = false;
                        fighter.health = 300;
                        fighter.state = "idle";
                        fighter.hitStunUntil = 0;
                        fighter.blockStunUntil = 0;
                        fighter.downUntil = 0;
                        fighter.attackCooldownUntil = 0;
                        fighter.aiNextAttackAt = now + 999999;
                        fighter.aiGuardHoldUntil = 0;
                        fighter.aiQueuedAirMoveAt = 0;
                        fighter.aiQueuedAirMoveKey = null;
                        fighter.aiReactionCooldownUntil = 0;
                        fighter.aiLastReactedMoveStartedAt = -1;
                        fighter.aiLastMoveKey = null;
                        fighter.aiRecentMoves = [];
                        fighter.body.x = x;
                        fighter.body.y = y;
                        fighter.body.body.reset(x, y);
                        fighter.body.body.setAccelerationX(0);
                        fighter.body.body.setVelocityX(0);
                        fighter.body.body.setVelocityY(0);
                        fighter.facing = facing;
                        fighter.sprite.setAlpha(1);
                        fighter.currentAnimationKey = null;
                    };

                    resetFighter(scene.player, playerX, playerY, playerX <= enemyX ? 1 : -1);
                    resetFighter(scene.enemy, enemyX, enemyY, enemyX >= playerX ? -1 : 1);

                    if (options.enemyFrozen) {
                        scene.enemy.state = "hit";
                        scene.enemy.hitStunUntil = now + 60000;
                    }

                    if (options.enemyDown) {
                        scene.enemy.state = "down";
                        scene.enemy.downUntil = now + 60000;
                    }

                    if (options.playerFrozen) {
                        scene.player.state = "hit";
                        scene.player.hitStunUntil = now + 60000;
                    }

                    if (options.touchMode) {
                        scene.app.touchUiEnabled = true;
                        document.body.dataset.touchUi = "true";
                    }

                    scene.updateHealthBars();
                    scene.updateFighterAnimation(scene.player, now);
                    scene.updateFighterAnimation(scene.enemy, now);
                    return {
                        playerX: scene.player.body.x,
                        enemyX: scene.enemy.body.x,
                        playerState: scene.player.state,
                        enemyState: scene.enemy.state
                    };
                },
                sceneState() {
                    const scene = this.getScene();
                    return {
                        phase: scene.phase,
                        assetMode: scene.assetMode,
                        playerHealth: scene.player.health,
                        enemyHealth: scene.enemy.health,
                        playerX: scene.player.body.x,
                        enemyX: scene.enemy.body.x,
                        playerState: scene.player.state,
                        enemyState: scene.enemy.state,
                        playerMove: scene.player.moveSession ? scene.player.moveSession.moveKey : null,
                        enemyMove: scene.enemy.moveSession ? scene.enemy.moveSession.moveKey : null,
                        hitstopActive: scene.hitstopActive,
                        hitstopRemaining: Math.max(0, scene.hitstopReleaseAt - performance.now()),
                        animations: {
                            blink_step: scene.anims.exists("blink_step"),
                            super_slash: scene.anims.exists("super_slash"),
                            omni_slash_combo: scene.anims.exists("omni_slash_combo")
                        }
                    };
                },
                getControlKey(control) {
                    const scene = this.getScene();
                    const mapping = {
                        left: scene.cursors.left,
                        right: scene.cursors.right,
                        up: scene.cursors.up,
                        down: scene.cursors.down,
                        light: scene.keys.light,
                        super: scene.keys.super,
                        blink: scene.keys.blink
                    };
                    return mapping[control] || null;
                },
                pressControl(control) {
                    const key = this.getControlKey(control);
                    if (!key) {
                        return false;
                    }
                    key.onDown({
                        altKey: false,
                        ctrlKey: false,
                        shiftKey: false,
                        metaKey: false,
                        location: 0,
                        timeStamp: performance.now()
                    });
                    return true;
                },
                releaseControl(control) {
                    const key = this.getControlKey(control);
                    if (!key) {
                        return false;
                    }
                    key.onUp({
                        altKey: false,
                        ctrlKey: false,
                        shiftKey: false,
                        metaKey: false,
                        location: 0,
                        timeStamp: performance.now()
                    });
                    return true;
                }
            };
            return true;
        })()`);

        const summary = {
            screenshots: []
        };

        summary.initial = await evaluate("window.__sfTest.sceneState()");
        await captureScreenshot("idle_stance.png");
        summary.screenshots.push(path.join(outputDir, "idle_stance.png"));

        summary.tapA = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ enemyFrozen: true, playerX: 260, enemyX: 620 });
            scene.player.lightInput = { startedAt: scene.time.now - 60 };
            scene.processPlayerOffense(scene.player, scene.time.now, true, 0, false);
            return window.__sfTest.sceneState();
        })()`);

        summary.holdA = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ enemyFrozen: true, playerX: 260, enemyX: 620 });
            scene.player.lightInput = { startedAt: scene.time.now - 180 };
            scene.keys.light.isDown = true;
            scene.processPlayerOffense(scene.player, scene.time.now, true, 0, false);
            scene.keys.light.isDown = false;
            return window.__sfTest.sceneState();
        })()`);

        await evaluate("window.__sfTest.resetFighters({ enemyFrozen: true, playerX: 260, enemyX: 620 });");
        await tapKey("KeyY", "y", 89, 90);
        await waitFor(async () => {
            const state = await evaluate("window.__sfTest.sceneState()");
            return state.playerMove === "blink_step" ? state : null;
        }, "Y blink step start", 4000, 60);
        await delay(150);
        summary.blink = await evaluate("window.__sfTest.sceneState()");

        summary.superLeft = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ enemyFrozen: true, playerX: 260, enemyX: 360 });
            scene.cursors.left.isDown = true;
            const direction = scene.getSuperSlashDirection(scene.player);
            scene.cursors.left.isDown = false;
            scene.applyEdgeSnap(scene.enemy, direction, -180);
            return {
                direction,
                ...window.__sfTest.sceneState()
            };
        })()`);

        summary.superRight = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ enemyFrozen: true, playerX: 260, enemyX: 360 });
            scene.cursors.right.isDown = true;
            const direction = scene.getSuperSlashDirection(scene.player);
            scene.cursors.right.isDown = false;
            scene.applyEdgeSnap(scene.enemy, direction, -180);
            return {
                direction,
                ...window.__sfTest.sceneState()
            };
        })()`);

        await evaluate("window.__sfTest.resetFighters({ enemyFrozen: true, playerX: 260, enemyX: 620, touchMode: true });");
        await evaluate(`(() => {
            const app = window.__shadowFightApp;
            const button = document.querySelector('[data-control="blink"]');
            app.touchControlState.blink = true;
            button.dataset.active = "true";
            setTimeout(() => {
                app.touchControlState.blink = false;
                button.dataset.active = "false";
            }, 140);
            return true;
        })()`);
        summary.touchBlink = await waitFor(async () => {
            const state = await evaluate("window.__sfTest.sceneState()");
            return state.playerMove === "blink_step" ? state : null;
        }, "touch blink control", 4000, 60);

        await evaluate("window.__sfTest.resetFighters({ enemyFrozen: true, playerX: 260, enemyX: 360, touchMode: true });");
        await evaluate(`(() => {
            const app = window.__shadowFightApp;
            const button = document.querySelector('[data-control="super"]');
            app.touchControlState.super = true;
            button.dataset.active = "true";
            setTimeout(() => {
                app.touchControlState.super = false;
                button.dataset.active = "false";
            }, 140);
            return true;
        })()`);
        summary.touchSuper = await waitFor(async () => {
            const state = await evaluate("window.__sfTest.sceneState()");
            return state.playerMove === "super_slash" ? state : null;
        }, "touch super control", 4000, 60);

        summary.aiPunishSuper = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ playerX: 300, enemyX: 390 });
            scene.player.body.y = 408;
            scene.player.body.body.blocked.down = true;
            scene.player.body.body.touching.down = true;
            scene.player.state = "charge";
            scene.player.chargeSession = { minReadyAt: scene.time.now - 10, autoReleaseAt: scene.time.now + 500 };
            const distance = Math.abs(scene.player.body.x - scene.enemy.body.x);
            const rankedMoves = [
                { key: "super_slash", baseWeight: 6 },
                { key: "omni_slash_combo", baseWeight: 3 },
                { key: "triple_slash_combo", baseWeight: 2 }
            ]
                .map((entry) => ({
                    key: entry.key,
                    weight: scene.getEnemyMoveWeight(scene.enemy, scene.player, distance, entry.key, entry.baseWeight, {})
                }))
                .sort((a, b) => b.weight - a.weight);
            return {
                selectedMove: scene.pickEnemyPunishMove(scene.enemy, scene.player, distance),
                rankedMoves,
                scene: window.__sfTest.sceneState()
            };
        })()`);

        summary.aiPunishBlink = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ playerX: 260, enemyX: 530 });
            scene.player.body.y = 408;
            scene.player.body.body.blocked.down = true;
            scene.player.body.body.touching.down = true;
            scene.player.state = "charge";
            scene.player.chargeSession = { minReadyAt: scene.time.now - 10, autoReleaseAt: scene.time.now + 500 };
            const distance = Math.abs(scene.player.body.x - scene.enemy.body.x);
            const rankedMoves = [
                { key: "teleport_slash", baseWeight: distance < 228 ? 6 : 4 },
                { key: "blink_step", baseWeight: distance >= 200 ? 6 : 3 },
                { key: "energy_slash", baseWeight: 2 }
            ]
                .map((entry) => ({
                    key: entry.key,
                    weight: scene.getEnemyMoveWeight(scene.enemy, scene.player, distance, entry.key, entry.baseWeight, {})
                }))
                .sort((a, b) => b.weight - a.weight);
            return {
                selectedMove: scene.pickEnemyPunishMove(scene.enemy, scene.player, distance),
                rankedMoves,
                scene: window.__sfTest.sceneState()
            };
        })()`);

        summary.aiPunishOmni = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ playerX: 300, enemyX: 368 });
            scene.player.body.y = 408;
            scene.player.body.body.blocked.down = true;
            scene.player.body.body.touching.down = true;
            scene.player.state = "block";
            scene.player.blockStunUntil = scene.time.now + 500;
            const distance = Math.abs(scene.player.body.x - scene.enemy.body.x);
            const rankedMoves = [
                { key: "super_slash", baseWeight: 7 },
                { key: "quick_slash", baseWeight: 1 },
                { key: "omni_slash_combo", baseWeight: 8 },
                { key: "spin_attack", baseWeight: 3 },
                { key: "triple_slash_combo", baseWeight: 5 },
                { key: "iaido_slash", baseWeight: 4 }
            ]
                .map((entry) => ({
                    key: entry.key,
                    weight: scene.getEnemyMoveWeight(scene.enemy, scene.player, distance, entry.key, entry.baseWeight, {})
                }))
                .sort((a, b) => b.weight - a.weight);
            return {
                selectedMove: scene.pickEnemyPunishMove(scene.enemy, scene.player, distance),
                rankedMoves,
                scene: window.__sfTest.sceneState()
            };
        })()`);

        summary.aiGroundedRead = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ playerX: 292, enemyX: 430 });
            scene.player.body.y = scene.groundTop;
            scene.player.body.body.blocked.down = true;
            scene.player.body.body.touching.down = true;
            scene.player.state = "idle";
            const targetAirborne = !scene.isGrounded(scene.player);
            const preferredRange = scene.getEnemyPreferredRange(scene.enemy, scene.player);
            const profilePressureRange = scene.getEnemyDifficultyProfile().pressureRange;
            const distance = Math.abs(scene.player.body.x - scene.enemy.body.x);
            const rankedMoves = [
                { key: "triple_slash_combo", baseWeight: 6 },
                { key: "super_slash", baseWeight: 6 },
                { key: "upward_slash", baseWeight: 2 },
                { key: "air_combo_finisher", baseWeight: 5 }
            ]
                .map((entry) => ({
                    key: entry.key,
                    weight: scene.getEnemyMoveWeight(scene.enemy, scene.player, distance, entry.key, entry.baseWeight, {})
                }))
                .sort((a, b) => b.weight - a.weight);
            return {
                targetAirborne,
                preferredRange,
                profilePressureRange,
                rankedMoves,
                scene: window.__sfTest.sceneState()
            };
        })()`);

        summary.airClash = await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ playerX: 320, enemyX: 420 });
            scene.player.health = 300;
            scene.enemy.health = 300;
            scene.handleAirClash(scene.player, scene.enemy, scene.time.now);
            return {
                playerHealth: scene.player.health,
                enemyHealth: scene.enemy.health,
                playerState: scene.player.state,
                enemyState: scene.enemy.state,
                hitstopActive: scene.hitstopActive
            };
        })()`);

        await evaluate(`(() => {
            const scene = window.__sfTest.getScene();
            window.__sfTest.resetFighters({ enemyFrozen: true, playerX: 260, enemyX: 360 });
            scene.startMove(scene.player, scene.time.now, "super_slash", false, { edgeDirection: 1 });
            return true;
        })()`);
        await delay(260);
        await captureScreenshot("super_slash_pose.png");
        summary.screenshots.push(path.join(outputDir, "super_slash_pose.png"));

        if (summary.initial.playerHealth !== 300 || summary.initial.enemyHealth !== 300) {
            throw new Error(`Expected 300 HP start, received ${summary.initial.playerHealth}/${summary.initial.enemyHealth}`);
        }
        if (!summary.initial.animations.blink_step || !summary.initial.animations.super_slash || !summary.initial.animations.omni_slash_combo) {
            throw new Error("New animations did not register in Phaser.");
        }
        if (summary.tapA.playerMove !== "quick_slash") {
            throw new Error(`Tap A expected quick_slash, received ${summary.tapA.playerMove}`);
        }
        if (summary.holdA.playerMove !== "omni_slash_combo") {
            throw new Error(`Hold A expected omni_slash_combo, received ${summary.holdA.playerMove}`);
        }
        if (Math.abs(summary.blink.playerX - (summary.blink.enemyX - 82)) > 26) {
            throw new Error(`Blink step did not place the player in front of the enemy. PlayerX=${summary.blink.playerX}, EnemyX=${summary.blink.enemyX}`);
        }
        if (summary.superLeft.direction !== -1 || summary.superLeft.enemyX > 70) {
            throw new Error(`Left super slash did not resolve toward the left edge. Direction=${summary.superLeft.direction}, EnemyX=${summary.superLeft.enemyX}`);
        }
        if (summary.superRight.direction !== 1 || summary.superRight.enemyX < 730) {
            throw new Error(`Right super slash did not resolve toward the right edge. Direction=${summary.superRight.direction}, EnemyX=${summary.superRight.enemyX}`);
        }
        if (summary.touchBlink.playerMove !== "blink_step") {
            throw new Error(`Touch blink expected blink_step, received ${summary.touchBlink.playerMove}`);
        }
        if (summary.touchSuper.playerMove !== "super_slash") {
            throw new Error(`Touch super expected super_slash, received ${summary.touchSuper.playerMove}`);
        }
        if (!summary.aiPunishSuper.rankedMoves.length || summary.aiPunishSuper.rankedMoves[0].key !== "super_slash") {
            throw new Error(`AI close punish weighting should prioritize super_slash, received ${JSON.stringify(summary.aiPunishSuper.rankedMoves)}`);
        }
        if (!summary.aiPunishBlink.rankedMoves.length || summary.aiPunishBlink.rankedMoves[0].key !== "blink_step") {
            throw new Error(`AI far punish weighting should prioritize blink_step, received ${JSON.stringify(summary.aiPunishBlink.rankedMoves)}`);
        }
        if (!summary.aiPunishOmni.rankedMoves.length || summary.aiPunishOmni.rankedMoves[0].key !== "super_slash") {
            throw new Error(`AI block punish weighting should now prioritize super_slash, received ${JSON.stringify(summary.aiPunishOmni.rankedMoves)}`);
        }
        if (summary.aiGroundedRead.targetAirborne) {
            throw new Error("Standing player was incorrectly read as airborne.");
        }
        if (summary.aiGroundedRead.preferredRange !== summary.aiGroundedRead.profilePressureRange) {
            throw new Error(`Grounded target should use grounded preferred range, received ${summary.aiGroundedRead.preferredRange} instead of ${summary.aiGroundedRead.profilePressureRange}`);
        }
        if (!summary.aiGroundedRead.rankedMoves.length || summary.aiGroundedRead.rankedMoves[0].key === "upward_slash" || summary.aiGroundedRead.rankedMoves[0].key === "air_combo_finisher") {
            throw new Error(`Grounded close-range weighting should favor grounded attacks, received ${JSON.stringify(summary.aiGroundedRead.rankedMoves)}`);
        }
        if (summary.airClash.playerHealth !== 300 || summary.airClash.enemyHealth !== 300) {
            throw new Error("Air clash should not deal damage.");
        }
        if (!summary.airClash.hitstopActive) {
            throw new Error("Air clash did not trigger hitstop.");
        }

        fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2));
        console.log(JSON.stringify(summary, null, 2));
    } finally {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
        if (!browserClosed) {
            browser.kill();
            await Promise.race([
                new Promise((resolve) => browser.once("exit", resolve)),
                delay(1500)
            ]);
        }
        try {
            fs.rmSync(userDataDir, { recursive: true, force: true });
        } catch (error) {
            // Ignore temp folder cleanup failures from locked browser files.
        }
        if (stderrChunks.length) {
            const stderrPath = path.join(outputDir, "browser-stderr.log");
            fs.writeFileSync(stderrPath, stderrChunks.join(""));
        }
    }
}

main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
});
