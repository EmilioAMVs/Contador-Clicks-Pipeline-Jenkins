import { increment, resetClicks, addAttempt, getBestAttempt } from '../logic.js';

describe('Funciones de manejo de clicks', () => {

  test('increment() aumenta el valor en 1', () => {
    expect(increment(0)).toBe(1);
    expect(increment(5)).toBe(6);
  });

  test('resetClicks() reinicia el contador a 0', () => {
    expect(resetClicks()).toBe(0);
  });

  test('addAttempt() agrega un nuevo intento con total de clicks', () => {
    const prev = [10, 15];
    const result = addAttempt(prev, 20);
    expect(result).toEqual([10, 15, 20]);
  });

  test('getBestAttempt() devuelve el intento con más clicks', () => {
    expect(getBestAttempt([12, 8, 20, 17])).toBe(20);
    expect(getBestAttempt([])).toBe(0);
  });

});
