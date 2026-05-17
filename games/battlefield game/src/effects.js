import {
  Color,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
} from "three";

const SPARK_GEOMETRY = new SphereGeometry(0.08, 6, 6);
const SMOKE_GEOMETRY = new SphereGeometry(0.18, 8, 8);
const MUZZLE_GEOMETRY = new SphereGeometry(0.06, 6, 6);

export class BattlefieldEffects {
  constructor({ scene }) {
    this.scene = scene;
    this.effects = [];
    this.tempVector = new Vector3();
  }

  spawnImpact(position, { headshot = false, normal = null } = {}) {
    const sparkColor = new Color(headshot ? 0xff8a7a : 0xfbd38d);
    const smokeColor = new Color(headshot ? 0xffb7b7 : 0xb8c4bd);
    const direction = normal ? normal.clone() : new Vector3(0, 1, 0);

    this.spawnParticleBurst({
      count: headshot ? 7 : 5,
      color: sparkColor,
      direction,
      life: 0.22,
      position,
      speed: headshot ? 4.2 : 3.2,
      spread: 1.2,
      type: "spark",
    });
    this.spawnParticleBurst({
      count: headshot ? 4 : 3,
      color: smokeColor,
      direction,
      life: 0.38,
      position,
      speed: 1.05,
      spread: 0.5,
      type: "smoke",
    });
  }

  spawnMuzzleBurst(position, direction = null) {
    const burstDirection = direction ? direction.clone() : new Vector3(0, 0, -1);
    const sparkColor = new Color(0xffd28b);
    const smokeColor = new Color(0xd9ddd7);

    for (let index = 0; index < 4; index += 1) {
      const material = new MeshBasicMaterial({
        color: sparkColor,
        transparent: true,
      });
      const mesh = new Mesh(MUZZLE_GEOMETRY, material);
      mesh.position.copy(position);
      this.scene.add(mesh);

      const velocity = burstDirection
        .clone()
        .multiplyScalar(4.2 + Math.random() * 2.1)
        .add(new Vector3(
          MathUtilsRandSpread(0.8),
          MathUtilsRandSpread(0.4),
          MathUtilsRandSpread(0.8),
        ));

      this.effects.push({
        gravity: 2.4,
        life: 0.09,
        maxLife: 0.09,
        mesh,
        type: "spark",
        velocity,
      });
    }

    this.spawnParticleBurst({
      color: smokeColor,
      count: 3,
      direction: burstDirection,
      life: 0.22,
      position,
      speed: 0.9,
      spread: 0.45,
      type: "smoke",
    });
  }

  spawnParticleBurst({
    color,
    count,
    direction,
    life,
    position,
    speed,
    spread,
    type,
  }) {
    for (let index = 0; index < count; index += 1) {
      const geometry = type === "smoke" ? SMOKE_GEOMETRY : SPARK_GEOMETRY;
      const material = new MeshBasicMaterial({
        color,
        transparent: true,
      });
      const mesh = new Mesh(geometry, material);
      mesh.position.copy(position);
      this.scene.add(mesh);

      const velocity = direction
        .clone()
        .multiplyScalar(speed * (0.6 + Math.random() * 0.75))
        .add(new Vector3(
          MathUtilsRandSpread(spread),
          Math.random() * spread,
          MathUtilsRandSpread(spread),
        ));

      this.effects.push({
        gravity: type === "smoke" ? 0.4 : 5.8,
        life,
        maxLife: life,
        mesh,
        type,
        velocity,
      });
    }
  }

  update(delta) {
    for (let index = this.effects.length - 1; index >= 0; index -= 1) {
      const effect = this.effects[index];
      effect.life -= delta;

      if (effect.life <= 0) {
        this.scene.remove(effect.mesh);
        effect.mesh.material.dispose();
        this.effects.splice(index, 1);
        continue;
      }

      effect.velocity.y -= effect.gravity * delta;
      effect.mesh.position.addScaledVector(effect.velocity, delta);

      const alpha = effect.life / effect.maxLife;
      effect.mesh.material.opacity = effect.type === "smoke" ? alpha * 0.48 : alpha;

      if (effect.type === "smoke") {
        const scale = 1 + (1 - alpha) * 1.7;
        effect.mesh.scale.setScalar(scale);
      }
    }
  }
}

function MathUtilsRandSpread(range) {
  return (Math.random() - 0.5) * range * 2;
}
