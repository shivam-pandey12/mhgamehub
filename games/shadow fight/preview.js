(function () {
    "use strict";

    const FRAME_WIDTH = 512;
    const FRAME_HEIGHT = 512;
    const BASE_PATH = "./assets/shadow-fighter";
    const MANIFEST_PATH = `${BASE_PATH}/shadow_fighter_manifest.json`;
    const STATUS_ID = "status";
    const CONTROL_TEXT = [
        "Left / Right: walk",
        "Shift + Left / Right: run",
        "Up: jump",
        "Space: light slash",
        "Q: heavy attack",
        "E: combo attack",
        "B: block",
        "H: hit reaction",
        "K: knockdown"
    ];

    const fallbackManifest = {
        assetName: "shadow_fighter",
        origin: { x: 0.5, y: 0.84 },
        atlas: {
            path: "shadow_fighter_atlas.png",
            columns: 8,
            rows: 9,
            totalFrames: 72,
            cellWidth: FRAME_WIDTH,
            cellHeight: FRAME_HEIGHT
        },
        animations: {
            idle: { fps: 8, loop: true, holdLastFrame: false, atlasFrameIndices: [0, 1, 2, 3, 4, 5] },
            walk: { fps: 10, loop: true, holdLastFrame: false, atlasFrameIndices: [6, 7, 8, 9, 10, 11, 12, 13] },
            run: { fps: 14, loop: true, holdLastFrame: false, atlasFrameIndices: [14, 15, 16, 17, 18, 19, 20, 21] },
            jump: { fps: 12, loop: false, holdLastFrame: false, atlasFrameIndices: [22, 23, 24, 25, 26, 27] },
            light_slash: { fps: 14, loop: false, holdLastFrame: false, atlasFrameIndices: [28, 29, 30, 31, 32, 33, 34, 35] },
            heavy_attack: { fps: 10, loop: false, holdLastFrame: false, atlasFrameIndices: [36, 37, 38, 39, 40, 41, 42, 43] },
            combo_attack: { fps: 16, loop: false, holdLastFrame: false, atlasFrameIndices: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53] },
            block: { fps: 10, loop: false, holdLastFrame: true, atlasFrameIndices: [54, 55, 56, 57, 58] },
            hit_reaction: { fps: 12, loop: false, holdLastFrame: false, atlasFrameIndices: [59, 60, 61, 62, 63] },
            knockdown: { fps: 10, loop: false, holdLastFrame: true, atlasFrameIndices: [64, 65, 66, 67, 68, 69, 70, 71] }
        }
    };

    const ONE_SHOT_KEYS = ["jump", "light_slash", "heavy_attack", "combo_attack", "block", "hit_reaction", "knockdown"];

    function setStatus(message, isError) {
        const status = document.getElementById(STATUS_ID);
        if (!status) {
            return;
        }

        status.textContent = message;
        status.classList.toggle("error", Boolean(isError));
    }

    function withPrefix(list, prefix) {
        return list.map((frameIndex) => ({ key: prefix, frame: frameIndex }));
    }

    function buildAnimationConfig(manifest, key) {
        const entry = manifest.animations[key];
        if (!entry || !Array.isArray(entry.atlasFrameIndices) || entry.atlasFrameIndices.length === 0) {
            return null;
        }

        return {
            key,
            frames: withPrefix(entry.atlasFrameIndices, "fighter"),
            frameRate: entry.fps || 10,
            repeat: entry.loop ? -1 : 0
        };
    }

    function ensureAnimation(scene, manifest, key) {
        const config = buildAnimationConfig(manifest, key);
        if (!config) {
            return false;
        }

        if (!scene.anims.exists(key)) {
            scene.anims.create(config);
        }

        return true;
    }

    function getAnimationNames(manifest) {
        return Object.keys(manifest.animations || {});
    }

    function getAnimationEntry(manifest, key) {
        return manifest.animations && manifest.animations[key] ? manifest.animations[key] : null;
    }

    async function loadManifest() {
        try {
            const response = await fetch(MANIFEST_PATH, { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`Manifest request failed with ${response.status}`);
            }

            const manifest = await response.json();
            setStatus("Manifest loaded. Starting Phaser preview...");
            return manifest;
        } catch (error) {
            setStatus("Manifest not found, using built-in grid fallback animation map.", false);
            return fallbackManifest;
        }
    }

    function startPreview(manifest) {
        const sharedState = {
            manifest,
            player: null,
            cursors: null,
            keys: null,
            activeOneShot: null,
            heldAnimation: null,
            speed: 240,
            currentLabel: null,
            hintLabels: []
        };

        function preload() {
            this.load.spritesheet("fighter", `${BASE_PATH}/${manifest.atlas.path || "shadow_fighter_atlas.png"}`, {
                frameWidth: FRAME_WIDTH,
                frameHeight: FRAME_HEIGHT
            });
        }

        function create() {
            const width = this.scale.width;
            const height = this.scale.height;
            const originX = manifest.origin && typeof manifest.origin.x === "number" ? manifest.origin.x : 0.5;
            const originY = manifest.origin && typeof manifest.origin.y === "number" ? manifest.origin.y : 0.84;

            this.cameras.main.setBackgroundColor("#181c25");

            const floor = this.add.rectangle(width / 2, height - 72, width * 0.86, 5, 0x92d9ff, 0.32);
            floor.setOrigin(0.5, 0.5);

            const glow = this.add.ellipse(width / 2, height - 76, 380, 70, 0x92d9ff, 0.08);
            glow.setBlendMode(Phaser.BlendModes.ADD);

            this.add.text(26, 20, "Shadow Fighter Demo", {
                fontFamily: "Segoe UI, Tahoma, sans-serif",
                fontSize: "24px",
                color: "#edf2ff"
            });

            this.add.text(26, 52, "Full move-set preview with local Phaser bundle.", {
                fontFamily: "Segoe UI, Tahoma, sans-serif",
                fontSize: "14px",
                color: "#a7b0c9"
            });

            getAnimationNames(manifest).forEach((animationName) => {
                ensureAnimation(this, manifest, animationName);
            });

            sharedState.player = this.add.sprite(width / 2, height - 76, "fighter", 0);
            sharedState.player.setOrigin(originX, originY);
            sharedState.player.setScale(0.56);

            sharedState.cursors = this.input.keyboard.createCursorKeys();
            sharedState.keys = this.input.keyboard.addKeys({
                shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                attack: Phaser.Input.Keyboard.KeyCodes.SPACE,
                heavy: Phaser.Input.Keyboard.KeyCodes.Q,
                combo: Phaser.Input.Keyboard.KeyCodes.E,
                block: Phaser.Input.Keyboard.KeyCodes.B,
                hit: Phaser.Input.Keyboard.KeyCodes.H,
                knockdown: Phaser.Input.Keyboard.KeyCodes.K
            });

            sharedState.currentLabel = this.add.text(width - 26, 24, "", {
                fontFamily: "Segoe UI, Tahoma, sans-serif",
                fontSize: "18px",
                color: "#92d9ff"
            }).setOrigin(1, 0);

            sharedState.hintLabels = CONTROL_TEXT.map((line, index) => this.add.text(
                width - 26,
                height - 168 + (index * 18),
                line,
                {
                    fontFamily: "Segoe UI, Tahoma, sans-serif",
                    fontSize: "13px",
                    color: "#a7b0c9"
                }
            ).setOrigin(1, 0));

            if (this.anims.exists("idle")) {
                sharedState.player.play("idle");
                sharedState.currentLabel.setText("Animation: idle");
            }

            sharedState.player.on("animationstart", function (animation) {
                sharedState.currentLabel.setText(`Animation: ${animation.key}`);
            });

            ONE_SHOT_KEYS.forEach((animationKey) => {
                sharedState.player.on(`animationcomplete-${animationKey}`, () => {
                    const entry = getAnimationEntry(manifest, animationKey);
                    sharedState.activeOneShot = null;
                    sharedState.heldAnimation = entry && entry.holdLastFrame ? animationKey : null;
                });
            });

            setStatus("Preview ready. Serve this folder over HTTP and open index.html in your browser.");
        }

        function playAnimation(scene, animationKey) {
            if (!scene.anims.exists(animationKey)) {
                return false;
            }

            sharedState.player.play(animationKey, true);
            sharedState.currentLabel.setText(`Animation: ${animationKey}`);
            return true;
        }

        function triggerOneShot(scene, animationKey) {
            if (!scene.anims.exists(animationKey)) {
                return false;
            }

            sharedState.activeOneShot = animationKey;
            sharedState.heldAnimation = null;
            return playAnimation(scene, animationKey);
        }

        function handleActionInput(scene) {
            const keys = sharedState.keys;
            if (Phaser.Input.Keyboard.JustDown(sharedState.cursors.up)) {
                return triggerOneShot(scene, "jump");
            }
            if (Phaser.Input.Keyboard.JustDown(keys.attack)) {
                return triggerOneShot(scene, "light_slash");
            }
            if (Phaser.Input.Keyboard.JustDown(keys.heavy)) {
                return triggerOneShot(scene, "heavy_attack");
            }
            if (Phaser.Input.Keyboard.JustDown(keys.combo)) {
                return triggerOneShot(scene, "combo_attack");
            }
            if (Phaser.Input.Keyboard.JustDown(keys.block)) {
                return triggerOneShot(scene, "block");
            }
            if (Phaser.Input.Keyboard.JustDown(keys.hit)) {
                return triggerOneShot(scene, "hit_reaction");
            }
            if (Phaser.Input.Keyboard.JustDown(keys.knockdown)) {
                return triggerOneShot(scene, "knockdown");
            }

            return false;
        }

        function update() {
            if (!sharedState.player) {
                return;
            }

            const player = sharedState.player;
            const cursors = sharedState.cursors;
            const keys = sharedState.keys;
            let velocityX = 0;
            let requestedMoveAnimation = "idle";

            if (handleActionInput(this)) {
                return;
            }

            if (sharedState.activeOneShot) {
                return;
            }

            const isRunHeld = keys.shift.isDown;

            if (cursors.left.isDown) {
                velocityX = -sharedState.speed * (isRunHeld ? 1.5 : 1);
                player.setFlipX(true);
                requestedMoveAnimation = isRunHeld ? "run" : "walk";
            } else if (cursors.right.isDown) {
                velocityX = sharedState.speed * (isRunHeld ? 1.5 : 1);
                player.setFlipX(false);
                requestedMoveAnimation = isRunHeld ? "run" : "walk";
            }

            player.x += velocityX * (this.game.loop.delta / 1000);
            player.x = Phaser.Math.Clamp(player.x, 100, this.scale.width - 100);

            if (sharedState.heldAnimation && velocityX === 0) {
                return;
            }

            if (velocityX !== 0) {
                sharedState.heldAnimation = null;
            }

            const targetAnimation = requestedMoveAnimation;
            if (player.anims.currentAnim && player.anims.currentAnim.key !== targetAnimation) {
                playAnimation(this, targetAnimation);
            } else if (!player.anims.currentAnim && this.anims.exists(targetAnimation)) {
                playAnimation(this, targetAnimation);
            }
        }

        const config = {
            type: Phaser.AUTO,
            width: 960,
            height: 540,
            parent: "game-frame",
            pixelArt: false,
            backgroundColor: "#181c25",
            scene: {
                preload,
                create,
                update
            }
        };

        new Phaser.Game(config);
    }

    if (typeof Phaser === "undefined") {
        setStatus("Phaser failed to load. Check your internet connection for the CDN script.", true);
        return;
    }

    loadManifest()
        .then(startPreview)
        .catch((error) => {
            console.error(error);
            setStatus(`Unable to start preview: ${error.message}`, true);
        });
})();
