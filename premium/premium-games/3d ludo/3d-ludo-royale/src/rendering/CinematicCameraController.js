import * as THREE from 'three';

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function clonePose(pose) {
  return {
    position: pose.position.clone(),
    target: pose.target.clone()
  };
}

export class CinematicCameraController {
  constructor(camera, controls, poseProvider) {
    this.camera = camera;
    this.controls = controls;
    this.poseProvider = poseProvider;
    this.options = {
      cinematicCamera: true,
      autoFocusCurrentPlayer: true
    };
    this.sequence = 0;
    this.currentPose = clonePose(this.poseProvider.overview());
    this.applyPose(this.currentPose);
  }

  setOptions(options = {}) {
    this.options = { ...this.options, ...options };
    if (!this.options.cinematicCamera) {
      this.cancel();
      this.goOverview({ duration: 420, force: true });
    }
  }

  cancel() {
    this.sequence += 1;
  }

  applyPose(pose) {
    this.camera.position.copy(pose.position);
    this.controls.target.copy(pose.target);
    this.controls.update();
    this.currentPose = clonePose(pose);
  }

  transitionTo(pose, { duration = 720, force = false } = {}) {
    if (!force && !this.options.cinematicCamera) {
      return Promise.resolve(false);
    }

    const sequence = ++this.sequence;
    const from = {
      position: this.camera.position.clone(),
      target: this.controls.target.clone()
    };
    const to = clonePose(pose);
    const startedAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        if (sequence !== this.sequence) {
          resolve(false);
          return;
        }

        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = easeInOutCubic(progress);
        this.camera.position.lerpVectors(from.position, to.position, eased);
        this.controls.target.lerpVectors(from.target, to.target, eased);
        this.camera.position.y = Math.max(this.camera.position.y, 3.2);
        this.controls.update();

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          this.currentPose = to;
          resolve(true);
        }
      };
      requestAnimationFrame(tick);
    });
  }

  goOverview(options = {}) {
    return this.transitionTo(this.poseProvider.overview(), options);
  }

  focusPlayer(playerId, options = {}) {
    if (!this.options.autoFocusCurrentPlayer && !options.force) {
      return Promise.resolve(false);
    }
    return this.transitionTo(this.poseProvider.player(playerId), options);
  }

  focusDice(options = {}) {
    return this.transitionTo(this.poseProvider.dice(), options);
  }

  followToken(position, options = {}) {
    return this.transitionTo(this.poseProvider.token(position), {
      duration: 420,
      ...options
    });
  }

  focusCapture(position, options = {}) {
    return this.transitionTo(this.poseProvider.capture(position), {
      duration: 360,
      ...options
    });
  }

  focusHome(position, options = {}) {
    return this.transitionTo(this.poseProvider.home(position), {
      duration: 620,
      ...options
    });
  }

  focusWinner(playerId, options = {}) {
    return this.transitionTo(this.poseProvider.winner(playerId), {
      duration: 950,
      ...options
    });
  }
}
