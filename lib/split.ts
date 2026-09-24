/**
 * Bill splitting utilities.
 * All calculations are performed in paise (integer arithmetic)
 * to avoid floating-point rounding errors.
 *
 * 1 INR = 100 paise
 */

export interface SplitResult {
  /** Amount each person pays, in INR (2 decimal places) */
  perPersonAmount: number;
  /** Total of all individual amounts — may differ from original by 1 paise due to rounding */
  totalCovered: number;
  /** Remainder in paise (0 or 1 for equal splits) */
  remainderPaise: number;
  /** Number of people */
  count: number;
}

/**
 * Calculates an equal split in paise to avoid floating-point issues.
 * Returns the per-person amount to 2 decimal places.
 */
export function calculateEqualSplit(totalINR: number, count: number): SplitResult {
  if (count <= 0) {
    return { perPersonAmount: 0, totalCovered: 0, remainderPaise: 0, count: 0 };
  }

  // Convert to paise (integer)
  const totalPaise = Math.round(totalINR * 100);
  const perPersonPaise = Math.floor(totalPaise / count);
  const remainderPaise = totalPaise - perPersonPaise * count;

  const perPersonAmount = perPersonPaise / 100;
  const totalCovered = (perPersonPaise * count) / 100;

  return {
    perPersonAmount,
    totalCovered,
    remainderPaise,
    count,
  };
}
