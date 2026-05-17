export function disposeMaterial(material) {
  if (!material) return;
  if (Array.isArray(material)) {
    for (const item of material) disposeMaterial(item);
    return;
  }
  for (const value of Object.values(material)) {
    if (value && typeof value === 'object' && typeof value.dispose === 'function' && value.isTexture) {
      value.dispose();
    }
  }
  material.dispose?.();
}

export function disposeObjectTree(object, { disposeMaterials = false } = {}) {
  if (!object?.traverse) return;
  object.traverse((child) => {
    child.geometry?.dispose?.();
    if (disposeMaterials || child.userData?.disposeMaterial) {
      disposeMaterial(child.material);
    }
  });
}

export function clearObjectGroup(group, options = {}) {
  if (!group) return;
  for (const child of [...group.children]) {
    disposeObjectTree(child, options);
    group.remove(child);
  }
}
