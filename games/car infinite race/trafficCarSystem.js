import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const DEFAULTS = {
  modelUrl: "assets/traffic-car.gltf",
  lanes: [-4, 0, 4],
  spawnZ: -120,
  clearZ: 40,
  maxCars: 12,
  spawnMin: 1.0,
  spawnMax: 1.5,
  fastSpawnMin: 0.52,
  fastSpawnMax: 0.88,
  speedFactorMin: 0.9,
  speedFactorMax: 1.14,
  sizeVarianceMin: 0.92,
  sizeVarianceMax: 1.08,
  bobAmplitude: 0.016,
  bobSpeed: 7,
  bodyLeanAmplitude: 0.014,
  bodyPitchAmplitude: 0.006,
  wheelSpinFactor: 1.28,
  laneChangeMin: 1.8,
  laneChangeMax: 4.8,
  fastLaneChangeMin: 0.55,
  fastLaneChangeMax: 1.25,
  laneChangeLead: 0.34,
  fastLaneChangeLead: 0.16,
  laneShiftSpeed: 8.5,
  fastLaneShiftSpeed: 12.2,
  laneGap: 16,
  fastLaneGap: 10.5,
  spawnRevealDuration: 0.22,
  colorPalette: [
    { body: 0xb7844b, cabin: 0x5f452c, accent: 0xf6c987 },
    { body: 0xc28b57, cabin: 0x775638, accent: 0xe9b96d },
    { body: 0xa67444, cabin: 0x59412b, accent: 0xefc27c },
    { body: 0x8e6a49, cabin: 0x4b3828, accent: 0xe7b872 },
    { body: 0xd2a26b, cabin: 0x705137, accent: 0xf3cf94 }
  ]
};

const TRAFFIC_COLLIDER_SCALE_X = 0.44;
const TRAFFIC_COLLIDER_SCALE_Y = 0.36;
const TRAFFIC_COLLIDER_SCALE_Z = 0.43;

function cloneOptionValue(value) {
  if (value instanceof THREE.Vector3) {
    return value.clone();
  }

  if (Array.isArray(value)) {
    return value.slice();
  }

  return value;
}

function mergeOptions(overrides = {}) {
  const merged = {};

  for (const [key, value] of Object.entries(DEFAULTS)) {
    merged[key] = cloneOptionValue(value);
  }

  for (const [key, value] of Object.entries(overrides)) {
    merged[key] = value instanceof THREE.Vector3 ? value.clone() : value;
  }

  return merged;
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function ensureBodyFactors(body, CANNON) {
  if (!body.linearFactor) {
    body.linearFactor = new CANNON.Vec3(1, 1, 1);
  }

  if (!body.angularFactor) {
    body.angularFactor = new CANNON.Vec3(1, 1, 1);
  }
}

export class TrafficCarSystem {
  constructor({
    scene,
    world,
    cannonLib = window.CANNON,
    gsapInstance = window.gsap,
    modelUrl,
    ...options
  }) {
    if (!scene) {
      throw new Error("TrafficCarSystem requires a Three.js scene.");
    }

    if (!world) {
      throw new Error("TrafficCarSystem requires a shared Cannon.js world.");
    }

    if (!cannonLib) {
      throw new Error("TrafficCarSystem requires Cannon.js on window.CANNON or through cannonLib.");
    }

    this.scene = scene;
    this.world = world;
    this.CANNON = cannonLib;
    this.gsap = gsapInstance;
    this.options = mergeOptions({ modelUrl, ...options });
    this.loader = new GLTFLoader();

    this.template = null;
    this.templateBounds = {
      width: 2.2,
      height: 1.45,
      length: 4.5
    };
    this.baseHalfExtents = new THREE.Vector3(1.05, 0.56, 2.15);

    this.spawnTimer = 0;
    this.nextSpawnDelay = randomRange(this.options.spawnMin, this.options.spawnMax);
    this.activeCars = [];
    this.inactiveCars = [];

    this.tempBox = new THREE.Box3();
    this.tempSize = new THREE.Vector3();
    this.tempCenter = new THREE.Vector3();
  }

  async init() {
    this.template = await this.loadTemplate();
    this.prewarmPool();
  }

  async loadTemplate() {
    try {
      const gltf = await this.loader.loadAsync(this.options.modelUrl);
      const template = gltf.scene || gltf.scenes?.[0];

      if (!template) {
        throw new Error(`GLTF at "${this.options.modelUrl}" did not contain a scene.`);
      }

      this.optimizeTemplate(template);
      this.centerAndMeasureTemplate(template);
      return template;
    } catch (error) {
      console.warn("TrafficCarSystem could not load the GLTF template, using the procedural fallback.", error);
      const fallback = this.createProceduralTemplate();
      this.centerAndMeasureTemplate(fallback);
      return fallback;
    }
  }

  optimizeTemplate(root) {
    root.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = false;

      if (child.material && "metalness" in child.material) {
        child.material.metalness = Math.max(child.material.metalness ?? 0, 0.42);
      }

      if (child.material && "roughness" in child.material) {
        child.material.roughness = Math.min(child.material.roughness ?? 1, 0.48);
      }
    });
  }

  createProceduralTemplate() {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.78, 4.5),
      new THREE.MeshStandardMaterial({ color: 0xb7844b, metalness: 0.35, roughness: 0.5 })
    );
    body.name = "TrafficBody";
    body.position.y = 0.54;
    group.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.34, 0.58, 1.95),
      new THREE.MeshStandardMaterial({ color: 0x5f452c, metalness: 0.15, roughness: 0.58 })
    );
    cabin.name = "TrafficCabin";
    cabin.position.set(0, 0.98, -0.06);
    group.add(cabin);

    const frontLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.12, 0.44),
      new THREE.MeshBasicMaterial({ color: 0xf6c987 })
    );
    frontLight.name = "TrafficLightLeft";
    frontLight.position.set(-0.58, 0.55, -2.05);
    group.add(frontLight);

    const frontLightRight = frontLight.clone();
    frontLightRight.name = "TrafficLightRight";
    frontLightRight.position.x = 0.58;
    group.add(frontLightRight);

    const rearLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.1, 0.28),
      new THREE.MeshBasicMaterial({ color: 0xcd9a5b })
    );
    rearLight.name = "TrafficRearLightLeft";
    rearLight.position.set(-0.58, 0.53, 2.05);
    group.add(rearLight);

    const rearLightRight = rearLight.clone();
    rearLightRight.name = "TrafficRearLightRight";
    rearLightRight.position.x = 0.58;
    group.add(rearLightRight);

    const wheelGeometry = new THREE.BoxGeometry(0.42, 0.42, 0.88);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x4f3a25, roughness: 0.9 });
    const wheelOffsets = [
      [-1.0, 0.22, -1.45],
      [1.0, 0.22, -1.45],
      [-1.0, 0.22, 1.45],
      [1.0, 0.22, 1.45]
    ];

    wheelOffsets.forEach(([x, y, z], index) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.name = `TrafficWheel${index}`;
      wheel.position.set(x, y, z);
      group.add(wheel);
    });

    this.optimizeTemplate(group);
    return group;
  }

  centerAndMeasureTemplate(root) {
    this.tempBox.setFromObject(root);
    this.tempBox.getCenter(this.tempCenter);
    root.position.x -= this.tempCenter.x;
    root.position.z -= this.tempCenter.z;
    root.updateMatrixWorld(true);

    this.tempBox.setFromObject(root);
    root.position.y -= this.tempBox.min.y;
    root.updateMatrixWorld(true);

    this.tempBox.setFromObject(root);
    this.tempBox.getSize(this.tempSize);

    this.templateBounds.width = this.tempSize.x;
    this.templateBounds.height = this.tempSize.y;
    this.templateBounds.length = this.tempSize.z;

    this.baseHalfExtents.set(
      this.templateBounds.width * TRAFFIC_COLLIDER_SCALE_X,
      Math.max(this.templateBounds.height * TRAFFIC_COLLIDER_SCALE_Y, 0.48),
      this.templateBounds.length * TRAFFIC_COLLIDER_SCALE_Z
    );
  }

  prewarmPool() {
    for (let index = 0; index < this.options.maxCars; index += 1) {
      const group = new THREE.Group();
      group.name = `TrafficCar_${index}`;
      group.visible = false;

      const visualRig = new THREE.Group();
      visualRig.name = `${group.name}_VisualRig`;

      const visualData = this.createTrafficVisual();
      visualRig.add(visualData.visual);
      group.add(visualRig);
      this.scene.add(group);

      const body = this.createPhysicsBody();
      const laneIndex = 1;

      const record = {
        group,
        visualRig,
        visual: visualData.visual,
        body,
        wheels: visualData.wheels,
        wheelBaseRotations: visualData.wheelBaseRotations,
        indicatorMaterials: visualData.indicatorMaterials,
        active: false,
        laneIndex,
        targetLaneIndex: laneIndex,
        laneX: this.options.lanes[laneIndex],
        targetLaneX: this.options.lanes[laneIndex],
        speedFactor: 1,
        bobOffset: 0,
        scaleVariant: 1,
        halfExtents: this.baseHalfExtents.clone(),
        wheelSpin: 0,
        nextLaneChangeAt: 0,
        laneChangeMoveAt: 0,
        indicatorSide: "off",
        indicatorStopAt: 0,
        nearMissed: false,
        collided: false
      };

      body.userData = {
        kind: "traffic",
        record
      };
      group.userData.record = record;
      this.inactiveCars.push(record);
    }
  }

  createTrafficVisual() {
    const visual = this.template.clone(true);
    const wheels = [];
    const wheelBaseRotations = new Map();
    const indicatorMaterials = {
      left: [],
      right: []
    };

    visual.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = false;

      if (child.material) {
        child.material = child.material.clone();
      }

      const name = child.name.toLowerCase();

      if (name.includes("wheel")) {
        wheels.push(child);
        wheelBaseRotations.set(child.uuid, child.rotation.clone());
      }
    });

    const indicatorGeometry = new THREE.BoxGeometry(0.24, 0.1, 0.14);
    const x = this.templateBounds.width * 0.49;
    const y = Math.max(this.templateBounds.height * 0.45, 0.48);
    const frontZ = -this.templateBounds.length * 0.5;
    const rearZ = this.templateBounds.length * 0.5;
    const placements = [
      { side: "left", position: new THREE.Vector3(-x, y, frontZ) },
      { side: "left", position: new THREE.Vector3(-x, y, rearZ) },
      { side: "right", position: new THREE.Vector3(x, y, frontZ) },
      { side: "right", position: new THREE.Vector3(x, y, rearZ) }
    ];

    placements.forEach(({ side, position }) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0x6a5434,
        transparent: true,
        opacity: 0.16,
        toneMapped: false
      });
      const mesh = new THREE.Mesh(indicatorGeometry, material);
      mesh.position.copy(position);
      visual.add(mesh);
      indicatorMaterials[side].push(material);
    });

    return {
      visual,
      wheels,
      wheelBaseRotations,
      indicatorMaterials
    };
  }

  createPhysicsBody() {
    const body = new this.CANNON.Body({
      mass: 1
    });

    body.linearDamping = 0.08;
    body.angularDamping = 1;
    body.fixedRotation = true;
    ensureBodyFactors(body, this.CANNON);
    body.linearFactor.set(1, 0, 1);
    body.angularFactor.set(0, 0, 0);
    this.applyBodyShape(body, this.baseHalfExtents);
    return body;
  }

  applyBodyShape(body, halfExtents) {
    body.shapes.length = 0;
    body.shapeOffsets.length = 0;
    body.shapeOrientations.length = 0;
    body.addShape(new this.CANNON.Box(new this.CANNON.Vec3(halfExtents.x, halfExtents.y, halfExtents.z)));
    body.aabbNeedsUpdate = true;
    body.updateMassProperties();
    body.updateBoundingRadius();
  }

  reset() {
    this.spawnTimer = 0;
    this.nextSpawnDelay = randomRange(this.options.spawnMin, this.options.spawnMax);

    for (let index = this.activeCars.length - 1; index >= 0; index -= 1) {
      this.deactivateCar(index);
    }
  }

  getTrafficPressure(speed) {
    const speedKmh = speed * 8.6;
    return THREE.MathUtils.clamp((speedKmh - 220) / 220, 0, 1);
  }

  getLaneChangeDelay(speed) {
    const pressure = this.getTrafficPressure(speed);
    const minDelay = THREE.MathUtils.lerp(this.options.laneChangeMin, this.options.fastLaneChangeMin, pressure);
    const maxDelay = THREE.MathUtils.lerp(this.options.laneChangeMax, this.options.fastLaneChangeMax, pressure);
    return randomRange(minDelay, maxDelay);
  }

  getLaneChangeLead(speed) {
    return THREE.MathUtils.lerp(this.options.laneChangeLead, this.options.fastLaneChangeLead, this.getTrafficPressure(speed));
  }

  getLaneShiftSpeed(speed) {
    return THREE.MathUtils.lerp(this.options.laneShiftSpeed, this.options.fastLaneShiftSpeed, this.getTrafficPressure(speed));
  }

  getLaneGap(speed) {
    return THREE.MathUtils.lerp(this.options.laneGap, this.options.fastLaneGap, this.getTrafficPressure(speed));
  }

  updateBeforeStep(delta, { speed, elapsed }) {
    this.spawnTimer += delta;

    if (this.activeCars.length < this.options.maxCars && this.spawnTimer >= this.nextSpawnDelay) {
      this.spawnTimer = 0;
      this.nextSpawnDelay = this.getSpawnDelay(elapsed);
      this.activateCar(elapsed, speed);
    }

    for (let index = 0; index < this.activeCars.length; index += 1) {
      const record = this.activeCars[index];

      if (!record.collided && record.targetLaneIndex === record.laneIndex) {
        record.nextLaneChangeAt = Math.min(record.nextLaneChangeAt, elapsed + this.getLaneChangeDelay(speed));

        if (elapsed >= record.nextLaneChangeAt) {
          this.maybeStartLaneChange(record, elapsed, speed);
        }
      }

      let lateralVelocity = 0;

      if (record.targetLaneIndex !== record.laneIndex && elapsed >= record.laneChangeMoveAt) {
        const deltaX = record.targetLaneX - record.body.position.x;
        const laneShiftSpeed = this.getLaneShiftSpeed(speed);
        lateralVelocity = THREE.MathUtils.clamp(deltaX * laneShiftSpeed, -laneShiftSpeed, laneShiftSpeed);

        if (Math.abs(deltaX) < 0.08) {
          record.body.position.x = record.targetLaneX;
          record.laneIndex = record.targetLaneIndex;
          record.laneX = record.targetLaneX;
          lateralVelocity = 0;
        }
      } else if (record.targetLaneIndex === record.laneIndex) {
        record.body.position.x = this.options.lanes[record.laneIndex];
      }

      record.body.velocity.x = lateralVelocity;
      record.body.velocity.y = 0;
      record.body.velocity.z = speed * record.speedFactor;
      record.body.position.y = record.halfExtents.y;
      this.updateIndicatorState(record, elapsed);
    }
  }

  syncAfterStep(delta, elapsed) {
    for (let index = this.activeCars.length - 1; index >= 0; index -= 1) {
      const record = this.activeCars[index];
      const bob = Math.sin(elapsed * this.options.bobSpeed + record.bobOffset) * this.options.bobAmplitude;

      record.group.position.set(
        record.body.position.x,
        record.body.position.y + bob,
        record.body.position.z
      );
      record.visualRig.rotation.z = Math.sin(elapsed * 1.8 + record.bobOffset) * this.options.bodyLeanAmplitude;
      record.visualRig.rotation.x = Math.sin(elapsed * 2.25 + record.bobOffset * 0.6) * this.options.bodyPitchAmplitude;
      this.animateWheels(record, delta);

      if (record.body.position.z > this.options.clearZ) {
        this.deactivateCar(index);
      }
    }
  }

  activateCar(elapsed = 0, speed = 0) {
    const record = this.inactiveCars.pop();

    if (!record) {
      return null;
    }

    const laneIndex = this.pickSpawnLaneIndex();
    const colorSet = this.options.colorPalette[Math.floor(Math.random() * this.options.colorPalette.length)];
    const scaleVariant = randomRange(this.options.sizeVarianceMin, this.options.sizeVarianceMax);

    record.active = true;
    record.laneIndex = laneIndex;
    record.targetLaneIndex = laneIndex;
    record.laneX = this.options.lanes[laneIndex];
    record.targetLaneX = record.laneX;
    record.speedFactor = randomRange(this.options.speedFactorMin, this.options.speedFactorMax);
    record.bobOffset = Math.random() * Math.PI * 2;
    record.scaleVariant = scaleVariant;
    record.wheelSpin = Math.random() * Math.PI * 2;
    record.nearMissed = false;
    record.collided = false;
    record.nextLaneChangeAt = elapsed + this.getLaneChangeDelay(speed);
    record.laneChangeMoveAt = elapsed;
    record.indicatorSide = "off";
    record.indicatorStopAt = elapsed;

    record.group.visible = true;
    this.updateBodyExtents(record, scaleVariant);
    record.visualRig.position.y = -record.halfExtents.y;
    record.visualRig.scale.setScalar(scaleVariant);

    record.body.position.set(record.laneX, record.halfExtents.y, this.options.spawnZ - Math.random() * 24);
    record.body.velocity.set(0, 0, 0);
    record.body.force.set(0, 0, 0);
    record.body.angularVelocity.set(0, 0, 0);
    record.body.quaternion.set(0, 0, 0, 1);
    record.group.position.set(record.body.position.x, record.body.position.y, record.body.position.z);

    if (!this.world.bodies.includes(record.body)) {
      this.world.addBody(record.body);
    }

    this.applyVariation(record, colorSet);

    if (this.gsap) {
      record.visualRig.scale.setScalar(scaleVariant * 0.92);
      this.gsap.to(record.visualRig.scale, {
        x: scaleVariant,
        y: scaleVariant,
        z: scaleVariant,
        duration: this.options.spawnRevealDuration,
        ease: "power2.out",
        overwrite: true
      });
    }

    this.activeCars.push(record);
    return record;
  }

  updateBodyExtents(record, scaleVariant) {
    record.halfExtents.set(
      this.baseHalfExtents.x * scaleVariant,
      this.baseHalfExtents.y * THREE.MathUtils.lerp(0.98, 1.04, Math.random()),
      this.baseHalfExtents.z * scaleVariant
    );
    this.applyBodyShape(record.body, record.halfExtents);
  }

  animateWheels(record, delta) {
    if (!record.wheels.length) {
      return;
    }

    record.wheelSpin -= record.body.velocity.z * delta * this.options.wheelSpinFactor;

    for (let index = 0; index < record.wheels.length; index += 1) {
      const wheel = record.wheels[index];
      const baseRotation = record.wheelBaseRotations.get(wheel.uuid);

      if (!baseRotation) {
        continue;
      }

      wheel.rotation.x = baseRotation.x + record.wheelSpin;
      wheel.rotation.y = baseRotation.y;
      wheel.rotation.z = baseRotation.z;
    }
  }

  maybeStartLaneChange(record, elapsed, speed) {
    const candidates = [];

    for (let index = 0; index < this.options.lanes.length; index += 1) {
      if (index === record.laneIndex) {
        continue;
      }

      if (this.isLaneOpen(index, record.body.position.z, record, speed)) {
        candidates.push(index);
      }
    }

    if (!candidates.length) {
      record.nextLaneChangeAt = elapsed + this.getLaneChangeDelay(speed);
      return;
    }

    const targetLaneIndex = candidates[Math.floor(Math.random() * candidates.length)];
    const laneChangeLead = this.getLaneChangeLead(speed);
    record.targetLaneIndex = targetLaneIndex;
    record.targetLaneX = this.options.lanes[targetLaneIndex];
    record.laneChangeMoveAt = elapsed + laneChangeLead;
    record.nextLaneChangeAt = elapsed + this.getLaneChangeDelay(speed);
    record.indicatorSide = targetLaneIndex > record.laneIndex ? "right" : "left";
    record.indicatorStopAt = elapsed + laneChangeLead + 0.65;
  }

  isLaneOpen(targetLaneIndex, zPosition, sourceRecord, speed = 0) {
    const targetX = this.options.lanes[targetLaneIndex];
    const safeGap = this.getLaneGap(speed);

    for (let index = 0; index < this.activeCars.length; index += 1) {
      const record = this.activeCars[index];

      if (record === sourceRecord) {
        continue;
      }

      const occupyingLane = record.targetLaneIndex === targetLaneIndex || Math.abs(record.body.position.x - targetX) < 0.5;
      const laneGap = Math.abs(record.body.position.z - zPosition);

      if (occupyingLane && laneGap < safeGap) {
        return false;
      }
    }

    return true;
  }

  pickSpawnLaneIndex() {
    const candidates = this.options.lanes
      .map((_, laneIndex) => laneIndex)
      .filter((laneIndex) => this.isLaneOpen(laneIndex, this.options.spawnZ + 12, null));

    const laneIndexes = candidates.length ? candidates : this.options.lanes.map((_, laneIndex) => laneIndex);
    return laneIndexes[Math.floor(Math.random() * laneIndexes.length)];
  }

  updateIndicatorState(record, elapsed) {
    const blinkOn = Math.floor(elapsed / 0.18) % 2 === 0;
    const leftOn = record.indicatorSide === "left" && elapsed <= record.indicatorStopAt && blinkOn;
    const rightOn = record.indicatorSide === "right" && elapsed <= record.indicatorStopAt && blinkOn;

    record.indicatorMaterials.left.forEach((material) => {
      material.color.setHex(leftOn ? 0xffc46a : 0x6a5434);
      material.opacity = leftOn ? 1 : 0.16;
    });

    record.indicatorMaterials.right.forEach((material) => {
      material.color.setHex(rightOn ? 0xffc46a : 0x6a5434);
      material.opacity = rightOn ? 1 : 0.16;
    });

    if (elapsed > record.indicatorStopAt) {
      record.indicatorSide = "off";
    }
  }

  applyVariation(record, colorSet) {
    record.visual.traverse((child) => {
      if (!child.isMesh || !child.material) {
        return;
      }

      const name = child.name.toLowerCase();

      if (name.includes("body")) {
        child.material.color.setHex(colorSet.body);
      } else if (name.includes("cabin")) {
        child.material.color.setHex(colorSet.cabin);
      } else if (name.includes("light") || name.includes("accent")) {
        child.material.color.setHex(colorSet.accent);
      }

      if ("emissive" in child.material && (name.includes("light") || name.includes("accent"))) {
        child.material.emissive = new THREE.Color(colorSet.accent);
        child.material.emissiveIntensity = 0.08;
      }
    });
  }

  deactivateCar(index) {
    const record = this.activeCars[index];

    if (!record) {
      return;
    }

    if (this.world.bodies.includes(record.body)) {
      this.world.removeBody(record.body);
    }

    record.group.visible = false;
    record.visualRig.rotation.set(0, 0, 0);
    record.visualRig.scale.setScalar(1);
    record.visualRig.position.y = -this.baseHalfExtents.y;
    record.body.velocity.set(0, 0, 0);
    record.body.force.set(0, 0, 0);
    record.targetLaneIndex = record.laneIndex;
    record.laneX = this.options.lanes[record.laneIndex];
    record.targetLaneX = record.laneX;
    record.indicatorSide = "off";
    record.collided = false;
    record.nearMissed = false;

    this.activeCars.splice(index, 1);
    this.inactiveCars.push(record);
  }

  getSpawnDelay(elapsed) {
    const progression = Math.min(elapsed / 75, 1);
    const minDelay = THREE.MathUtils.lerp(this.options.spawnMin, this.options.fastSpawnMin, progression);
    const maxDelay = THREE.MathUtils.lerp(this.options.spawnMax, this.options.fastSpawnMax, progression);
    return randomRange(minDelay, maxDelay);
  }
}
