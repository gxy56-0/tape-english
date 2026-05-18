// pages/index/index.js — Home page
const app = getApp();
const { getWordPool } = require("../../utils/wordbank");
const { generateThemeStyleVars, getTheme } = require("../../utils/theme");

Page({
  data: {
    themeVars: "",
    totalWords: 0,
    selectedCount: 30,
    isCustom: false,
    customCount: "",
    currentTheme: "classic",
    themeDots: [
      { key: "classic", color: "#00f0ff" },
      { key: "ink",     color: "#2c2c2c" },
      { key: "white",   color: "#3b6fb6" },
      { key: "apricot", color: "#e07b5a" },
      { key: "mint",    color: "#4a9a8a" },
      { key: "mist",    color: "#5a8ab8" },
    ]
  },

  onLoad() {
    const pool = getWordPool();
    const themeKey = app.globalData.currentTheme;
    const theme = getTheme(themeKey, app.globalData.customTheme || {});
    this.setData({
      totalWords: pool.length,
      currentTheme: themeKey,
      themeVars: generateThemeStyleVars(theme)
    });
  },

  onShow() {
    // Refresh theme when coming back from typing
    const themeKey = app.globalData.currentTheme;
    if (this.data.currentTheme !== themeKey) {
      const theme = getTheme(themeKey, app.globalData.customTheme || {});
      this.setData({
        currentTheme: themeKey,
        themeVars: generateThemeStyleVars(theme)
      });
    }
  },

  selectCount(e) {
    const count = e.currentTarget.dataset.count;
    this.setData({ selectedCount: count, isCustom: false, customCount: "" });
  },

  enableCustom() {
    this.setData({ isCustom: true });
  },

  onCustomInput(e) {
    this.setData({ customCount: e.detail.value });
  },

  selectTheme(e) {
    const themeKey = e.currentTarget.dataset.theme;
    const theme = getTheme(themeKey, app.globalData.customTheme || {});
    app.globalData.currentTheme = themeKey;
    try { wx.setStorageSync("typing_theme", themeKey); } catch (e) {}
    this.setData({
      currentTheme: themeKey,
      themeVars: generateThemeStyleVars(theme)
    });
  },

  startTyping() {
    let dailyCount = this.data.isCustom
      ? Number(this.data.customCount) || 0
      : this.data.selectedCount;
    if (dailyCount <= 0) dailyCount = 0;

    app.globalData.dailyCount = dailyCount;
    wx.navigateTo({ url: "/pages/typing/typing" });
  }
});
