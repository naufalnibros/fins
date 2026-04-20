// Tipe-tipe untuk modul Post-Wedding (Rumah Tangga)

export type HouseholdItemStatus = 'not-bought' | 'planned' | 'bought'
export type LoanType = 'kpr' | 'kta' | 'cicilan-barang'

export interface HouseholdItem {
  id: string
  name: string
  estimatedMinPrice: number
  estimatedMaxPrice: number
  actualPrice: number | null
  priority: number
  status: HouseholdItemStatus
  purchasedAt: Date | null
  notes: string
}

export interface HouseholdBudget {
  amplopIncome: number
  remainingWeddingBudget: number
  otherIncome: number
  totalAvailable: number
  totalSpent: number
  remaining: number
}

export interface LoanCalculation {
  type: LoanType
  principalAmount: number
  annualInterestRate: number
  termMonths: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
}

export interface MergeFinanceData {
  partner1Name: string
  partner1MonthlyIncome: number
  partner2Name: string
  partner2MonthlyIncome: number
  combinedMonthlyIncome: number
  monthlyExpenses: number
  monthlySavingsTarget: number
  emergencyFundTarget: number
}

// Data amplop yang terkumpul di hari-H
export interface AmploRecord {
  id: string
  guestName: string
  relation: 'temanKantor' | 'keluargaDekat' | 'kenalanOrtu' | 'temanDekat' | 'other'
  amount: number
  isEnvelope: boolean // true = amplop fisik, false = transfer
  recordedAt: Date
  notes: string
}

export interface WeddingDayExpense {
  id: string
  categoryId: string
  description: string
  amount: number
  approvedBy: string | null
  status: 'pending' | 'approved' | 'rejected'
  recordedAt: Date
}
