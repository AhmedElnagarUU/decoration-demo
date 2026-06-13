/** Basic E.164 phone number validation (e.g. +1234567890). */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phoneNumber.trim());
}

export function normalizePhoneNumber(phoneNumber: string): string {
  const trimmed = phoneNumber.trim();
  if (trimmed.startsWith("+")) return trimmed;
  return `+${trimmed.replace(/\D/g, "")}`;
}
