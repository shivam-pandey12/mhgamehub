// @ts-check

/**
 * @param {{
 *   label: string;
 *   action?: string;
 *   variant?: "primary" | "secondary" | "ghost" | "danger";
 *   size?: "sm" | "md" | "lg";
 *   disabled?: boolean;
 *   attrs?: Record<string, string | number | boolean | null | undefined>;
 * }} config
 * @returns {string}
 */
export function renderButton({ label, action = "", variant = "primary", size = "md", disabled = false, attrs = {} }) {
  const dataAction = action ? `data-action="${action}"` : "";
  const extra = Object.entries(attrs)
    .filter(([, value]) => value !== null && value !== undefined && value !== false)
    .map(([key, value]) => `${key}="${String(value)}"`)
    .join(" ");

  return `
    <button class="btn btn--${variant} btn--${size}" ${dataAction} ${disabled ? "disabled" : ""} ${extra}>
      ${label}
    </button>
  `;
}
