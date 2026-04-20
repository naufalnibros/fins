// Utilitas tanggal dan waktu

/**
 * Format Date menjadi string tanggal Indonesia
 * Contoh: "20 April 2026"
 */
export function formatDateId(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Format Date menjadi string pendek
 * Contoh: "20/04/2026"
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * Hitung sisa hari menuju tanggal tertentu
 * Mengembalikan negatif jika tanggal sudah lewat
 */
export function daysUntil(targetDate: Date): number {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Hitung persentase waktu yang sudah berlalu antara dua tanggal
 */
export function timeProgressPercentage(startDate: Date, endDate: Date): number {
  const now = new Date()
  const total = endDate.getTime() - startDate.getTime()
  const elapsed = now.getTime() - startDate.getTime()
  if (total <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}

/**
 * Parse string tanggal format YYYY-MM-DD menjadi Date
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00')
}
