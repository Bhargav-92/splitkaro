/** Formats a number as Indian Rupees */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Formats a number as Indian Rupees with always 2 decimal places */
export function formatINRDecimal(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Truncates a long UPI ID for display */
export function truncateUpiId(upiId: string, maxLen = 30): string {
  if (upiId.length <= maxLen) return upiId;
  return upiId.slice(0, maxLen - 3) + "...";
}
