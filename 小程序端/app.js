// app.js — Global app controller
// Detects system theme, loads persisted data, exposes globalData

App({
  globalData: {
    wordStats: {},
    wrongWordCounts: {},
    sessionHistory: [],
    theme: "dark",        // "dark" or "light" — follows system
    soundEnabled: true,

    // Transient
    dailyCount: 0,
    lastResult: null,
  },

  onLaunch() {
    // Detect system theme
    try {
      const sysInfo = wx.getSystemInfoSync();
      this.globalData.theme = sysInfo.theme || "dark";
    } catch (e) {}

    // Load persisted data
    const keys = [
      "typing_word_stats",
      "typing_wrong_words",
      "typing_session_history",
    ];
    const fields = ["wordStats", "wrongWordCounts", "sessionHistory"];
    keys.forEach((key, i) => {
      try {
        const val = wx.getStorageSync(key);
        if (val) this.globalData[fields[i]] = val;
      } catch (e) {}
    });
  },

  onThemeChange(res) {
    this.globalData.theme = res.theme;
    // Notify current page if it has onThemeChanged handler
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    if (page && page.onThemeChanged) {
      page.onThemeChanged(res.theme);
    }
  }
});
