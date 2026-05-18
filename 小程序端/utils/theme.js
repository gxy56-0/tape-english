// utils/theme.js
// Theme definitions, CSS variable generation, and HSL color utilities

const presetThemes = {
  classic: {
    name: "经典",
    bg: "#08081a", surface: "#10102a", surfaceAlt: "#181840",
    cyan: "#00f0ff", magenta: "#ff00e5", purple: "#a855f7",
    green: "#00ff88", red: "#ff3366", amber: "#ffb800",
    text: "#e0e0f0", muted: "#7878a8", border: "#252550",
    glassBg: "rgba(8,8,26,0.8)", starOpacity: "1", scanlineOpacity: "1",
  },
  ink: {
    name: "素黑",
    bg: "#f2f2f2", surface: "#ffffff", surfaceAlt: "#e8e8e8",
    cyan: "#2c2c2c", magenta: "#555555", purple: "#666666",
    green: "#3a7a5c", red: "#cc4444", amber: "#b8860b",
    text: "#1a1a1a", muted: "#777777", border: "#dddddd",
    glassBg: "rgba(255,255,255,0.85)", starOpacity: "0.1", scanlineOpacity: "0.2",
  },
  white: {
    name: "纯白",
    bg: "#f8f9fa", surface: "#ffffff", surfaceAlt: "#f0f0f0",
    cyan: "#3b6fb6", magenta: "#6b8ec4", purple: "#7b8fce",
    green: "#3a9a6e", red: "#dd4444", amber: "#d4a017",
    text: "#222222", muted: "#888888", border: "#e0e0e0",
    glassBg: "rgba(255,255,255,0.88)", starOpacity: "0.08", scanlineOpacity: "0.15",
  },
  apricot: {
    name: "暖杏",
    bg: "#faf5ef", surface: "#fffaf5", surfaceAlt: "#f5ede3",
    cyan: "#e07b5a", magenta: "#d4696a", purple: "#c08090",
    green: "#6a9a7a", red: "#cc5544", amber: "#d4953a",
    text: "#3a2a1a", muted: "#9a8a7a", border: "#e8ddd0",
    glassBg: "rgba(255,250,245,0.85)", starOpacity: "0.1", scanlineOpacity: "0.2",
  },
  mint: {
    name: "薄荷",
    bg: "#f0f7f4", surface: "#f8fdfa", surfaceAlt: "#e8f2ec",
    cyan: "#4a9a8a", magenta: "#5a9a8a", purple: "#6a8aaa",
    green: "#3a8a5c", red: "#c06050", amber: "#b89440",
    text: "#1a2a22", muted: "#7a8a80", border: "#d8e8e0",
    glassBg: "rgba(248,253,250,0.85)", starOpacity: "0.08", scanlineOpacity: "0.15",
  },
  mist: {
    name: "雾蓝",
    bg: "#f2f4f8", surface: "#fafbfd", surfaceAlt: "#e8ecf4",
    cyan: "#5a8ab8", magenta: "#7a8eb8", purple: "#8a8ec0",
    green: "#5a9a7a", red: "#c06060", amber: "#c0a050",
    text: "#1a2230", muted: "#7a8290", border: "#d8dde8",
    glassBg: "rgba(250,251,253,0.85)", starOpacity: "0.08", scanlineOpacity: "0.15",
  },
};

const themeOrder = ["classic", "ink", "white", "apricot", "mint", "mist"];

function getTheme(key, customThemes) {
  if (presetThemes[key]) return presetThemes[key];
  if (customThemes && customThemes[key]) return customThemes[key];
  return presetThemes["classic"];
}

function generateThemeStyleVars(theme) {
  return "--bg:" + theme.bg + ";" +
    "--surface:" + theme.surface + ";" +
    "--surface-alt:" + theme.surfaceAlt + ";" +
    "--neon-cyan:" + theme.cyan + ";" +
    "--neon-magenta:" + theme.magenta + ";" +
    "--neon-purple:" + theme.purple + ";" +
    "--neon-green:" + theme.green + ";" +
    "--neon-red:" + theme.red + ";" +
    "--neon-amber:" + theme.amber + ";" +
    "--text:" + theme.text + ";" +
    "--text-muted:" + theme.muted + ";" +
    "--border-subtle:" + theme.border + ";" +
    "--glass-bg:" + theme.glassBg + ";" +
    "--star-opacity:" + theme.starOpacity + ";" +
    "--scanline-opacity:" + theme.scanlineOpacity + ";";
}

module.exports = {
  presetThemes, themeOrder, getTheme, generateThemeStyleVars
};
