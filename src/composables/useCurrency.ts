// Composable untuk format & parse mata uang Rupiah
// Wrapper dari utils/currency.ts agar bisa digunakan di component

import { formatRupiah, formatRupiahShort, parseRupiah } from '@/utils/currency'

export function useCurrency() {
  return {
    formatRupiah,
    formatShort: formatRupiahShort,
    parseRupiah,
  }
}
