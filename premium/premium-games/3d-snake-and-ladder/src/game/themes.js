export const THEME_DEFINITIONS = {
  ivory: {
    id: "ivory",
    label: "Ivory Royale",
    status: "Active"
  },
  midnight: {
    id: "midnight",
    label: "Midnight Royale",
    status: "Prepared"
  },
  garden: {
    id: "garden",
    label: "Garden Classic",
    status: "Prepared"
  }
};

export const DEFAULT_THEME_ID = "ivory";

export function getTheme(themeId) {
  return THEME_DEFINITIONS[themeId] || THEME_DEFINITIONS[DEFAULT_THEME_ID];
}
