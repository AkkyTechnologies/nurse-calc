import { describe, expect, it } from 'vitest';
import { calculateDripRate } from './dripRate';

describe('calculateDripRate', () => {
  it('matches the app default (1000mL / 8h0m / drop factor 20 -> 41.67 gtts/min)', () => {
    const result = calculateDripRate(1000, 8, 0, 20);
    expect(result.totalMinutes).toBe(480);
    expect(result.dripRate).toBeCloseTo((1000 * 20) / 480);
  });

  it('accounts for a minutes component alongside hours', () => {
    const result = calculateDripRate(500, 1, 30, 15);
    expect(result.totalMinutes).toBe(90);
    expect(result.dripRate).toBeCloseTo((500 * 15) / 90);
  });

  it('returns zero when duration is zero, without dividing by zero', () => {
    const result = calculateDripRate(500, 0, 0, 20);
    expect(result.totalMinutes).toBe(0);
    expect(result.dripRate).toBe(0);
  });
});
