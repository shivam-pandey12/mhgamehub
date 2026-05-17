import * as THREE from 'three';
import { COLORS } from '../config.js';

export class VehicleFactory {
  constructor() {
    this.materials = {
      rubber: new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.62, metalness: 0.12 }),
      rim: new THREE.MeshStandardMaterial({ color: 0x9ba3a7, roughness: 0.34, metalness: 0.72 }),
      glass: new THREE.MeshStandardMaterial({
        color: 0x121f2a,
        emissive: 0x07131e,
        roughness: 0.18,
        metalness: 0.1,
      }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x121418, roughness: 0.48, metalness: 0.44 }),
      armor: new THREE.MeshStandardMaterial({ color: 0x25282c, roughness: 0.55, metalness: 0.42 }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xb9c4ca, roughness: 0.18, metalness: 0.8 }),
      redLight: new THREE.MeshBasicMaterial({ color: COLORS.policeRed }),
      blueLight: new THREE.MeshBasicMaterial({ color: COLORS.policeBlue }),
      amberLight: new THREE.MeshBasicMaterial({ color: COLORS.robberAccent }),
      headlight: new THREE.MeshBasicMaterial({ color: 0xf6fbff }),
      brake: new THREE.MeshBasicMaterial({ color: 0xff1830 }),
    };
  }

  create(type) {
    if (type === 'armored-muscle') return this.createRobber();
    if (type === 'interceptor') return this.createPolice();
    if (type === 'heavy-raider') return this.createHeavyRaider();
    if (type === 'speed-demon-coupe') return this.createSpeedDemon();
    if (type === 'swat-charger') return this.createSwatCharger();
    if (type === 'rapid-interceptor') return this.createRapidInterceptor();
    if (type === 'captain') return this.createCaptain();
    if (type === 'robber') return this.createRobber();
    if (type === 'swat') return this.createSwat();
    return this.createPolice();
  }

  createHeavyRaider() {
    const visual = this.createRobber();
    visual.group.name = 'HeavyRaiderSUV';
    visual.group.scale.set(1.12, 1.06, 1.1);
    visual.length *= 1.1;
    visual.width *= 1.12;

    const roofArmor = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.28, 2.9), this.materials.armor);
    roofArmor.position.set(0, 3.34, -0.5);
    roofArmor.castShadow = true;
    visual.group.add(roofArmor);

    const sideRails = [-1, 1].map((side) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 5.7), this.materials.darkMetal);
      rail.position.set(side * 2.16, 2.08, -0.25);
      rail.castShadow = true;
      return rail;
    });
    visual.group.add(...sideRails);
    return visual;
  }

  createSwatCharger() {
    const visual = this.createSwat();
    visual.group.name = 'SwatCharger';
    visual.group.scale.set(0.96, 0.95, 0.98);

    const chargerStripe = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 4.7), this.materials.chrome);
    chargerStripe.position.set(0, 2.46, -0.25);
    chargerStripe.castShadow = true;
    visual.group.add(chargerStripe);
    return visual;
  }

  createSpeedDemon() {
    const visual = this.createRobber();
    visual.group.name = 'SpeedDemonCoupe';
    visual.group.scale.set(0.82, 0.78, 0.84);
    visual.length *= 0.86;
    visual.width *= 0.86;
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.16, 0.42), this.materials.chrome);
    spoiler.position.set(0, 2.1, -3.72);
    spoiler.castShadow = true;
    visual.group.add(spoiler);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 5.8), this.materials.amberLight);
    stripe.position.set(0, 2.18, 0.05);
    visual.group.add(stripe);
    return visual;
  }

  createRapidInterceptor() {
    const visual = this.createPolice();
    visual.group.name = 'RapidInterceptor';
    visual.group.scale.set(0.86, 0.86, 0.88);
    visual.length *= 0.9;
    visual.width *= 0.9;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 1.25), this.materials.blueLight);
    fin.position.set(0, 2.65, -2.65);
    fin.castShadow = true;
    visual.group.add(fin);
    return visual;
  }

  createCaptain() {
    const visual = this.createSwat();
    visual.group.name = 'PoliceCaptainCar';
    const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.14, 24), this.materials.amberLight);
    marker.position.set(0, 3.72, -0.62);
    marker.rotation.x = Math.PI / 2;
    visual.group.add(marker);

    const badge = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 0.76), this.materials.chrome);
    badge.position.set(0, 2.9, 1.65);
    badge.castShadow = true;
    visual.group.add(badge);
    return visual;
  }

  createRobber() {
    const group = new THREE.Group();
    group.name = 'ArmoredRobberVehicle';
    const parts = this.createCommonParts();
    const length = 7.6;
    const width = 3.55;

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.robber,
      roughness: 0.38,
      metalness: 0.45,
      emissive: 0x120604,
    });
    const accentMaterial = new THREE.MeshBasicMaterial({ color: COLORS.robberAccent });

    const body = new THREE.Mesh(this.makeHullGeometry(length, width, 1.55, 0.78), bodyMaterial);
    body.position.y = 0.68;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const cabin = new THREE.Mesh(this.makeHullGeometry(3.7, 2.25, 1.25, 0.5), this.materials.glass);
    cabin.position.set(-0.05, 1.8, -0.45);
    cabin.castShadow = true;
    group.add(cabin);

    const hoodArmor = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.22, 2.25), this.materials.armor);
    hoodArmor.position.set(0, 2.0, 2.1);
    hoodArmor.rotation.x = -0.08;
    hoodArmor.castShadow = true;
    group.add(hoodArmor);

    for (const z of [-1.9, -0.9, 0.35]) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.16, 0.18), this.materials.armor);
      rib.position.set(0, 2.08, z);
      rib.castShadow = true;
      group.add(rib);
    }

    const ram = new THREE.Mesh(new THREE.BoxGeometry(4.25, 0.64, 0.62), this.materials.darkMetal);
    ram.position.set(0, 1.02, 4.15);
    ram.castShadow = true;
    group.add(ram);
    const ramLower = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.28, 0.42), this.materials.chrome);
    ramLower.position.set(0, 0.58, 4.42);
    ramLower.castShadow = true;
    group.add(ramLower);
    for (const x of [-1.45, 1.45]) {
      const tusk = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 1.3), this.materials.chrome);
      tusk.position.set(x, 1.05, 4.75);
      tusk.rotation.x = -0.28;
      tusk.castShadow = true;
      group.add(tusk);
    }

    for (const side of [-1, 1]) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.86, 4.8), this.materials.armor);
      plate.position.set(side * 1.92, 1.35, -0.1);
      plate.rotation.z = side * 0.07;
      plate.castShadow = true;
      group.add(plate);

      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 1.4), accentMaterial);
      vent.position.set(side * 1.96, 1.72, 1.6);
      group.add(vent);
    }

    const turret = new THREE.Group();
    turret.position.set(0, 3.05, -0.35);
    const turretBase = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.72, 0.36, 18), this.materials.darkMetal);
    turretBase.castShadow = true;
    turret.add(turretBase);
    const turretGun = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 1.9, 10), this.materials.chrome);
    turretGun.rotation.x = Math.PI / 2;
    turretGun.position.set(0, 0.07, 1.07);
    turretGun.userData.restZ = turretGun.position.z;
    turretGun.castShadow = true;
    turret.add(turretGun);
    group.add(turret);
    parts.turrets.push(turret);
    parts.turretBarrels.push(turretGun);
    parts.weaponNozzles.push({
      side: 'turret',
      omni: true,
      baseLocal: new THREE.Vector3(0, 3.12, -0.35),
      length: 2.05,
      direction: new THREE.Vector3(0, 0, 1),
      turret,
    });

    this.addWeaponNozzles(group, parts, width, length, 'robber');

    for (const x of [-1.15, 1.15]) {
      const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 1.1, 12), this.materials.chrome);
      exhaust.rotation.x = Math.PI / 2;
      exhaust.position.set(x, 0.9, -4.05);
      group.add(exhaust);
    }

    this.addLights(group, parts, width, length, 'robber');
    this.addWheels(group, parts, width, length, 0.74, true);
    this.addDamagePanels(group, parts, width, length, 'robber');
    this.addHealthBar(group, parts);

    return { group, parts, length, width };
  }

  createPolice() {
    const group = new THREE.Group();
    group.name = 'PoliceInterceptor';
    const parts = this.createCommonParts();
    const length = 6.85;
    const width = 3.05;

    const white = new THREE.MeshStandardMaterial({ color: COLORS.police, roughness: 0.31, metalness: 0.32 });
    const dark = new THREE.MeshStandardMaterial({ color: COLORS.policeDark, roughness: 0.38, metalness: 0.4 });

    const body = new THREE.Mesh(this.makeHullGeometry(length, width, 1.18, 0.52), white);
    body.position.y = 0.62;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(width + 0.05, 0.08, 2.25), dark);
    stripe.position.set(0, 1.23, -0.4);
    stripe.castShadow = true;
    group.add(stripe);

    const cabin = new THREE.Mesh(this.makeHullGeometry(3.15, 2.02, 1.02, 0.44), this.materials.glass);
    cabin.position.set(0, 1.55, -0.42);
    cabin.castShadow = true;
    group.add(cabin);

    const pushBumper = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.45, 0.34), this.materials.darkMetal);
    pushBumper.position.set(0, 0.88, 3.65);
    pushBumper.castShadow = true;
    group.add(pushBumper);
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 0.9), this.materials.chrome);
    splitter.position.set(0, 0.52, 3.48);
    splitter.castShadow = true;
    group.add(splitter);

    const lightBarBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 0.62), this.materials.darkMetal);
    lightBarBase.position.set(0, 2.65, -0.52);
    group.add(lightBarBase);
    for (const [x, material] of [
      [-0.62, this.materials.redLight],
      [0.62, this.materials.blueLight],
    ]) {
      const light = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.32, 0.66), material);
      light.position.set(x, 2.8, -0.52);
      group.add(light);
      parts.sirens.push(light);
    }

    this.addPoliceMarkings(group, width);
    this.addWeaponNozzles(group, parts, width, length, 'police');
    this.addLights(group, parts, width, length, 'police');
    this.addWheels(group, parts, width, length, 0.62, false);
    this.addDamagePanels(group, parts, width, length, 'police');
    this.addHealthBar(group, parts);

    return { group, parts, length, width };
  }

  createSwat() {
    const group = new THREE.Group();
    group.name = 'HeavyPoliceSUV';
    const parts = this.createCommonParts();
    const length = 7.2;
    const width = 3.55;

    const bodyMaterial = new THREE.MeshStandardMaterial({ color: COLORS.swat, roughness: 0.48, metalness: 0.42 });
    const armor = new THREE.MeshStandardMaterial({ color: 0x2f3940, roughness: 0.52, metalness: 0.42 });

    const body = new THREE.Mesh(this.makeHullGeometry(length, width, 1.78, 0.66), bodyMaterial);
    body.position.y = 0.75;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const cabin = new THREE.Mesh(this.makeHullGeometry(4.25, 2.42, 1.12, 0.38), this.materials.glass);
    cabin.position.set(0, 2.05, -0.45);
    cabin.castShadow = true;
    group.add(cabin);

    const roofRack = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.18, 2.8), armor);
    roofRack.position.set(0, 3.18, -0.7);
    roofRack.castShadow = true;
    group.add(roofRack);
    const armoredWindshield = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, 0.18), this.materials.armor);
    armoredWindshield.position.set(0, 2.62, 1.25);
    group.add(armoredWindshield);

    const ram = new THREE.Mesh(new THREE.BoxGeometry(4.05, 0.7, 0.48), this.materials.darkMetal);
    ram.position.set(0, 1.05, 3.85);
    group.add(ram);

    for (const side of [-1, 1]) {
      const sidePlate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.96, 5.2), armor);
      sidePlate.position.set(side * 1.95, 1.55, -0.15);
      sidePlate.castShadow = true;
      group.add(sidePlate);
    }

    const lightA = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.24, 0.56), this.materials.redLight);
    lightA.position.set(-0.55, 3.35, -0.6);
    const lightB = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.24, 0.56), this.materials.blueLight);
    lightB.position.set(0.55, 3.35, -0.6);
    group.add(lightA, lightB);
    parts.sirens.push(lightA, lightB);

    this.addPoliceMarkings(group, width, 'SWAT');
    this.addWeaponNozzles(group, parts, width, length, 'swat');
    this.addLights(group, parts, width, length, 'swat');
    this.addWheels(group, parts, width, length, 0.78, true);
    this.addDamagePanels(group, parts, width, length, 'swat');
    this.addHealthBar(group, parts);

    return { group, parts, length, width };
  }

  createCommonParts() {
    return {
      wheels: [],
      frontWheels: [],
      brakeLights: [],
      headlights: [],
      sirens: [],
      healthBar: null,
      healthFill: null,
      damagePanels: [],
      firePoints: [],
      crackedGlass: [],
      weaponNozzles: [],
      turrets: [],
      turretBarrels: [],
    };
  }

  makeHullGeometry(length, width, height, taper) {
    const w = width / 2;
    const l = length / 2;
    const topW = w * (1 - taper * 0.28);
    const noseW = w * (1 - taper * 0.38);
    const vertices = new Float32Array([
      -w, 0, -l,
      w, 0, -l,
      w, 0, l,
      -w, 0, l,
      -topW, height * 0.72, -l * 0.76,
      topW, height * 0.72, -l * 0.76,
      noseW, height, l * 0.78,
      -noseW, height, l * 0.78,
    ]);
    const indices = [
      0, 1, 2, 0, 2, 3,
      4, 7, 6, 4, 6, 5,
      0, 4, 5, 0, 5, 1,
      1, 5, 6, 1, 6, 2,
      2, 6, 7, 2, 7, 3,
      3, 7, 4, 3, 4, 0,
    ];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  addWheels(group, parts, width, length, radius, heavy) {
    const wheelGeometry = new THREE.CylinderGeometry(radius, radius, heavy ? 0.78 : 0.58, 22);
    const rimGeometry = new THREE.CylinderGeometry(radius * 0.48, radius * 0.48, heavy ? 0.82 : 0.62, 18);
    const positions = [
      [-width * 0.55, 0.72, length * 0.32, true],
      [width * 0.55, 0.72, length * 0.32, true],
      [-width * 0.55, 0.72, -length * 0.34, false],
      [width * 0.55, 0.72, -length * 0.34, false],
    ];
    for (const [x, y, z, front] of positions) {
      const pivot = new THREE.Group();
      pivot.position.set(x, y, z);
      const tire = new THREE.Mesh(wheelGeometry, this.materials.rubber);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      const rim = new THREE.Mesh(rimGeometry, this.materials.rim);
      rim.rotation.z = Math.PI / 2;
      pivot.add(tire, rim);
      group.add(pivot);
      parts.wheels.push(tire);
      if (front) parts.frontWheels.push(pivot);
    }
  }

  addLights(group, parts, width, length, style) {
    const headWidth = style === 'robber' ? 0.66 : 0.54;
    for (const side of [-1, 1]) {
      const head = new THREE.Mesh(new THREE.BoxGeometry(headWidth, 0.24, 0.12), this.materials.headlight);
      head.position.set(side * width * 0.28, 1.15, length * 0.51);
      group.add(head);
      parts.headlights.push(head);

      const brake = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.12), this.materials.brake.clone());
      brake.position.set(side * width * 0.28, 1.08, -length * 0.51);
      group.add(brake);
      parts.brakeLights.push(brake);
    }

    if (style === 'robber') {
      for (const side of [-1, 1]) {
        const accent = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 1.3), this.materials.amberLight);
        accent.position.set(side * width * 0.53, 1.92, length * 0.08);
        group.add(accent);
      }
    }
  }

  addWeaponNozzles(group, parts, width, length, style = 'robber') {
    const barrelMaterial = style === 'robber' ? this.materials.chrome : this.materials.darkMetal;
    const mountMaterial = style === 'robber' ? this.materials.darkMetal : this.materials.chrome;
    const barrelGeometry = new THREE.CylinderGeometry(0.075, 0.095, 0.76, 10);
    const mountGeometry = new THREE.BoxGeometry(0.34, 0.22, 0.28);
    const axis = new THREE.Vector3(0, 1, 0);
    const y = style === 'robber' ? 1.18 : 1.06;
    const points = [
      { side: 'front', dir: new THREE.Vector3(0, 0, 1), positions: [[-width * 0.28, y, length * 0.54], [width * 0.28, y, length * 0.54]] },
      { side: 'rear', dir: new THREE.Vector3(0, 0, -1), positions: [[-width * 0.28, y * 0.8, -length * 0.54], [width * 0.28, y * 0.8, -length * 0.54]] },
      { side: 'left', dir: new THREE.Vector3(-1, 0, 0), positions: [[-width * 0.57, y + 0.1, -length * 0.16], [-width * 0.57, y + 0.1, length * 0.16]] },
      { side: 'right', dir: new THREE.Vector3(1, 0, 0), positions: [[width * 0.57, y + 0.1, -length * 0.16], [width * 0.57, y + 0.1, length * 0.16]] },
    ];

    for (const point of points) {
      const direction = point.dir.clone().normalize();
      for (const position of point.positions) {
        const local = new THREE.Vector3(...position);
        const mount = new THREE.Mesh(mountGeometry, mountMaterial);
        mount.position.copy(local).add(direction.clone().multiplyScalar(-0.1));
        mount.castShadow = true;

        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.position.copy(local).add(direction.clone().multiplyScalar(0.32));
        barrel.quaternion.setFromUnitVectors(axis, direction);
        barrel.castShadow = true;
        group.add(mount, barrel);

        parts.weaponNozzles.push({
          side: point.side,
          local: local.clone().add(direction.clone().multiplyScalar(0.74)),
          direction,
        });
      }
    }
  }

  addDamagePanels(group, parts, width, length, style) {
    const scratchMaterial = new THREE.MeshBasicMaterial({ color: 0x151515, transparent: true, opacity: 0, depthWrite: false });
    const scorchMaterial = new THREE.MeshBasicMaterial({ color: 0x3a1208, transparent: true, opacity: 0, depthWrite: false });
    for (const [x, y, z, rot] of [
      [-width * 0.48, 1.55, -length * 0.05, Math.PI / 2],
      [width * 0.48, 1.45, length * 0.15, -Math.PI / 2],
      [0, 2.24, length * 0.12, 0],
    ]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.18), scratchMaterial.clone());
      panel.position.set(x, y, z);
      panel.rotation.y = rot;
      panel.rotation.z = 0.25;
      group.add(panel);
      parts.damagePanels.push(panel);
    }
    const firePoint = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), scorchMaterial);
    firePoint.position.set(style === 'robber' ? -0.8 : 0.8, 1.65, -length * 0.42);
    firePoint.visible = false;
    group.add(firePoint);
    parts.firePoints.push(firePoint);

    const crackMaterial = new THREE.MeshBasicMaterial({
      color: 0xd8f3ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const crack = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.72), crackMaterial);
    crack.position.set(0, 2.15, length * 0.14);
    crack.rotation.x = -0.18;
    group.add(crack);
    parts.crackedGlass.push(crack);
  }

  addPoliceMarkings(group, width, text = 'POLICE') {
    const texture = this.makeTextTexture(text);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    for (const side of [-1, 1]) {
      const marking = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 0.62), material);
      marking.position.set(side * (width * 0.51 + 0.02), 1.48, -0.18);
      marking.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
      group.add(marking);
    }
  }

  makeTextTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  addHealthBar(group, parts) {
    const healthBar = new THREE.Group();
    healthBar.position.set(0, 5.15, 0);
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 0.28),
      new THREE.MeshBasicMaterial({ color: 0x180b0d, transparent: true, opacity: 0.82, depthWrite: false }),
    );
    const fill = new THREE.Mesh(
      new THREE.PlaneGeometry(3.25, 0.18),
      new THREE.MeshBasicMaterial({ color: 0x39e58d, transparent: true, opacity: 0.92, depthWrite: false }),
    );
    fill.position.z = 0.02;
    healthBar.add(bg, fill);
    healthBar.visible = false;
    group.add(healthBar);
    parts.healthBar = healthBar;
    parts.healthFill = fill;
  }
}
