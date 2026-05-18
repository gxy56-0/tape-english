// app.js — Global app controller
// Loads persisted data on startup, exposes globalData for cross-page sharing

App({
  globalData: {
    // Persisted across sessions
    wordStats: {},
    wrongWordCounts: {},
    sessionHistory: [],
    currentTheme: "classic",
    customTheme: null,
    customThemeHex: "#00f0ff",
    soundPreset: "mechanical",
    soundEnabled: true,

    // Transient between pages
    dailyCount: 0,
    lastResult: null,
  },

  onLaunch() {
    // Load persisted data
    try {
      const wordStats = wx.getStorageSync("typing_word_stats");
      if (wordStats) this.globalData.wordStats = wordStats;
    } catch (e) {}

    try {
      const wrongWords = wx.getStorageSync("typing_wrong_words");
      if (wrongWords) this.globalData.wrongWordCounts = wrongWords;
    } catch (e) {}

    try {
      const history = wx.getStorageSync("typing_session_history");
      if (history) this.globalData.sessionHistory = history;
    } catch (e) {}

    try {
      const theme = wx.getStorageSync("typing_theme");
      if (theme) this.globalData.currentTheme = theme;
    } catch (e) {}

    try {
      const customTheme = wx.getStorageSync("typing_custom_theme");
      if (customTheme) this.globalData.customTheme = customTheme;
    } catch (e) {}

    try {
      const customHex = wx.getStorageSync("typing_custom_hex");
      if (customHex) this.globalData.customThemeHex = customHex;
    } catch (e) {}

    try {
      const sound = wx.getStorageSync("typing_sound");
      if (sound) this.globalData.soundPreset = sound;
    } catch (e) {}
  }
});
