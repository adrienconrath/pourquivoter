const THEME_KEY = "pqv-theme";
const THEME_COLORS = {light: "#f7f5f0", dark: "#1d1a16"};

function savedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch (error) {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  const toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.setAttribute("aria-label", theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre");
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

applyTheme(savedTheme());

document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (error) {}
  applyTheme(next);
});
