// utils/storage.js
// wx.setStorageSync wrappers — replaces the web app's localStorage calls

function loadWordStats() {
  try { return wx.getStorageSync("typing_word_stats") || {}; } catch (e) { return {}; }
}

function saveWordStats(stats) {
  try { wx.setStorageSync("typing_word_stats", stats); } catch (e) {}
}

function loadWrongWords() {
  try { return wx.getStorageSync("typing_wrong_words") || {}; } catch (e) { return {}; }
}

function saveWrongWords(counts) {
  try { wx.setStorageSync("typing_wrong_words", counts); } catch (e) {}
}

function loadSessionHistory() {
  try { return wx.getStorageSync("typing_session_history") || []; } catch (e) { return []; }
}

function saveSessionHistory(history) {
  try { wx.setStorageSync("typing_session_history", history); } catch (e) {}
}

function recordAttempt(wordStats, word) {
  const key = word.en.toLowerCase();
  if (!wordStats[key]) wordStats[key] = { attempts: 0, completed: 0 };
  wordStats[key].attempts++;
  saveWordStats(wordStats);
}

function recordCompletion(wordStats, word) {
  const key = word.en.toLowerCase();
  if (!wordStats[key]) wordStats[key] = { attempts: 0, completed: 0 };
  wordStats[key].completed++;
  saveWordStats(wordStats);
}

function recordWrongWord(wrongCounts, word) {
  const key = word.en.toLowerCase();
  if (!wrongCounts[key]) wrongCounts[key] = 0;
  wrongCounts[key]++;
  saveWrongWords(wrongCounts);
}

module.exports = {
  loadWordStats, saveWordStats,
  loadWrongWords, saveWrongWords,
  loadSessionHistory, saveSessionHistory,
  recordAttempt, recordCompletion, recordWrongWord
};
