// Konstanta domain bisnis Budgetin Wedding
// Harga referensi untuk wilayah Surabaya, Malang, Sidoarjo tahun 2026

import type { BudgetCategory } from '@/types/budget.types'
import type { InsuranceRecommendation } from '@/types/monthly.types'

// ─── Rentang Harga Vendor ─────────────────────────────────────────────────────
export const VENDOR_PRICE_RANGES = {
  venue: { min: 40_000_000, max: 120_000_000 },
  catering: { min: 85_000, max: 200_000 }, // per pax
  weddingOrganizer: { min: 15_000_000, max: 50_000_000 },
  photographer: { min: 10_000_000, max: 40_000_000 },
  videographer: { min: 8_000_000, max: 30_000_000 },
  mua: { min: 3_000_000, max: 8_000_000 },
  decoration: { min: 15_000_000, max: 60_000_000 },
  invitation: { min: 2_000, max: 8_000 }, // per lembar
  ring: { min: 5_000_000, max: 30_000_000 },
  other: { min: 0, max: 0 },
} as const

// ─── Distribusi Budget Default ────────────────────────────────────────────────
// Total harus 100%
export const DEFAULT_BUDGET_DISTRIBUTION: Omit<BudgetCategory, 'id' | 'allocatedAmount' | 'used'>[] = [
  { name: 'Catering', percentage: 35, color: '#f43f5e', icon: '🍽️' },
  { name: 'Gedung / Venue', percentage: 25, color: '#8b5cf6', icon: '🏛️' },
  { name: 'Wedding Organizer', percentage: 10, color: '#06b6d4', icon: '📋' },
  { name: 'Dekorasi', percentage: 9, color: '#10b981', icon: '🌸' },
  { name: 'Dokumentasi', percentage: 8, color: '#f59e0b', icon: '📸' },
  { name: 'Gaun & MUA', percentage: 6, color: '#ec4899', icon: '👗' },
  { name: 'Undangan & Souvenir', percentage: 4, color: '#6366f1', icon: '💌' },
  { name: 'Lain-lain', percentage: 3, color: '#94a3b8', icon: '📦' },
]

// ─── Estimasi Amplop per Tamu ─────────────────────────────────────────────────
export const AMPLOP_ESTIMATES = {
  temanKantor: { min: 150_000, max: 300_000, label: 'Teman Kantor' },
  keluargaDekat: { min: 300_000, max: 1_000_000, label: 'Keluarga Dekat' },
  kenalanOrtu: { min: 500_000, max: 2_000_000, label: 'Kenalan Orang Tua' },
  temanDekat: { min: 200_000, max: 500_000, label: 'Teman Dekat' },
  other: { min: 100_000, max: 500_000, label: 'Lainnya' },
} as const

// ─── Household Starter Kit ────────────────────────────────────────────────────
export const HOUSEHOLD_ITEMS = [
  { name: 'Kasur & Bed Frame', min: 4_000_000, max: 8_000_000, priority: 1 },
  { name: 'Kulkas 2 Pintu', min: 3_000_000, max: 6_000_000, priority: 2 },
  { name: 'Mesin Cuci', min: 2_000_000, max: 4_000_000, priority: 3 },
  { name: 'AC 1 PK', min: 3_000_000, max: 5_000_000, priority: 4 },
  { name: 'Kompor + Gas', min: 500_000, max: 2_000_000, priority: 5 },
  { name: 'Sofa + Meja', min: 2_000_000, max: 5_000_000, priority: 6 },
  { name: 'Lemari Pakaian', min: 1_500_000, max: 4_000_000, priority: 7 },
  { name: 'TV + Bracket', min: 2_000_000, max: 6_000_000, priority: 8 },
] as const

// ─── Kota yang Didukung ───────────────────────────────────────────────────────
export const SUPPORTED_CITIES = [
  { value: 'surabaya', label: 'Surabaya' },
  { value: 'malang', label: 'Malang' },
  { value: 'sidoarjo', label: 'Sidoarjo' },
  { value: 'other', label: 'Kota Lain' },
] as const

// ─── Batas Jumlah ─────────────────────────────────────────────────────────────
export const MAX_VENDOR_COUNT = 50
export const MAX_GUEST_COUNT = 2000
export const MIN_BUDGET_AMOUNT = 10_000_000

// ─── Label Status Vendor ──────────────────────────────────────────────────────
export const VENDOR_STATUS_LABELS = {
  quoted: { label: 'Penawaran', color: 'bg-yellow-100 text-yellow-800' },
  'dp-paid': { label: 'DP Lunas', color: 'bg-blue-100 text-blue-800' },
  settled: { label: 'Lunas', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
} as const

// ─── Kategori Vendor Label ────────────────────────────────────────────────────
export const VENDOR_CATEGORY_LABELS: Record<string, string> = {
  venue: 'Gedung / Venue',
  catering: 'Catering',
  weddingOrganizer: 'Wedding Organizer',
  photographer: 'Fotografer',
  videographer: 'Videografer',
  mua: 'Gaun & MUA',
  decoration: 'Dekorasi',
  invitation: 'Undangan & Souvenir',
  ring: 'Cincin',
  other: 'Lainnya',
}

// ─── Honeymoon Destinations (Use Case #5) ─────────────────────────────────
export const HONEYMOON_DESTINATIONS = [
  { name: 'Bali (Domestik)', estimatedCost: { min: 8_000_000, max: 20_000_000 }, duration: '4-5 hari' },
  { name: 'Yogyakarta (Domestik)', estimatedCost: { min: 4_000_000, max: 10_000_000 }, duration: '3-4 hari' },
  { name: 'Labuan Bajo (Domestik)', estimatedCost: { min: 10_000_000, max: 25_000_000 }, duration: '4-5 hari' },
  { name: 'Raja Ampat (Domestik)', estimatedCost: { min: 15_000_000, max: 35_000_000 }, duration: '5-7 hari' },
  { name: 'Singapore (Asia)', estimatedCost: { min: 12_000_000, max: 25_000_000 }, duration: '3-4 hari' },
  { name: 'Thailand (Asia)', estimatedCost: { min: 10_000_000, max: 22_000_000 }, duration: '4-5 hari' },
  { name: 'Jepang (Asia)', estimatedCost: { min: 20_000_000, max: 45_000_000 }, duration: '5-7 hari' },
  { name: 'Maldives (Internasional)', estimatedCost: { min: 35_000_000, max: 80_000_000 }, duration: '4-5 hari' },
  { name: 'Eropa (Internasional)', estimatedCost: { min: 40_000_000, max: 100_000_000 }, duration: '7-10 hari' },
] as const

// ─── Biaya Hidup Bulanan Default Surabaya 2026 (Use Case #13) ─────────────
export const DEFAULT_MONTHLY_EXPENSES = [
  { category: 'rent', name: 'Sewa Kos/Rumah', min: 1_500_000, max: 5_000_000, icon: '🏠' },
  { category: 'utilities', name: 'Listrik + Air + Gas', min: 300_000, max: 800_000, icon: '⚡' },
  { category: 'internet', name: 'Internet + HP', min: 200_000, max: 500_000, icon: '📶' },
  { category: 'groceries', name: 'Belanja Dapur & Makan', min: 2_000_000, max: 4_000_000, icon: '🛒' },
  { category: 'transport', name: 'Bensin / Transport', min: 500_000, max: 1_500_000, icon: '⛽' },
  { category: 'insurance', name: 'Asuransi (Kesehatan + Jiwa)', min: 300_000, max: 1_000_000, icon: '🛡️' },
  { category: 'entertainment', name: 'Hiburan & Sosial', min: 300_000, max: 1_000_000, icon: '🎬' },
  { category: 'savings', name: 'Tabungan & Investasi', min: 500_000, max: 3_000_000, icon: '💰' },
  { category: 'other', name: 'Lain-lain (Buffer)', min: 200_000, max: 500_000, icon: '📦' },
] as const

// ─── Rekomendasi Asuransi Pasangan Baru (Use Case #11) ───────────────────
export const INSURANCE_RECOMMENDATIONS: InsuranceRecommendation[] = [
  {
    type: 'kesehatan',
    name: 'BPJS Kesehatan (Kelas 1)',
    monthlyPremium: { min: 150_000, max: 300_000 },
    coverage: 'Rawat inap + jalan, 2 orang',
    priority: 1,
    notes: 'Wajib punya. Daftarkan pasangan sebagai tanggungan.',
  },
  {
    type: 'jiwa',
    name: 'Asuransi Jiwa Term Life',
    monthlyPremium: { min: 100_000, max: 500_000 },
    coverage: 'UP 200-500 juta, proteksi 10-20 tahun',
    priority: 2,
    notes: 'Penting jika sudah punya cicilan KPR.',
  },
  {
    type: 'kesehatan',
    name: 'Asuransi Kesehatan Swasta (Top-up)',
    monthlyPremium: { min: 300_000, max: 1_000_000 },
    coverage: 'Rawat inap kamar VIP, cashless di RS swasta',
    priority: 3,
    notes: 'Opsional, tapi sangat membantu jika BPJS tidak cukup.',
  },
  {
    type: 'kendaraan',
    name: 'Asuransi Kendaraan All-Risk',
    monthlyPremium: { min: 200_000, max: 500_000 },
    coverage: 'All-risk + TJH pihak ketiga',
    priority: 4,
    notes: 'Wajib jika punya mobil, opsional untuk motor.',
  },
]

// ─── Harga Emas Referensi per gram (Use Case #4) ─────────────────────────
// Update berkala, digunakan untuk estimasi harga cincin
export const GOLD_PRICE_REFERENCE = {
  per_gram_24k: 1_350_000,     // Harga emas 24 karat per gram (Q2 2026)
  per_gram_22k: 1_240_000,     // Harga emas 22 karat per gram
  per_gram_18k: 1_015_000,     // Harga emas 18 karat per gram
  lastUpdated: '2026-04-01',
} as const

// ─── Approval Threshold (Use Case #8) ────────────────────────────────────
// Batas nominal pengeluaran yang memerlukan persetujuan
export const APPROVAL_THRESHOLD_AMOUNT = 5_000_000

// ─── Emergency Fund Rules (Use Case #11) ─────────────────────────────────
export const EMERGENCY_FUND_MONTHS = 6 // Target: 6 bulan pengeluaran
export const EMERGENCY_FUND_MIN_MONTHS = 3 // Minimum: 3 bulan pengeluaran
