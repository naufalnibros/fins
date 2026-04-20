// Tipe-tipe untuk modul Pre-Wedding (Budget Planning)

export type VendorCategory =
  | 'venue'
  | 'catering'
  | 'weddingOrganizer'
  | 'photographer'
  | 'videographer'
  | 'mua'
  | 'decoration'
  | 'invitation'
  | 'ring'
  | 'other'

export interface BudgetCategory {
  id: string
  name: string
  percentage: number
  allocatedAmount: number
  used: number
  color: string
  icon: string
}

export interface BudgetSummary {
  totalBudget: number
  totalUsed: number
  remainingBudget: number
  usagePercentage: number
  categories: BudgetCategory[]
}

export interface BudgetSetupForm {
  totalBudget: number
  weddingDate: string
  guestCount: number
  city: 'surabaya' | 'malang' | 'sidoarjo' | 'other'
}
