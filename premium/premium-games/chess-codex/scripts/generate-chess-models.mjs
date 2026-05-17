import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createPiece } from '../src/piece-factory.js';

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onloadend = null;
    }

    async readAsArrayBuffer(blob) {
      this.result = await blob.arrayBuffer();
      this.onloadend?.();
    }

    async readAsDataURL(blob) {
      const buffer = Buffer.from(await blob.arrayBuffer());
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;
      this.onloadend?.();
    }
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/models/chess');
const modelTypes = ['p', 'r', 'n', 'b', 'q', 'k'];

function cleanupShadowDisk(root) {
  const toRemove = [];
  root.children.forEach((child) => {
    if (child.material?.isMeshBasicMaterial) {
      toRemove.push(child);
    }
  });
  toRemove.forEach((child) => root.remove(child));
}

function exportGlb(scene) {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => resolve(result),
      (error) => reject(error),
      {
        binary: true,
        onlyVisible: true,
        trs: false
      }
    );
  });
}

await fs.mkdir(outputDir, { recursive: true });

for (const type of modelTypes) {
  const piece = createPiece({ color: 'w', type });
  cleanupShadowDisk(piece);
  piece.updateMatrixWorld(true);
  const glb = await exportGlb(piece);
  const buffer = Buffer.from(glb);
  await fs.writeFile(path.join(outputDir, `${type}.glb`), buffer);
}

console.log(`Generated ${modelTypes.length} GLB chess models in ${outputDir}`);
