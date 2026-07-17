/**
 * IV Drip Rate (gtts/min) — gravity infusion drop-rate from volume, time,
 * and drop factor. See CONTEXT.md ("Calculation module").
 */

export interface DripRateResult {
  /** Drops per minute. */
  dripRate: number;
  /** Infusion duration expressed as total minutes (hours*60 + minutes). */
  totalMinutes: number;
}

export function calculateDripRate(
  volume: number,
  hours: number,
  minutes: number,
  dropFactor: number
): DripRateResult {
  const totalMinutes = hours * 60 + minutes;
  const dripRate = totalMinutes > 0 ? (volume * dropFactor) / totalMinutes : 0;
  return { dripRate, totalMinutes };
}
