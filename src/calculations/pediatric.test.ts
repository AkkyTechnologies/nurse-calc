import { describe, expect, it } from 'vitest';
import { calculatePediatricDose, convertWeightToKg } from './pediatric';

describe('convertWeightToKg', () => {
  it('passes kg through unchanged', () => {
    expect(convertWeightToKg(15, 'kg')).toBe(15);
  });

  it('converts lb to kg using the 2.20462 factor', () => {
    expect(convertWeightToKg(33, 'lb')).toBeCloseTo(33 / 2.20462);
  });
});

describe('calculatePediatricDose', () => {
  it('matches the app default: 15kg × 15mg/kg per-dose, divided by 1', () => {
    const result = calculatePediatricDose(15, 15, 'dose', 1);
    expect(result.singleDose).toBeCloseTo(225);
    expect(result.totalDose).toBeCloseTo(225);
  });

  it('per-day dosing splits the total across the divided-by count', () => {
    const result = calculatePediatricDose(15, 30, 'day', 3);
    expect(result.totalDose).toBeCloseTo(15 * 30);
    expect(result.singleDose).toBeCloseTo((15 * 30) / 3);
  });

  it('per-dose dosing multiplies the single dose back up into a total', () => {
    const result = calculatePediatricDose(20, 10, 'dose', 4);
    expect(result.singleDose).toBeCloseTo(200);
    expect(result.totalDose).toBeCloseTo(800);
  });

  it('falls back to dividing by 1 when dividedBy is 0, matching current parseInt(...)||1 behavior upstream', () => {
    const result = calculatePediatricDose(10, 10, 'day', 0);
    expect(result.singleDose).toBeCloseTo(100);
  });
});
