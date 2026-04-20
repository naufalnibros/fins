// Tipe-tipe untuk Savings Goals (Honeymoon, Dana Darurat, dll)

export type SavingsGoalType =
  | 'honeymoon'
  | 'emergency-fund'
  | 'insurance'
  | 'ring-gold'
  | 'custom'

export type SavingsGoalStatus = 'active' | 'completed' | 'paused'

export interface SavingsGoal {
  id: string
  type: SavingsGoalType
  name: string
  targetAmount: number
  currentAmount: number
  monthlyTarget: number
  deadline: Date | null
  status: SavingsGoalStatus
  icon: string
  color: string
  deposits: SavingsDeposit[]
  createdAt: Date
  updatedAt: Date
}

export interface SavingsDeposit {
  id: string
  goalId: string
  amount: number
  note: string
  depositedAt: Date
}

export interface SavingsGoalFormData {
  type: SavingsGoalType
  name: string
  targetAmount: number
  monthlyTarget: number
  deadline: string | null
}
