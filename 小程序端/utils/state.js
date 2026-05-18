// utils/state.js
// Session state factory — creates a fresh state object for each typing session

function createSessionState() {
  return {
    words: [],           // current word list
    wordIndex: 0,        // index in current list
    userInput: "",       // characters typed for current word
    totalInputs: 0,      // total keystrokes
    totalCorrect: 0,     // total correct keystrokes
    totalErrors: 0,      // total wrong keystrokes
    wordsCompleted: 0,   // number of words successfully typed
    startTime: null,
    endTime: null,
    isStarted: false,
    isComplete: false,
    isWrong: false,      // currently in error state (waiting to reset)
    dailyCount: 0,       // 0 = all words
  };
}

module.exports = { createSessionState };
