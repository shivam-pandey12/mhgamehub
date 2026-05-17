import * as THREE from "three";

export function createStarfield({
  starCount = 1800,
  spread = 260,
  depth = 340,
  color = 0xbcd7ff,
  size = 0.9,
  opacity = 0.95,
} = {}) {
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const baseColor = new THREE.Color(color);
  const tintColor = new THREE.Color(0xffffff);
  const innerRadius = Math.max(26, Math.min(spread, depth) * 0.16);
  const outerRadius = Math.max(spread * 0.6, depth * 0.72);
  const direction = new THREE.Vector3();

  for (let index = 0; index < starCount; index += 1) {
    const stride = index * 3;
    direction.set(
      THREE.MathUtils.randFloatSpread(2),
      THREE.MathUtils.randFloatSpread(2),
      THREE.MathUtils.randFloatSpread(2),
    );

    if (direction.lengthSq() < 0.0001) {
      direction.set(0, 0, 1);
    } else {
      direction.normalize();
    }

    const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius);

    positions[stride] = direction.x * radius;
    positions[stride + 1] = direction.y * radius;
    positions[stride + 2] = direction.z * radius;

    const mixedColor = baseColor.clone().lerp(tintColor, Math.random() * 0.45);
    colors[stride] = mixedColor.r;
    colors[stride + 1] = mixedColor.g;
    colors[stride + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity,
    depthWrite: false,
  });

  const stars = new THREE.Points(geometry, material);
  stars.frustumCulled = false;

  return stars;
}
