import { describe, expect, it } from 'vitest';
import { calculateFlowDuration, calculateFlowRate } from './flowRate';

describe('calculateFlowRate', () => {
  it('matches the app default (500mL / 4h0m -> 125 mL/hr)', () => {
    const result = calculateFlowRate(500, 4, 0);
    expect(result.totalHours).toBe(4);
    expect(result.rate).toBeCloseTo(125);
  });

  it('accounts for a minutes component in the duration', () => {
    const result = calculateFlowRate(300, 2, 30);
    expect(result.totalHours).toBeCloseTo(2.5);
    expect(result.rate).toBeCloseTo(120);
  });

  it('returns zero when duration is zero, without dividing by zero', () => {
    const result = calculateFlowRate(500, 0, 0);
    expect(result.rate).toBe(0);
  });
});

describe('calculateFlowDuration', () => {
  it('matches the app default (1000mL / 125 mL/hr -> 8h 0m)', () => {
    const result = calculateFlowDuration(1000, 125);
    expect(result.hours).toBe(8);
    expect(result.minutes).toBe(0);
  });

  it('splits a fractional-hour result into whole hours + rounded minutes', () => {
    const result = calculateFlowDuration(300, 120);
    expect(result.totalHoursDecimal).toBeCloseTo(2.5);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(30);
  });

  it('returns zero across the board when targetRate is zero, without dividing by zero', () => {
    const result = calculateFlowDuration(1000, 0);
    expect(result).toEqual({ totalHoursDecimal: 0, hours: 0, minutes: 0 });
  });
});
