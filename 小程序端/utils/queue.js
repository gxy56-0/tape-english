// utils/queue.js
// Learning queue: unlearned words first, learned words sink to bottom

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getLearningQueue(pool, dailyCount, wordStats) {
  const unlearned = pool.filter(w => {
    const stats = wordStats[w.en.toLowerCase()];
    return !stats || stats.completed === 0;
  });
  const learned = pool.filter(w => {
    const stats = wordStats[w.en.toLowerCase()];
    return stats && stats.completed > 0;
  });
  const result = [...shuffle(unlearned), ...shuffle(learned)];
  if (dailyCount > 0 && result.length > dailyCount) {
    return result.slice(0, dailyCount);
  }
  return result;
}

module.exports = { shuffle, getLearningQueue };
