/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ISMP (Institute for Safe Medication Practices) safe-notation rule: always a
// leading zero for values under 1 (0.4, never .4), never a trailing zero
// (0.4, never 0.40) — trailing zeros are on ISMP's error-prone abbreviation
// list because "0.50" can be misread as "50" if the decimal point is missed.
// maxDecimals caps precision; trailing zeros within that cap are stripped.
export function formatDose(value: number, maxDecimals: number = 2): string {
  if (!Number.isFinite(value)) return '0';
  return parseFloat(value.toFixed(maxDecimals)).toString();
}
