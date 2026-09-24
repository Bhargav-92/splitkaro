/**
 * Generates a properly encoded UPI payment URI.
 * The QR code containing this URI, when scanned by a UPI app,
 * opens a payment screen pre-filled with receiver details and amount.
 *
 * Format: upi://pay?pa={UPI_ID}&pn={NAME}&am={AMOUNT}&cu=INR&tn={NOTE}
 *
 * Security: All parameters are encoded via URLSearchParams to prevent injection.
 * The receiver's UPI ID is the payment destination — the app NEVER collects payer UPI IDs or PINs.
 */
export function generateUpiUri({
  receiverUpiId,
  receiverName,
  amount,
  paymentNote,
}: {
  receiverUpiId: string;
  receiverName: string;
  amount: number;
  paymentNote: string;
}): string {
  // Format amount to exactly 2 decimal places (paise precision)
  const formattedAmount = amount.toFixed(2);

  // URLSearchParams handles proper encoding of all special characters
  const params = new URLSearchParams({
    pa: receiverUpiId,
    pn: receiverName,
    am: formattedAmount,
    cu: "INR",
    tn: paymentNote,
  });

  return `upi://pay?${params.toString()}`;
}

/**
 * Validates that a string looks like a UPI ID.
 * UPI IDs follow the pattern: localpart@provider
 * e.g., example@upi, user@okicici, mobile@paytm
 */
export function isValidUpiId(upiId: string): boolean {
  // Basic UPI ID validation: must have exactly one @ with non-empty parts
  const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  return upiPattern.test(upiId.trim());
}
