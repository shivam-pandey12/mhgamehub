export class OptionalAssetLoader {
  constructor() {
    this.audioCache = new Map();
    this.modelCache = new Map();
    this.gltfLoaderPromise = null;
  }

  async loadAudio(url, audioContext) {
    if (!url || !audioContext) return null;
    if (this.audioCache.has(url)) return this.audioCache.get(url);
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const buffer = await response.arrayBuffer();
      const decoded = await audioContext.decodeAudioData(buffer);
      this.audioCache.set(url, decoded);
      return decoded;
    } catch {
      return null;
    }
  }

  async loadModel(url) {
    if (!url) return null;
    if (this.modelCache.has(url)) return this.modelCache.get(url).clone(true);
    try {
      if (!this.gltfLoaderPromise) {
        this.gltfLoaderPromise = import('three/examples/jsm/loaders/GLTFLoader.js')
          .then((module) => new module.GLTFLoader())
          .catch(() => null);
      }
      const loader = await this.gltfLoaderPromise;
      if (!loader) return null;
      const gltf = await loader.loadAsync(url);
      this.modelCache.set(url, gltf.scene);
      return gltf.scene.clone(true);
    } catch {
      return null;
    }
  }
}
