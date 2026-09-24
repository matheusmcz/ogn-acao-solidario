/**
 * js/theme.js — Perfis cromáticos: dark mode (sistema) + alto contraste (manual).
 */
const CONTRAST_KEY = "ong_high_contrast";

export function applyHighContrast(enabled) {
  document.documentElement.classList.toggle("theme-high-contrast", enabled);
  document.documentElement.setAttribute(
    "data-contrast",
    enabled ? "high" : "standard"
  );
  const toggle = document.getElementById("theme-contrast-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.textContent = enabled ? "Contraste normal" : "Alto contraste";
  }
}

export function initThemeControls() {
  const saved = localStorage.getItem(CONTRAST_KEY) === "1";
  applyHighContrast(saved);

  const toggle = document.getElementById("theme-contrast-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", function () {
    const next = !document.documentElement.classList.contains(
      "theme-high-contrast"
    );
    applyHighContrast(next);
    localStorage.setItem(CONTRAST_KEY, next ? "1" : "0");
  });
}
