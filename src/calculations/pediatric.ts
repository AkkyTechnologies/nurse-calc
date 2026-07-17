/**
 * Weight-Based Pediatric Dosing — mg/kg math, with an optional divided-doses
 * split for "per day" dosing. See CONTEXT.md ("Calculation module").
 */

export interface PediatricResult {
  /** Single-dose amount in mg. */
  singleDose: number;
  /** Total daily (or total) dose in mg. */
  totalDose: number;
}

/** Converts a weight to kilograms. Pounds use the standard 2.20462 lb/kg factor. */
export function convertWeightToKg(weight: number, unit: 'kg' | 'lb'): number {
  return unit === 'lb' ? weight / 2.20462 : weight;
}

export function calculatePediatricDose(
  weightInKg: number,
  doseMultiplier: number,
  dosingType: 'day' | 'dose',
  dividedBy: number
): PediatricResult {
  const div = dividedBy || 1;
  let totalDose = weightInKg * doseMultiplier;
  let singleDose = totalDose;

  if (dosingType === 'day') {
    singleDose = totalDose / div;
  } else {
    totalDose = singleDose * div;
  }

  return { singleDose, totalDose };
}
