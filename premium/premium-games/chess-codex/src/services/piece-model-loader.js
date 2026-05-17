import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_TYPES = ['p', 'r', 'n', 'b', 'q', 'k'];

export class PieceModelLibrary {
  constructor() {
    this.loader = new GLTFLoader();
    this.models = new Map();
    this.ready = false;
    this.failed = false;
  }

  async load() {
    const entries = await Promise.allSettled(MODEL_TYPES.map(async (type) => {
      let gltf = null;
      try {
        gltf = await this.loader.loadAsync(`/models/chess/${type}.glb`);
      } catch {
        gltf = await this.loader.loadAsync(`/models/chess/${type}.gltf`);
      }
      return [type, gltf.scene];
    }));

    const loaded = entries.filter((entry) => entry.status === 'fulfilled');
    if (loaded.length === 0) {
      this.failed = true;
      this.ready = false;
      return this;
    }

    loaded.forEach((entry) => {
      const [type, scene] = entry.value;
      this.models.set(type, scene);
    });

    this.ready = true;
    this.failed = loaded.length !== MODEL_TYPES.length;
    return this;
  }

  get(type) {
    return this.models.get(type) || null;
  }
}
