// funcion sin utilizar
export function getPercentage(clicks, max = 10) {
  return Math.min(clicks / max, 1);
}

export function addAttempt(attemptsArray, clicks) {
  attemptsArray.push(clicks);
  return attemptsArray;
}

export function resetClicks() {
  return 0;
}
export function increment(clicks) {
  return clicks + 1;
}

export function getBestAttempt(attempts) {
  return attempts.length > 0 ? Math.max(...attempts) : 0;
}

// --- Compatibilidad con Node (para Jest) ---
if (typeof module !== 'undefined') {
  module.exports = {
    increment,
    resetClicks,
    addAttempt,
    getBestAttempt,
    getPercentage
  };
}