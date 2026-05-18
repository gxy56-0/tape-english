// pages/typing/typing.js — Main typing game logic
const app = getApp();
const { getWordPool } = require("../../utils/wordbank");
const { createSessionState } = require("../../utils/state");
const { getLearningQueue } = require("../../utils/queue");
const {
  formatTime, getStarRating, getStarLabel,
  isSkipChar, typableLength, nthNonSpace, nonSpaceCountBefore
} = require("../../utils/stats");
const {
  recordAttempt, recordCompletion, recordWrongWord
} = require("../../utils/storage");
const { generateThemeStyleVars, getTheme } = require("../../utils/theme");

Page({
  data: {
    themeVars: "",

    // Word display
    currentWord: { en: "", zh: "", jyut: "" },
    wordLetters: [],
    wordIndex: 0,
    totalWords: 0,
    progressPct: 0,
    frameFlash: "",

    // Stats
    timeDisplay: "00:00",
    totalInputs: 0,
    totalCorrect: 0,
    totalErrors: 0,
    wpm: 0,
    accuracy: 100,

    // Input
    inputValue: "",
    inputFocus: true,
    maxInputLen: 50,

    // States
    isWrong: false,
    isComplete: false,
  },

  // Internal state — not in data, avoids setData overhead
  _session: null,
  _words: [],
  _timerInterval: null,
  _wrongTimer: null,
  _flashTimer: null,

  onLoad() {
    const pool = getWordPool();
    const dailyCount = app.globalData.dailyCount || 0;
    const words = getLearningQueue(pool, dailyCount, app.globalData.wordStats);

    const session = createSessionState();
    session.words = words;
    session.dailyCount = dailyCount;
    this._session = session;
    this._words = words;

    const themeKey = app.globalData.currentTheme;
    const theme = getTheme(themeKey, app.globalData.customTheme || {});
    this.setData({
      themeVars: generateThemeStyleVars(theme),
      totalWords: words.length,
    });

    // Start immediately
    session.isStarted = true;
    session.startTime = Date.now();
    this.renderCurrentWord();
    this.startTimer();
  },

  onUnload() {
    this.stopTimer();
    if (this._wrongTimer) clearTimeout(this._wrongTimer);
    if (this._flashTimer) clearTimeout(this._flashTimer);
  },

  // ============================================================
  // WORD RENDERING
  // ============================================================
  renderCurrentWord() {
    const word = this._words[this._session.wordIndex];
    if (!word) return;

    recordAttempt(app.globalData.wordStats, word);

    const letters = [];
    for (let i = 0; i < word.en.length; i++) {
      const ch = word.en[i];
      letters.push({
        char: ch,
        isSpace: ch === " ",
        isSkip: ch === "-",
        state: (ch === " " || ch === "-") ? "normal" : "normal"
      });
    }

    this._session.userInput = "";
    this._session.isWrong = false;

    this.setData({
      currentWord: word,
      wordLetters: letters,
      inputValue: "",
      isWrong: false,
      frameFlash: "",
      wordIndex: this._session.wordIndex,
      maxInputLen: typableLength(word) + 5,
      progressPct: this._words.length > 0
        ? (this._session.wordIndex / this._words.length) * 100 : 0,
    });

    // Keep keyboard focused
    this.setData({ inputFocus: true });
  },

  // ============================================================
  // INPUT HANDLING — CORE LOGIC
  // ============================================================
  onInput(e) {
    const session = this._session;
    if (!session.isStarted || session.isComplete || session.isWrong) {
      return;
    }

    const value = e.detail.value;
    const word = this._words[session.wordIndex];
    if (!word) return;

    // Only process new characters (bindinput fires on every change)
    const prevLen = (session.userInput || "").length;
    if (value.length <= prevLen) return; // deletion or no change, ignore
    const newChars = value.slice(prevLen);

    const letters = this.data.wordLetters.map(l => ({ ...l }));

    // Process each newly typed character (like the web app's keydown-per-char)
    for (let i = 0; i < newChars.length; i++) {
      const ch = newChars[i];
      const userIdx = prevLen + i;
      session.totalInputs++;

      const wordIdx = nthNonSpace(word, userIdx);

      // Hyphen matching: user can type "-" if word has one at this position
      if (ch === "-") {
        const prevWordIdx = userIdx > 0 ? nthNonSpace(word, userIdx - 1) : -1;
        let found = false;
        for (let wi = prevWordIdx + 1; wi <= wordIdx && wi < word.en.length; wi++) {
          if (word.en[wi] === "-") { found = true; break; }
        }
        if (found) {
          session.totalCorrect++;
          if (wordIdx >= 0 && wordIdx < letters.length) letters[wordIdx].state = "correct";
          try { wx.vibrateShort({ type: "light" }); } catch (e) {}
        } else {
          session.totalErrors++;
          session.isWrong = true;
          recordWrongWord(app.globalData.wrongWordCounts, word);
          if (wordIdx >= 0 && wordIdx < letters.length) letters[wordIdx].state = "wrong";
          try { wx.vibrateShort({ type: "heavy" }); } catch (e) {}
          break;
        }
      } else if (wordIdx === -1 || ch.toLowerCase() !== word.en[wordIdx].toLowerCase()) {
        // Wrong character
        session.totalErrors++;
        session.isWrong = true;
        recordWrongWord(app.globalData.wrongWordCounts, word);
        if (wordIdx >= 0 && wordIdx < letters.length) letters[wordIdx].state = "wrong";
        try { wx.vibrateShort({ type: "heavy" }); } catch (e) {}
        break;
      } else {
        // Correct character
        session.totalCorrect++;
        letters[wordIdx].state = "correct";
        try { wx.vibrateShort({ type: "light" }); } catch (e) {}
      }
    }

    session.userInput = value;

    if (session.isWrong) {
      // Wrong input: show error, reset after delay
      this.setData({
        wordLetters: letters,
        isWrong: true,
        totalErrors: session.totalErrors,
        totalInputs: session.totalInputs,
        frameFlash: "wrong-flash",
        inputValue: value,
      });
      this.clearFlash();

      if (this._wrongTimer) clearTimeout(this._wrongTimer);
      this._wrongTimer = setTimeout(() => {
        const resetLetters = this.data.wordLetters.map(l => ({
          ...l,
          state: (l.isSpace || l.isSkip) ? l.state : "normal"
        }));
        session.isWrong = false;
        session.userInput = "";
        this.setData({
          wordLetters: resetLetters,
          inputValue: "",
          isWrong: false,
          frameFlash: "",
        });
      }, 350);
    } else {
      // All good so far
      this.setData({
        wordLetters: letters,
        inputValue: value,
        totalCorrect: session.totalCorrect,
        totalInputs: session.totalInputs,
        frameFlash: "correct-flash",
      });
      this.clearFlash();

      // Check word completion: all non-space characters covered
      const tLen = typableLength(word);
      if (value.length >= tLen) {
        session.wordsCompleted++;
        this.setData({ frameFlash: "" });
        setTimeout(() => this.advanceWord(), 150);
      }
    }

    this.updateStats();
  },

  clearFlash() {
    if (this._flashTimer) clearTimeout(this._flashTimer);
    this._flashTimer = setTimeout(() => {
      this.setData({ frameFlash: "" });
    }, 140);
  },

  advanceWord() {
    const completedWord = this._words[this._session.wordIndex];
    recordCompletion(app.globalData.wordStats, completedWord);

    this._session.wordIndex++;

    if (this._session.wordIndex >= this._words.length) {
      this.finishSession();
      return;
    }

    this.renderCurrentWord();
    this.updateStats();
  },

  // ============================================================
  // PRONUNCIATION (MVP: text toast)
  // ============================================================
  onTapEn() {
    const word = this._words[this._session.wordIndex];
    if (word) {
      wx.showToast({ title: word.en, icon: "none", duration: 2000 });
    }
  },

  onTapYue() {
    const word = this._words[this._session.wordIndex];
    if (word) {
      wx.showToast({ title: word.zh, icon: "none", duration: 2000 });
    }
  },

  // ============================================================
  // STATS
  // ============================================================
  updateStats() {
    const session = this._session;
    const elapsed = session.startTime ? (Date.now() - session.startTime) / 1000 : 0;
    const minutes = elapsed / 60;
    const totalTyped = session.totalCorrect + session.totalErrors;
    const wpm = minutes > 0 ? Math.round((session.totalCorrect / 5) / minutes) : 0;
    const accuracy = totalTyped > 0 ? Math.round((session.totalCorrect / totalTyped) * 100) : 100;

    this.setData({
      timeDisplay: formatTime(elapsed),
      wpm: wpm,
      accuracy: accuracy,
    });
  },

  startTimer() {
    this._timerInterval = setInterval(() => {
      if (this._session && this._session.isStarted && !this._session.isComplete) {
        this.updateStats();
      }
    }, 1000);
  },

  stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  // ============================================================
  // SESSION COMPLETE
  // ============================================================
  finishSession() {
    const session = this._session;
    session.endTime = Date.now();
    session.isComplete = true;
    session.isStarted = false;
    this.stopTimer();
    this.updateStats();

    const elapsed = (session.endTime - session.startTime) / 1000;
    const minutes = elapsed / 60;
    const totalTyped = session.totalCorrect + session.totalErrors;
    const wpm = minutes > 0 ? Math.round((session.totalCorrect / 5) / minutes) : 0;
    const accuracy = totalTyped > 0 ? Math.round((session.totalCorrect / totalTyped) * 100) : 100;
    const stars = getStarRating(accuracy);

    // Save to history
    let history = [...(app.globalData.sessionHistory || [])];
    history.unshift({
      date: new Date().toISOString().slice(0, 10),
      wpm, accuracy, words: session.wordsCompleted, stars
    });
    if (history.length > 10) history = history.slice(0, 10);
    app.globalData.sessionHistory = history;
    try { wx.setStorageSync("typing_session_history", history); } catch (e) {}

    app.globalData.lastResult = {
      wpm, accuracy, stars,
      time: formatTime(elapsed),
      wordsCompleted: session.wordsCompleted,
      totalErrors: session.totalErrors,
    };

    wx.redirectTo({ url: "/pages/result/result" });
  },
});
