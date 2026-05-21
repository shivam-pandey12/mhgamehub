import * as THREE from '../../vendor/three.js';

const materialCache = new Map();

const mat = (key, options) => {
  const cacheKey = `${key}:${JSON.stringify(options)}`;
  if (!materialCache.has(cacheKey)) {
    materialCache.set(cacheKey, new THREE.MeshStandardMaterial(options));
  }
  return materialCache.get(cacheKey);
};

const profilePoints = {
  hatchback: (l, h) => [
    [-l * 0.5, 0.08], [-l * 0.42, h * 0.54], [-l * 0.22, h * 0.72],
    [l * 0.12, h * 0.72], [l * 0.37, h * 0.48], [l * 0.5, h * 0.22], [l * 0.5, 0.04]
  ],
  coupe: (l, h) => [
    [-l * 0.5, 0.06], [-l * 0.37, h * 0.4], [-l * 0.05, h * 0.68],
    [l * 0.24, h * 0.62], [l * 0.47, h * 0.25], [l * 0.5, 0.05]
  ],
  suv: (l, h) => [
    [-l * 0.5, 0.08], [-l * 0.46, h * 0.67], [-l * 0.22, h * 0.82],
    [l * 0.28, h * 0.82], [l * 0.48, h * 0.58], [l * 0.5, 0.08]
  ],
  supercar: (l, h) => [
    [-l * 0.5, 0.05], [-l * 0.34, h * 0.34], [-l * 0.02, h * 0.68],
    [l * 0.22, h * 0.58], [l * 0.5, h * 0.12], [l * 0.5, 0.04]
  ],
  jeep: (l, h) => [
    [-l * 0.5, 0.06], [-l * 0.48, h * 0.66], [-l * 0.16, h * 0.78],
    [l * 0.28, h * 0.78], [l * 0.49, h * 0.6], [l * 0.5, 0.06]
  ],
  classic: (l, h) => [
    [-l * 0.5, 0.08], [-l * 0.43, h * 0.38], [-l * 0.1, h * 0.64],
    [l * 0.18, h * 0.62], [l * 0.42, h * 0.36], [l * 0.5, 0.08]
  ]
};

export class VehicleFactory {
  constructor() {
    this.shadowMaterial = mat('soft-shadow', {
      color: '#1a1e25',
      transparent: true,
      opacity: 0.22,
      roughness: 1
    });
  }

  createCarMesh(config, options = {}) {
    const group = new THREE.Group();
    group.name = config.name;
    const visual = config.visual;
    const colors = {
      ...config.colors,
      body: options.customization?.body ?? config.colors.body,
      accent: options.customization?.accent ?? config.colors.accent
    };
    const root = new THREE.Group();
    group.add(root);

    const bodyMat = mat(`body-${config.id}`, {
      color: colors.body,
      roughness: 0.37,
      metalness: 0.28
    });
    const secondaryMat = mat(`secondary-${config.id}`, {
      color: colors.secondary,
      roughness: 0.42,
      metalness: 0.2
    });
    const glassMat = mat(`glass-${config.id}`, {
      color: colors.glass,
      roughness: 0.08,
      metalness: 0.04,
      transparent: true,
      opacity: options.customization?.tintOpacity ?? 0.72
    });
    const accentMat = mat(`accent-${config.id}`, {
      color: colors.accent,
      roughness: 0.24,
      metalness: 0.68
    });
    const tireMat = mat('tire', { color: '#15181d', roughness: 0.78, metalness: 0.04 });
    const wheelStyle = options.customization?.wheelStyle ?? 'stock';
    const rimColor = wheelStyle === 'sport'
      ? '#202a38'
      : wheelStyle === 'classic'
        ? '#f2e7cf'
        : wheelStyle === 'offroad'
          ? '#9aa36b'
          : '#d7d9d6';
    const rimMat = mat(`rim-${wheelStyle}`, { color: rimColor, roughness: 0.24, metalness: 0.76 });
    const lightMat = mat(`lights-${config.id}`, {
      color: colors.lights,
      emissive: colors.lights,
      emissiveIntensity: 0.45,
      roughness: 0.2
    });
    const brakeMat = mat(`brake-${config.id}`, {
      color: colors.brake,
      emissive: colors.brake,
      emissiveIntensity: 0.1,
      roughness: 0.26
    });

    this.addProfileBody(root, visual, bodyMat);
    this.addLowerTrim(root, visual, secondaryMat, accentMat);
    this.addHood(root, visual, bodyMat, accentMat, config.id);
    this.addGlass(root, visual, glassMat, config.id);
    this.addInteriorHint(root, visual, secondaryMat, config.id);
    this.addLights(root, visual, lightMat, brakeMat);
    this.addHeadlightShapes(root, visual, lightMat, config.id);
    this.addSideMirrors(root, visual, secondaryMat);
    this.addWheelArches(root, visual, secondaryMat, config.id);
    this.addPanelLines(root, visual, secondaryMat);
    this.addLicensePlate(root, visual, config.id);
    this.addUniqueDetails(root, visual, config.id, bodyMat, secondaryMat, accentMat, tireMat, rimMat);
    this.addCarSpecificDetails(root, visual, config.id, bodyMat, secondaryMat, accentMat, tireMat, rimMat);

    const wheelRig = this.addWheels(root, visual, tireMat, rimMat, wheelStyle);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(Math.max(visual.width, visual.length) * 0.62, 28),
      this.shadowMaterial
    );
    shadow.rotation.x = -Math.PI * 0.5;
    shadow.scale.x = visual.width / visual.length;
    shadow.position.y = 0.015;
    shadow.position.z = -0.08;
    group.add(shadow);

    group.userData = {
      carId: config.id,
      root,
      wheels: wheelRig.wheels,
      frontWheels: wheelRig.frontWheels,
      brakeLights: wheelRig.brakeLights,
      exhausts: wheelRig.exhausts,
      boostTrailColor: options.customization?.boostTrail ?? '#67d9ff',
      body: root,
      dimensions: {
        length: visual.length,
        width: visual.width,
        height: visual.height,
        radius: Math.max(visual.length, visual.width) * 0.54
      }
    };

    if (options.preview) {
      group.scale.setScalar(1.18);
      group.rotation.y = Math.PI;
    }

    return group;
  }

  addProfileBody(root, visual, material) {
    const points = profilePoints[visual.type](visual.length, visual.height);
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
    shape.lineTo(points[0][0], points[0][1]);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: visual.width,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.055,
      bevelThickness: 0.055
    });
    geometry.translate(0, 0, -visual.width * 0.5);
    geometry.rotateY(-Math.PI * 0.5);
    geometry.computeVertexNormals();

    const body = new THREE.Mesh(geometry, material);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = visual.rideHeight;
    root.add(body);
  }

  addLowerTrim(root, visual, secondaryMat, accentMat) {
    const lower = new THREE.Mesh(
      new THREE.BoxGeometry(visual.width * 0.96, 0.18, visual.length * 0.9),
      secondaryMat
    );
    lower.position.set(0, visual.rideHeight + 0.17, -0.02);
    lower.castShadow = true;
    root.add(lower);

    const frontBumper = new THREE.Mesh(
      new THREE.BoxGeometry(visual.width * 0.82, 0.18, 0.18),
      accentMat
    );
    frontBumper.position.set(0, visual.rideHeight + 0.28, visual.length * 0.5 + 0.04);
    frontBumper.castShadow = true;
    root.add(frontBumper);

    const rearBumper = frontBumper.clone();
    rearBumper.position.z = -visual.length * 0.5 - 0.04;
    root.add(rearBumper);
  }

  addHood(root, visual, bodyMat, accentMat, id) {
    const hoodLength = visual.length * (id === 'classic' ? 0.36 : id === 'hatchback' ? 0.24 : 0.31);
    const hood = new THREE.Mesh(
      new THREE.BoxGeometry(visual.width * 0.78, 0.035, hoodLength),
      bodyMat
    );
    hood.position.set(0, visual.rideHeight + visual.height * 0.6, visual.length * 0.28);
    hood.rotation.x = id === 'supercar' ? -0.08 : id === 'classic' ? 0.08 : -0.035;
    root.add(hood);

    const centerLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.04, hoodLength * 0.92),
      accentMat
    );
    centerLine.position.copy(hood.position);
    centerLine.position.y += 0.025;
    root.add(centerLine);
  }

  addInteriorHint(root, visual, material, id) {
    const seatWidth = visual.width * 0.18;
    const seatHeight = visual.height * 0.22;
    const seatZ = id === 'classic' ? -visual.length * 0.05 : -visual.length * 0.02;
    [-1, 1].forEach((side) => {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(seatWidth, seatHeight, visual.length * 0.14), material);
      seat.position.set(side * visual.width * 0.18, visual.rideHeight + visual.height * 0.6, seatZ);
      seat.userData.firstPersonCull = true;
      root.add(seat);
    });
    const dash = new THREE.Mesh(new THREE.BoxGeometry(visual.width * 0.5, 0.08, 0.12), material);
    dash.position.set(0, visual.rideHeight + visual.height * 0.58, visual.length * 0.14);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.014, 8, 18), material);
    wheel.position.set(-visual.width * 0.16, visual.rideHeight + visual.height * 0.62, visual.length * 0.19);
    wheel.rotation.x = Math.PI * 0.5;
    dash.userData.firstPersonCull = true;
    wheel.userData.firstPersonCull = true;
    root.add(dash, wheel);
  }

  addSideMirrors(root, visual, material) {
    [-1, 1].forEach((side) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.24), material);
      arm.position.set(side * visual.width * 0.47, visual.rideHeight + visual.height * 0.68, visual.length * 0.14);
      arm.rotation.y = side * 0.24;
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.08), material);
      mirror.position.set(side * visual.width * 0.56, visual.rideHeight + visual.height * 0.69, visual.length * 0.18);
      mirror.rotation.y = side * 0.26;
      root.add(arm, mirror);
    });
  }

  addWheelArches(root, visual, material, id) {
    const wheelZ = visual.length * 0.33;
    const archX = visual.width * 0.53;
    const archRadius = visual.wheelRadius * (id === 'offroad-jeep' ? 1.18 : 1.05);
    [-1, 1].forEach((side) => {
      [-1, 1].forEach((axle) => {
        const arch = new THREE.Mesh(
          new THREE.TorusGeometry(archRadius, 0.045, 8, 24),
          material
        );
        arch.rotation.y = Math.PI * 0.5;
        arch.scale.y = 0.72;
        arch.position.set(side * archX, visual.wheelRadius + 0.16, axle * wheelZ);
        root.add(arch);
      });
    });
  }

  addPanelLines(root, visual, material) {
    [-1, 1].forEach((side) => {
      const beltLine = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, visual.length * 0.74), material);
      beltLine.position.set(side * visual.width * 0.502, visual.rideHeight + visual.height * 0.48, -visual.length * 0.02);
      root.add(beltLine);
      const doorLine = new THREE.Mesh(new THREE.BoxGeometry(0.04, visual.height * 0.33, 0.035), material);
      doorLine.position.set(side * visual.width * 0.505, visual.rideHeight + visual.height * 0.48, -visual.length * 0.04);
      root.add(doorLine);
    });
  }

  addLicensePlate(root, visual, id) {
    const plateMat = mat(`plate-${id}`, { color: '#fffaf0', roughness: 0.35, metalness: 0.05 });
    [-1, 1].forEach((zSide) => {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(visual.width * 0.32, 0.12, 0.035), plateMat);
      plate.position.set(0, visual.rideHeight + visual.height * 0.28, zSide * visual.length * 0.535);
      root.add(plate);
    });
  }

  addHeadlightShapes(root, visual, lightMat, id) {
    if (id === 'classic') return;
    [-1, 1].forEach((side) => {
      const sharp = id === 'supercar' || id === 'sports-coupe';
      const lamp = new THREE.Mesh(
        sharp
          ? new THREE.BoxGeometry(visual.width * 0.2, 0.055, 0.08)
          : new THREE.SphereGeometry(0.105, 12, 8),
        lightMat
      );
      lamp.position.set(side * visual.width * 0.29, visual.rideHeight + visual.height * 0.43, visual.length * 0.545);
      lamp.rotation.z = side * (sharp ? 0.22 : 0);
      root.add(lamp);
    });
  }

  addGlass(root, visual, material, id) {
    const cabinLength = visual.length * (id === 'classic' ? 0.42 : id === 'jeep' ? 0.48 : 0.38);
    const cabinWidth = visual.width * 0.72;
    const cabinHeight = visual.height * (id === 'suv' || id === 'jeep' ? 0.34 : 0.28);
    const cabinZ = id === 'hatchback' || id === 'suv' || id === 'jeep' ? -visual.length * 0.08 : -visual.length * 0.04;
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(cabinWidth, cabinHeight, cabinLength),
      material
    );
    cabin.position.set(0, visual.rideHeight + visual.height * 0.72, cabinZ);
    cabin.castShadow = true;
    cabin.userData.firstPersonCull = true;
    root.add(cabin);

    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(cabinWidth * 0.86, cabinHeight * 0.78, 0.035),
      material
    );
    windshield.position.set(0, cabin.position.y - cabinHeight * 0.08, cabinZ + cabinLength * 0.52);
    windshield.rotation.x = -0.22;
    windshield.userData.firstPersonCull = true;
    root.add(windshield);

    const rearWindow = windshield.clone();
    rearWindow.position.z = cabinZ - cabinLength * 0.52;
    rearWindow.rotation.x = 0.2;
    rearWindow.userData.firstPersonCull = true;
    root.add(rearWindow);
  }

  addLights(root, visual, lightMat, brakeMat) {
    const frontY = visual.rideHeight + visual.height * 0.32;
    const rearY = visual.rideHeight + visual.height * 0.32;
    const lightSize = [visual.width * 0.18, 0.12, 0.045];
    [-1, 1].forEach((side) => {
      const headlight = new THREE.Mesh(new THREE.BoxGeometry(...lightSize), lightMat);
      headlight.position.set(side * visual.width * 0.31, frontY, visual.length * 0.51);
      root.add(headlight);

      const brake = new THREE.Mesh(new THREE.BoxGeometry(...lightSize), brakeMat.clone());
      brake.position.set(side * visual.width * 0.31, rearY, -visual.length * 0.51);
      root.add(brake);
      root.userData.brakeLights = root.userData.brakeLights ?? [];
      root.userData.brakeLights.push(brake);
    });
  }

  addWheels(root, visual, tireMat, rimMat, wheelStyle = 'stock') {
    const wheelZ = visual.length * 0.33;
    const wheelX = visual.width * 0.52;
    const wheels = [];
    const frontWheels = [];
    const brakeLights = root.userData.brakeLights ?? [];
    const exhausts = [];
    [-1, 1].forEach((side) => {
      [-1, 1].forEach((axle) => {
        const pivot = new THREE.Group();
        pivot.position.set(side * wheelX, visual.wheelRadius + 0.06, axle * wheelZ);
        const tire = new THREE.Mesh(
          new THREE.CylinderGeometry(visual.wheelRadius, visual.wheelRadius, visual.wheelWidth, 18),
          tireMat
        );
        tire.rotation.z = Math.PI * 0.5;
        tire.castShadow = true;
        const rim = new THREE.Mesh(
          new THREE.CylinderGeometry(visual.wheelRadius * 0.52, visual.wheelRadius * 0.52, visual.wheelWidth * 1.04, 14),
          rimMat
        );
        rim.rotation.z = Math.PI * 0.5;
        pivot.add(tire, rim);
        if (wheelStyle === 'sport' || wheelStyle === 'classic') {
          for (let i = 0; i < 5; i += 1) {
            const spoke = new THREE.Mesh(
              new THREE.BoxGeometry(visual.wheelRadius * 0.08, visual.wheelWidth * 1.08, visual.wheelRadius * 0.76),
              rimMat
            );
            spoke.rotation.z = Math.PI * 0.5;
            spoke.rotation.y = (i / 5) * Math.PI;
            pivot.add(spoke);
          }
        }
        root.add(pivot);
        wheels.push({ pivot, tire, side, axle });
        if (axle > 0) frontWheels.push(pivot);
      });

      const exhaust = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.42, 10),
        rimMat
      );
      exhaust.rotation.x = Math.PI * 0.5;
      exhaust.position.set(side * visual.width * 0.24, visual.rideHeight + 0.14, -visual.length * 0.56);
      root.add(exhaust);
      exhausts.push(exhaust);
    });
    return { wheels, frontWheels, brakeLights, exhausts };
  }

  addUniqueDetails(root, visual, id, bodyMat, secondaryMat, accentMat, tireMat, rimMat) {
    if (visual.spoiler) {
      const spoiler = new THREE.Group();
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(visual.width * (visual.spoiler === 'wing' ? 0.94 : 0.72), 0.08, 0.2),
        accentMat
      );
      blade.position.y = visual.rideHeight + visual.height * (visual.spoiler === 'lip' ? 0.58 : 0.78);
      blade.position.z = -visual.length * 0.48;
      spoiler.add(blade);
      if (visual.spoiler !== 'lip') {
        [-1, 1].forEach((side) => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.06), secondaryMat);
          post.position.set(side * visual.width * 0.31, blade.position.y - 0.22, blade.position.z + 0.02);
          spoiler.add(post);
        });
      }
      root.add(spoiler);
    }

    if (visual.roofRails) {
      [-1, 1].forEach((side) => {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.08, visual.length * 0.42),
          accentMat
        );
        rail.position.set(side * visual.width * 0.32, visual.rideHeight + visual.height * 1.05, -visual.length * 0.05);
        root.add(rail);
      });
    }

    if (visual.rollCage) {
      [-1, 1].forEach((side) => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, visual.height * 0.58, 0.08), secondaryMat);
        rail.position.set(side * visual.width * 0.36, visual.rideHeight + visual.height * 0.82, -visual.length * 0.04);
        root.add(rail);
      });
      const top = new THREE.Mesh(new THREE.BoxGeometry(visual.width * 0.82, 0.08, visual.length * 0.45), secondaryMat);
      top.position.set(0, visual.rideHeight + visual.height * 1.1, -visual.length * 0.04);
      root.add(top);
    }

    if (visual.spareTire) {
      const spare = new THREE.Mesh(
        new THREE.TorusGeometry(visual.wheelRadius * 0.7, visual.wheelRadius * 0.18, 10, 20),
        tireMat
      );
      spare.rotation.y = Math.PI * 0.5;
      spare.position.set(0, visual.rideHeight + visual.height * 0.45, -visual.length * 0.57);
      root.add(spare);
    }

    if (visual.diffuser) {
      const diffuser = new THREE.Mesh(
        new THREE.BoxGeometry(visual.width * 0.82, 0.16, 0.34),
        secondaryMat
      );
      diffuser.position.set(0, visual.rideHeight + 0.14, -visual.length * 0.52);
      diffuser.rotation.x = -0.18;
      root.add(diffuser);
    }

    if (visual.chrome) {
      [-1, 1].forEach((z) => {
        const chrome = new THREE.Mesh(
          new THREE.BoxGeometry(visual.width * 0.9, 0.12, 0.12),
          rimMat
        );
        chrome.position.set(0, visual.rideHeight + 0.3, z * visual.length * 0.54);
        root.add(chrome);
      });
      [-1, 1].forEach((side) => {
        const roundLamp = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 8),
          mat(`classic-lamp-${side}`, {
            color: '#fff5c2',
            emissive: '#fff5c2',
            emissiveIntensity: 0.35
          })
        );
        roundLamp.position.set(side * visual.width * 0.24, visual.rideHeight + visual.height * 0.42, visual.length * 0.54);
        root.add(roundLamp);
      });
    }

    if (id === 'supercar' || id === 'coupe') {
      [-1, 1].forEach((side) => {
        const intake = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.56), secondaryMat);
        intake.position.set(side * visual.width * 0.51, visual.rideHeight + visual.height * 0.36, -visual.length * 0.08);
        root.add(intake);
      });
    }

    if (id === 'hatchback') {
      const roofAccent = new THREE.Mesh(
        new THREE.BoxGeometry(visual.width * 0.5, 0.045, visual.length * 0.28),
        accentMat
      );
      roofAccent.position.set(0, visual.rideHeight + visual.height * 1.02, -visual.length * 0.08);
      root.add(roofAccent);
    }
  }

  addCarSpecificDetails(root, visual, id, bodyMat, secondaryMat, accentMat, tireMat, rimMat) {
    if (id === 'sports-coupe' || id === 'supercar') {
      [-1, 1].forEach((side) => {
        const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, visual.length * 0.62), accentMat);
        skirt.position.set(side * visual.width * 0.54, visual.rideHeight + 0.24, -visual.length * 0.02);
        root.add(skirt);
      });
    }

    if (id === 'supercar') {
      [-1, 1].forEach((side) => {
        const intake = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.42), secondaryMat);
        intake.position.set(side * visual.width * 0.38, visual.rideHeight + visual.height * 0.46, -visual.length * 0.22);
        intake.rotation.y = side * -0.18;
        root.add(intake);
      });
      const splitter = new THREE.Mesh(new THREE.BoxGeometry(visual.width * 0.86, 0.055, 0.3), accentMat);
      splitter.position.set(0, visual.rideHeight + 0.12, visual.length * 0.58);
      root.add(splitter);
    }

    if (id === 'offroad-jeep') {
      [-1, 1].forEach((side) => {
        [-1, 1].forEach((axle) => {
          const flare = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.18, visual.length * 0.2), secondaryMat);
          flare.position.set(side * visual.width * 0.58, visual.rideHeight + visual.height * 0.34, axle * visual.length * 0.33);
          root.add(flare);
        });
      });
      for (let i = -2; i <= 2; i += 1) {
        const roofLight = new THREE.Mesh(
          new THREE.SphereGeometry(0.095, 10, 8),
          mat(`jeep-roof-light-${i}`, { color: '#fff2b6', emissive: '#fff2b6', emissiveIntensity: 0.42 })
        );
        roofLight.position.set(i * 0.18, visual.rideHeight + visual.height * 1.16, visual.length * 0.2);
        root.add(roofLight);
      }
    }

    if (id === 'suv') {
      const trunkPanel = new THREE.Mesh(new THREE.BoxGeometry(visual.width * 0.74, visual.height * 0.34, 0.08), bodyMat);
      trunkPanel.position.set(0, visual.rideHeight + visual.height * 0.48, -visual.length * 0.49);
      root.add(trunkPanel);
    }

    if (id === 'hatchback') {
      const smileBumper = new THREE.Mesh(new THREE.BoxGeometry(visual.width * 0.58, 0.08, 0.08), accentMat);
      smileBumper.position.set(0, visual.rideHeight + visual.height * 0.24, visual.length * 0.56);
      root.add(smileBumper);
    }

    if (id === 'classic') {
      const hoodDome = new THREE.Mesh(new THREE.SphereGeometry(0.72, 18, 10), bodyMat);
      hoodDome.scale.set(visual.width * 0.78, 0.22, visual.length * 0.28);
      hoodDome.position.set(0, visual.rideHeight + visual.height * 0.55, visual.length * 0.23);
      root.add(hoodDome);
      [-1, 1].forEach((side) => {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.52), rimMat);
        fin.position.set(side * visual.width * 0.42, visual.rideHeight + visual.height * 0.45, -visual.length * 0.38);
        root.add(fin);
      });
    }
  }
}
