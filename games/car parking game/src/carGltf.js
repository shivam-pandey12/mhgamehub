const BOX_FACES = [
  {
    normal: [0, 0, 1],
    corners: [
      [-1, 1, 1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
    ],
  },
  {
    normal: [0, 0, -1],
    corners: [
      [1, 1, -1],
      [1, -1, -1],
      [-1, -1, -1],
      [-1, 1, -1],
    ],
  },
  {
    normal: [1, 0, 0],
    corners: [
      [1, 1, 1],
      [1, -1, 1],
      [1, -1, -1],
      [1, 1, -1],
    ],
  },
  {
    normal: [-1, 0, 0],
    corners: [
      [-1, 1, -1],
      [-1, -1, -1],
      [-1, -1, 1],
      [-1, 1, 1],
    ],
  },
  {
    normal: [0, 1, 0],
    corners: [
      [-1, 1, -1],
      [-1, 1, 1],
      [1, 1, 1],
      [1, 1, -1],
    ],
  },
  {
    normal: [0, -1, 0],
    corners: [
      [-1, -1, 1],
      [-1, -1, -1],
      [1, -1, -1],
      [1, -1, 1],
    ],
  },
];

const BODY_SECTIONS = [
  { size: [1.9, 0.58, 4.1], offset: [0, 0.18, 0] },
  { size: [1.42, 0.54, 2.08], offset: [0, 0.76, -0.2] },
  { size: [1.24, 0.18, 0.86], offset: [0, 0.48, 1.48] },
];

function appendBox(positions, normals, indices, size, offset) {
  const [width, height, depth] = size;
  const [offsetX, offsetY, offsetZ] = offset;

  for (const face of BOX_FACES) {
    const vertexStart = positions.length / 3;

    for (const [cornerX, cornerY, cornerZ] of face.corners) {
      positions.push(
        offsetX + cornerX * width * 0.5,
        offsetY + cornerY * height * 0.5,
        offsetZ + cornerZ * depth * 0.5
      );

      normals.push(...face.normal);
    }

    indices.push(
      vertexStart,
      vertexStart + 1,
      vertexStart + 2,
      vertexStart,
      vertexStart + 2,
      vertexStart + 3
    );
  }
}

function encodeBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

function padToFour(bytes) {
  return bytes + ((4 - (bytes % 4)) % 4);
}

export function createCarModelUrl() {
  const positions = [];
  const normals = [];
  const indices = [];

  BODY_SECTIONS.forEach((section) => {
    appendBox(positions, normals, indices, section.size, section.offset);
  });

  const positionArray = new Float32Array(positions);
  const normalArray = new Float32Array(normals);
  const indexArray = new Uint16Array(indices);

  const positionBytes = positionArray.byteLength;
  const normalOffset = padToFour(positionBytes);
  const normalBytes = normalArray.byteLength;
  const indexOffset = padToFour(normalOffset + normalBytes);
  const indexBytes = indexArray.byteLength;
  const totalBytes = padToFour(indexOffset + indexBytes);

  const packed = new ArrayBuffer(totalBytes);
  new Uint8Array(packed, 0, positionBytes).set(new Uint8Array(positionArray.buffer));
  new Uint8Array(packed, normalOffset, normalBytes).set(new Uint8Array(normalArray.buffer));
  new Uint8Array(packed, indexOffset, indexBytes).set(new Uint8Array(indexArray.buffer));

  const mins = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
  const maxs = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];

  for (let i = 0; i < positions.length; i += 3) {
    mins[0] = Math.min(mins[0], positions[i]);
    mins[1] = Math.min(mins[1], positions[i + 1]);
    mins[2] = Math.min(mins[2], positions[i + 2]);
    maxs[0] = Math.max(maxs[0], positions[i]);
    maxs[1] = Math.max(maxs[1], positions[i + 1]);
    maxs[2] = Math.max(maxs[2], positions[i + 2]);
  }

  const gltf = {
    asset: {
      version: "2.0",
      generator: "Codex Inline Car Builder",
    },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: "PlayerCarBody" }],
    meshes: [
      {
        name: "PlayerCarMesh",
        primitives: [
          {
            attributes: {
              POSITION: 0,
              NORMAL: 1,
            },
            indices: 2,
            material: 0,
          },
        ],
      },
    ],
    materials: [
      {
        name: "BodyPaint",
        doubleSided: true,
        pbrMetallicRoughness: {
          baseColorFactor: [0.9, 0.22, 0.12, 1],
          metallicFactor: 0.36,
          roughnessFactor: 0.34,
        },
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: positionArray.length / 3,
        type: "VEC3",
        min: mins,
        max: maxs,
      },
      {
        bufferView: 1,
        componentType: 5126,
        count: normalArray.length / 3,
        type: "VEC3",
      },
      {
        bufferView: 2,
        componentType: 5123,
        count: indexArray.length,
        type: "SCALAR",
      },
    ],
    bufferViews: [
      {
        buffer: 0,
        byteOffset: 0,
        byteLength: positionBytes,
        target: 34962,
      },
      {
        buffer: 0,
        byteOffset: normalOffset,
        byteLength: normalBytes,
        target: 34962,
      },
      {
        buffer: 0,
        byteOffset: indexOffset,
        byteLength: indexBytes,
        target: 34963,
      },
    ],
    buffers: [
      {
        byteLength: totalBytes,
        uri: `data:application/octet-stream;base64,${encodeBase64(packed)}`,
      },
    ],
  };

  return URL.createObjectURL(
    new Blob([JSON.stringify(gltf)], { type: "model/gltf+json" })
  );
}

