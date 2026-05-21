// utils/theme.js
// Two themes: dark (system default) and light

const themes = {
  dark: {
    bg: "#08081a",
    surface: "#10102a",
    surfaceAlt: "#181840",
    cyan: "#00f0ff",
    magenta: "#ff00e5",
    purple: "#a855f7",
    green: "#00ff88",
    red: "#ff3366",
    amber: "#ffb800",
    text: "#e0e0f0",
    muted: "#7878a8",
    border: "#252550",
    glassBg: "rgba(8,8,26,0.8)",
  },
  light: {
    bg: "#f5f6f8",
    surface: "#ffffff",
    surfaceAlt: "#f0f1f4",
    cyan: "#2b5f8a",
    magenta: "#6b7db3",
    purple: "#7b8dc0",
    green: "#3a8a5c",
    red: "#cc4444",
    amber: "#c08830",
    text: "#1a1a1a",
    muted: "#888888",
    border: "#e0e0e0",
    glassBg: "rgba(255,255,255,0.88)",
  },
};

function getTheme(key) {
  return themes[key] || themes.dark;
}

function generateThemeStyleVars(t) {
  return (
    "--bg:" + t.bg + ";" +
    "--surface:" + t.surface + ";" +
    "--surface-alt:" + t.surfaceAlt + ";" +
    "--neon-cyan:" + t.cyan + ";" +
    "--neon-magenta:" + t.magenta + ";" +
    "--neon-purple:" + t.purple + ";" +
    "--neon-green:" + t.green + ";" +
    "--neon-red:" + t.red + ";" +
    "--neon-amber:" + t.amber + ";" +
    "--text:" + t.text + ";" +
    "--text-muted:" + t.muted + ";" +
    "--border-subtle:" + t.border + ";" +
    "--glass-bg:" + t.glassBg + ";"
  );
}

module.exports = { getTheme, generateThemeStyleVars };
