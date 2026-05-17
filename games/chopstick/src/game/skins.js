export const HAND_SKINS = [
  {
    id: "ember",
    name: "Ember Alloy",
    palm: "#ffb066",
    finger: "#ffd8b1",
    accent: "#ff6b5b",
    glow: "#ff8a4c",
    dead: "#524257"
  },
  {
    id: "tide",
    name: "Tidal Glass",
    palm: "#74c9ff",
    finger: "#d8f4ff",
    accent: "#0089d6",
    glow: "#6be0ff",
    dead: "#3f4d63"
  },
  {
    id: "jade",
    name: "Jade Circuit",
    palm: "#62d49d",
    finger: "#dffdea",
    accent: "#1c8c64",
    glow: "#81ffbd",
    dead: "#43544c"
  },
  {
    id: "dusk",
    name: "Dusk Velvet",
    palm: "#ff9ca5",
    finger: "#ffe3ea",
    accent: "#9a4f79",
    glow: "#f8a8ff",
    dead: "#4d4456"
  },
  {
    id: "sand",
    name: "Arena Sand",
    palm: "#f3c98b",
    finger: "#fff0d8",
    accent: "#a4723e",
    glow: "#ffd572",
    dead: "#5b5149"
  }
];

export function getSkinById(skinId) {
  return HAND_SKINS.find((skin) => skin.id === skinId) ?? HAND_SKINS[0];
}
