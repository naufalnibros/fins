// Tipe-tipe untuk Monthly Budget post-wedding & template pernikahan

// ─── Monthly Budget (Use Case #13) ─────────────────────────────────────────
export type MonthlyExpenseCategory =
  | 'rent'
  | 'utilities'
  | 'groceries'
  | 'transport'
  | 'internet'
  | 'insurance'
  | 'installment'
  | 'entertainment'
  | 'savings'
  | 'other'

export type SplitMode = '50-50' | 'proportional' | 'custom'

export interface MonthlyExpenseItem {
  id: string
  category: MonthlyExpenseCategory
  name: string
  budgetedAmount: number
  actualAmount: number
  splitMode: SplitMode
  partner1Share: number
  partner2Share: number
  isPaid: boolean
  dueDate: number // tanggal jatuh tempo setiap bulan (1-31)
  notes: string
}

export interface MonthlyBudgetPlan {
  id: string
  monthYear: string // format: "2026-05"
  items: MonthlyExpenseItem[]
  totalBudgeted: number
  totalActual: number
  createdAt: Date
}

// ─── Loan Forecast (Use Case #12) ──────────────────────────────────────────
export interface LoanEntry {
  id: string
  name: string
  type: 'kpr' | 'motor' | 'kta' | 'cicilan-barang' | 'other'
  principalAmount: number
  monthlyPayment: number
  remainingMonths: number
  startDate: Date
  interestRate: number
  notes: string
}

export interface LoanForecastMonth {
  month: string // "2026-05"
  totalInstallments: number
  remainingBalance: number
  loans: { loanId: string; payment: number; remaining: number }[]
}

// ─── Anniversary Review (Use Case #14) ─────────────────────────────────────
export interface AnniversaryReview {
  weddingDate: Date
  preWeddingBudget: number
  preWeddingActual: number
  amploTotal: number
  postWeddingSpent: number
  currentSavings: number
  netPosition: number // amplop + sisa budget - pengeluaran post-wedding
  highlights: string[]
  createdAt: Date
}

// ─── Wedding Template (auto-generate) ──────────────────────────────────────
export interface WeddingTemplateConfig {
  coupleName: string
  weddingDate: string
  city: 'surabaya' | 'malang' | 'sidoarjo' | 'jakarta' | 'other'
  totalBudget: number
  guestCount: number
  includeHoneymoon: boolean
  honeymoonDestination: string
}

export interface TemplateSheet {
  name: string
  columns: TemplateColumn[]
  sampleRows: Record<string, string | number | boolean>[]
}

export interface TemplateColumn {
  key: string
  label: string
  type: 'text' | 'number' | 'currency' | 'date' | 'status' | 'percentage' | 'boolean'
  width: number
  required: boolean
  description: string
}

// ─── Insurance Recommendation (Use Case #11) ───────────────────────────────
export interface InsuranceRecommendation {
  type: 'jiwa' | 'kesehatan' | 'kendaraan'
  name: string
  monthlyPremium: { min: number; max: number }
  coverage: string
  priority: number
  notes: string
}
