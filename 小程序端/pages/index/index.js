// pages/index/index.js — Home: count selector, theme follows system
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
    sysTheme: "dark",
  },

  onLoad() {
    const pool = getWordPool();
    const themeKey = app.globalData.theme || "dark";
    this.applyTheme(themeKey);
    this.setData({
      totalWords: pool.length,
      sysTheme: themeKey,
    });
  },

  onShow() {
    const themeKey = app.globalData.theme || "dark";
    if (this.data.sysTheme !== themeKey) {
      this.applyTheme(themeKey);
      this.setData({ sysTheme: themeKey });
    }
  },

  onThemeChanged(theme) {
    this.applyTheme(theme);
    this.setData({ sysTheme: theme });
  },

  applyTheme(key) {
    const theme = getTheme(key);
    this.setData({ themeVars: generateThemeStyleVars(theme) });
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

  startTyping() {
    let dailyCount = this.data.isCustom
      ? Number(this.data.customCount) || 0
      : this.data.selectedCount;
    if (dailyCount <= 0) dailyCount = 0;
    app.globalData.dailyCount = dailyCount;
    wx.navigateTo({ url: "/pages/typing/typing" });
  }
});
