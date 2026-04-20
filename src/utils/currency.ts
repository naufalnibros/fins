// Utilitas format & parse mata uang Rupiah

/**
 * Format angka menjadi format Rupiah lengkap
 * Contoh: 150000 → "Rp 150.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format angka menjadi singkatan Rupiah
 * Contoh: 150000000 → "Rp 150 jt"
 */
export function formatRupiahShort(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)} M`
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)} jt`
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)} rb`
  return `Rp ${amount}`
}

/**
 * Parse string input Rupiah menjadi angka
 * Contoh: "Rp 150.000" → 150000
 */
export function parseRupiah(input: string): number {
  return parseInt(input.replace(/[^0-9]/g, ''), 10) || 0
}
