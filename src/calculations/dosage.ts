/**
 * Medication Dosage calculation — Desired / Have × Quantity, with mg/mcg/g
 * unit conversion. See CONTEXT.md ("Calculation module") and
 * docs/adr/0001-independent-calculation-modules.md for why this table lives
 * only here and isn't shared across calculators.
 *
 * Scope, preserved deliberately from the pre-extraction behavior: only mass
 * units (mcg/mg/g) convert. Picking "units", "mL", or "mEq" against a
 * mismatched unit produces no conversion (wasConverted stays false) — that's
 * an existing product-scope gap, not something this extraction changes.
 */

export interface DosageResult {
  /** Final calculated volume/quantity to administer. */
  volume: number;
  /** The desired dose after unit conversion (or unchanged, if no conversion applied). */
  effectiveDose: number;
  /** Whether desiredDose was converted to match haveUnit before the volume calc. */
  wasConverted: boolean;
}

const MASS_CONVERSION_FACTORS: Record<string, number> = {
  'mcg->mg': 0.001,
  'mg->mcg': 1000,
  'mg->g': 0.001,
  'g->mg': 1000,
};

/**
 * Converts a mass value from one unit to another. Returns null when the
 * unit pair isn't a supported mass conversion (including non-mass units
 * like "units", "mL", "mEq") — callers treat null as "no conversion available".
 */
export function convertMassUnit(value: number, fromUnit: string, toUnit: string): number | null {
  if (fromUnit === toUnit) return value;
  const factor = MASS_CONVERSION_FACTORS[`${fromUnit}->${toUnit}`];
  return factor === undefined ? null : value * factor;
}

export function calculateDosage(
  desiredDose: number,
  desiredUnit: string,
  haveDose: number,
  haveUnit: string,
  quantity: number
): DosageResult {
  if (haveDose <= 0) {
    return { volume: 0, effectiveDose: desiredDose, wasConverted: false };
  }

  const converted = convertMassUnit(desiredDose, desiredUnit, haveUnit);
  const effectiveDose = converted !== null ? converted : desiredDose;
  const wasConverted = converted !== null && desiredUnit !== haveUnit;

  return {
    volume: (effectiveDose / haveDose) * quantity,
    effectiveDose,
    wasConverted,
  };
}
