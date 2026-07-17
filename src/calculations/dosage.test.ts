import { describe, expect, it } from 'vitest';
import { calculateDosage, convertMassUnit } from './dosage';

describe('calculateDosage', () => {
  it('computes Desired/Have × Quantity with matching units (app default: 4mg / 10mg × 1mL)', () => {
    const result = calculateDosage(4, 'mg', 10, 'mg', 1);
    expect(result.volume).toBeCloseTo(0.4);
    expect(result.effectiveDose).toBe(4);
    expect(result.wasConverted).toBe(false);
  });

  it('converts mcg desired dose to mg to match have unit', () => {
    const result = calculateDosage(500, 'mcg', 25, 'mg', 5);
    expect(result.effectiveDose).toBeCloseTo(0.5);
    expect(result.volume).toBeCloseTo((0.5 / 25) * 5);
    expect(result.wasConverted).toBe(true);
  });

  it('converts mg desired dose to mcg to match have unit', () => {
    const result = calculateDosage(0.5, 'mg', 250, 'mcg', 2);
    expect(result.effectiveDose).toBeCloseTo(500);
    expect(result.wasConverted).toBe(true);
  });

  it('converts mg desired dose to g to match have unit', () => {
    const result = calculateDosage(500, 'mg', 1, 'g', 10);
    expect(result.effectiveDose).toBeCloseTo(0.5);
    expect(result.wasConverted).toBe(true);
  });

  it('converts g desired dose to mg to match have unit', () => {
    const result = calculateDosage(1, 'g', 500, 'mg', 10);
    expect(result.effectiveDose).toBeCloseTo(1000);
    expect(result.wasConverted).toBe(true);
  });

  it('does not convert unsupported unit pairs (e.g. units vs mL) — existing scope gap, preserved', () => {
    const result = calculateDosage(4, 'units', 10, 'mL', 1);
    expect(result.effectiveDose).toBe(4);
    expect(result.wasConverted).toBe(false);
    expect(result.volume).toBeCloseTo(0.4);
  });

  it('returns zero volume without dividing by zero when haveDose is 0', () => {
    const result = calculateDosage(4, 'mg', 0, 'mg', 1);
    expect(result.volume).toBe(0);
    expect(result.wasConverted).toBe(false);
  });
});

describe('convertMassUnit', () => {
  it('returns the same value when units already match', () => {
    expect(convertMassUnit(4, 'mg', 'mg')).toBe(4);
  });

  it('returns null for a pair with no defined conversion', () => {
    expect(convertMassUnit(4, 'mEq', 'mg')).toBeNull();
  });
});
