// pages/result/result.js — Result page
const app = getApp();
const { getStarLabel } = require("../../utils/stats");
const { generateThemeStyleVars, getTheme } = require("../../utils/theme");

Page({
  data: {
    themeVars: "",
    wpm: 0,
    accuracy: 100,
    stars: 0,
    starLabel: "",
    starArray: [0, 1, 2],
    timeDisplay: "00:00",
    wordsCompleted: 0,
    totalErrors: 0,
    history: [],
  },

  onLoad() {
    const result = app.globalData.lastResult;
    if (!result) {
      wx.redirectTo({ url: "/pages/index/index" });
      return;
    }

    const history = app.globalData.sessionHistory || [];
    const themeKey = app.globalData.currentTheme;
    const theme = getTheme(themeKey, app.globalData.customTheme || {});

    this.setData({
      themeVars: generateThemeStyleVars(theme),
      wpm: result.wpm,
      accuracy: result.accuracy,
      stars: result.stars,
      starLabel: getStarLabel(result.stars),
      timeDisplay: result.time,
      wordsCompleted: result.wordsCompleted,
      totalErrors: result.totalErrors,
      history: history,
    });
  },

  onRetry() {
    wx.redirectTo({ url: "/pages/typing/typing" });
  },

  onNewWords() {
    delete app.globalData.dailyCount;
    wx.redirectTo({ url: "/pages/index/index" });
  },
});
