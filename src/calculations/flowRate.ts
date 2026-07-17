/**
 * IV Flow Rate & Duration — two independent bidirectional formulas:
 * volume+time -> rate (mL/hr), and volume+rate -> duration. See CONTEXT.md
 * ("Calculation module").
 */

export interface FlowRateResult {
  /** mL/hr. */
  rate: number;
  /** Delivery duration expressed as decimal hours (hours + minutes/60). */
  totalHours: number;
}

export function calculateFlowRate(volume: number, hours: number, minutes: number): FlowRateResult {
  const totalHours = hours + minutes / 60;
  const rate = totalHours > 0 ? volume / totalHours : 0;
  return { rate, totalHours };
}

export interface FlowDurationResult {
  /** Decimal hours (e.g. 2.5). */
  totalHoursDecimal: number;
  /** Whole hours component of the duration. */
  hours: number;
  /** Remaining minutes component of the duration. */
  minutes: number;
}

export function calculateFlowDuration(durationVolume: number, targetRate: number): FlowDurationResult {
  if (targetRate <= 0) {
    return { totalHoursDecimal: 0, hours: 0, minutes: 0 };
  }
  const totalHoursDecimal = durationVolume / targetRate;
  const hours = Math.floor(totalHoursDecimal);
  const minutes = Math.round((totalHoursDecimal - hours) * 60);
  return { totalHoursDecimal, hours, minutes };
}
