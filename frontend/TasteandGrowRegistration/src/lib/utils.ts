export function generateSchoolCode(schoolName: string): string {
  const prefix = schoolName
    .substring(0, 4)
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .padEnd(4, 'X');

  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const year = new Date().getFullYear();

  return `${prefix}-${random}-${year}`;
}

export function generateQRCode(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
