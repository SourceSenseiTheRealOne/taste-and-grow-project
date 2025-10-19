/**
 * Generates a unique school access code based on school ID
 * Format: XXXX-XXXX-XXXX (readable format)
 */
export function generateSchoolAccessCode(schoolId: string): string {
  // Use first 12 characters of school ID and format it
  const codeBase = schoolId.substring(0, 12).toUpperCase();
  const part1 = codeBase.substring(0, 4);
  const part2 = codeBase.substring(4, 8);
  const part3 = codeBase.substring(8, 12);
  return `${part1}-${part2}-${part3}`;
}

/**
 * Generates a unique parent link based on school ID and user ID
 * Format: /parent-link/[encoded-id]
 */
export function generateParentsLink(userId: string, schoolId: string): string {
  // Create a combined unique identifier
  const combinedId = `${userId}-${schoolId}`.substring(0, 16);
  // Encode to make it URL-safe
  const encoded = Buffer.from(combinedId).toString('base64').replace(/[=+/]/g, '');
  return `/parent-link/${encoded}`;
}

/**
 * Generates a unique QR code identifier
 */
export function generateQRCode(): string {
  return `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
