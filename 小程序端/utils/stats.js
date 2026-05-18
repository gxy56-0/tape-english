// utils/stats.js
// Stats calculations, star rating, and skip-character helpers

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function getStarRating(accuracy) {
  if (accuracy >= 95) return 3;
  if (accuracy >= 85) return 2;
  if (accuracy >= 70) return 1;
  return 0;
}

function getStarLabel(count) {
  const labels = ["Keep Practicing", "Good Effort", "Great Job", "Perfect"];
  return labels[count] || "";
}

function isSkipChar(c) {
  return c === " " || c === "-";
}

function typableLength(word) {
  let n = 0;
  for (let i = 0; i < word.en.length; i++) {
    if (!isSkipChar(word.en[i])) n++;
  }
  return n;
}

function nthNonSpace(word, n) {
  let count = 0;
  for (let i = 0; i < word.en.length; i++) {
    if (!isSkipChar(word.en[i])) {
      if (count === n) return i;
      count++;
    }
  }
  return -1;
}

function nonSpaceCountBefore(word, wordIdx) {
  let count = 0;
  for (let i = 0; i < wordIdx; i++) {
    if (!isSkipChar(word.en[i])) count++;
  }
  return count;
}

module.exports = {
  formatTime, getStarRating, getStarLabel,
  isSkipChar, typableLength, nthNonSpace, nonSpaceCountBefore
};
