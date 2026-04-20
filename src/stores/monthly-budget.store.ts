// Store untuk Monthly Budget post-wedding & Loan Forecast

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type {
  MonthlyBudgetPlan,
  MonthlyExpenseItem,
  LoanEntry,
  LoanForecastMonth,
  SplitMode,
} from '@/types/monthly.types'
import { DEFAULT_MONTHLY_EXPENSES } from '@/utils/constants'

const BUDGET_KEY = 'budgetin-monthly-budget'
const LOAN_KEY = 'budgetin-loans'

function loadPlans(): MonthlyBudgetPlan[] {
  try {
    const raw = localStorage.getItem(BUDGET_KEY)
    if (!raw) return []
    return (JSON.parse(raw) as MonthlyBudgetPlan[]).map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }))
  } catch {
    return []
  }
}

function loadLoans(): LoanEntry[] {
  try {
    const raw = localStorage.getItem(LOAN_KEY)
    if (!raw) return []
    return (JSON.parse(raw) as LoanEntry[]).map((l) => ({
      ...l,
      startDate: new Date(l.startDate),
    }))
  } catch {
    return []
  }
}

export const useMonthlyBudgetStore = defineStore('monthlyBudget', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const plans = ref<MonthlyBudgetPlan[]>(loadPlans())
  const loans = ref<LoanEntry[]>(loadLoans())
  const isMerged = ref<boolean>(localStorage.getItem('budgetin-merged') === 'true')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const currentMonthKey = computed(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const currentPlan = computed(() =>
    plans.value.find((p: MonthlyBudgetPlan) => p.monthYear === currentMonthKey.value)
  )

  const totalMonthlyInstallments = computed(() =>
    loans.value.reduce((acc: number, l: LoanEntry) => acc + l.monthlyPayment, 0)
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function persistPlans(): void {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(plans.value))
  }

  function persistLoans(): void {
    localStorage.setItem(LOAN_KEY, JSON.stringify(loans.value))
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Generate plan bulanan baru berdasarkan template default
   * Otomatis dipanggil setelah merge finance
   */
  function createMonthlyPlan(
    monthYear: string,
    splitMode: SplitMode = '50-50',
    partner1Income = 0,
    partner2Income = 0
  ): MonthlyBudgetPlan {
    const totalIncome = partner1Income + partner2Income
    const items: MonthlyExpenseItem[] = DEFAULT_MONTHLY_EXPENSES.map((exp) => {
      const midBudget = Math.round((exp.min + exp.max) / 2)
      let p1Share = 0.5
      let p2Share = 0.5

      if (splitMode === 'proportional' && totalIncome > 0) {
        p1Share = partner1Income / totalIncome
        p2Share = partner2Income / totalIncome
      }

      return {
        id: uuidv4(),
        category: exp.category as MonthlyExpenseItem['category'],
        name: exp.name,
        budgetedAmount: midBudget,
        actualAmount: 0,
        splitMode,
        partner1Share: Math.round(midBudget * p1Share),
        partner2Share: Math.round(midBudget * p2Share),
        isPaid: false,
        dueDate: 1,
        notes: '',
      }
    })

    // Tambahkan total cicilan jika ada
    if (totalMonthlyInstallments.value > 0) {
      items.push({
        id: uuidv4(),
        category: 'installment',
        name: 'Cicilan (KPR/Motor/dll)',
        budgetedAmount: totalMonthlyInstallments.value,
        actualAmount: 0,
        splitMode,
        partner1Share: Math.round(totalMonthlyInstallments.value * 0.5),
        partner2Share: Math.round(totalMonthlyInstallments.value * 0.5),
        isPaid: false,
        dueDate: 1,
        notes: 'Otomatis dari data cicilan',
      })
    }

    const plan: MonthlyBudgetPlan = {
      id: uuidv4(),
      monthYear,
      items,
      totalBudgeted: items.reduce((a: number, i: MonthlyExpenseItem) => a + i.budgetedAmount, 0),
      totalActual: 0,
      createdAt: new Date(),
    }
    plans.value.push(plan)
    persistPlans()
    return plan
  }

  /**
   * Update item pengeluaran bulanan
   */
  function updateExpenseItem(planId: string, itemId: string, actualAmount: number): void {
    const plan = plans.value.find((p: MonthlyBudgetPlan) => p.id === planId)
    if (!plan) return
    const item = plan.items.find((i: MonthlyExpenseItem) => i.id === itemId)
    if (!item) return
    item.actualAmount = actualAmount
    item.isPaid = true
    plan.totalActual = plan.items.reduce((a: number, i: MonthlyExpenseItem) => a + i.actualAmount, 0)
    persistPlans()
  }

  /**
   * Tambah cicilan baru (KPR, Motor, dll)
   */
  function addLoan(data: Omit<LoanEntry, 'id'>): LoanEntry {
    const loan: LoanEntry = { id: uuidv4(), ...data }
    loans.value.push(loan)
    persistLoans()
    return loan
  }

  function deleteLoan(id: string): void {
    loans.value = loans.value.filter((l: LoanEntry) => l.id !== id)
    persistLoans()
  }

  /**
   * Forecast saldo 12 bulan ke depan (Use Case #12)
   * Hitung berapa sisa saldo setelah semua cicilan
   */
  function generateLoanForecast(monthlyIncome: number): LoanForecastMonth[] {
    const forecast: LoanForecastMonth[] = []
    const now = new Date()

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      const loanDetails = loans.value
        .filter((l: LoanEntry) => l.remainingMonths > i)
        .map((l: LoanEntry) => ({
          loanId: l.id,
          payment: l.monthlyPayment,
          remaining: l.principalAmount - l.monthlyPayment * (i + 1),
        }))

      const totalInstall = loanDetails.reduce((a, d) => a + d.payment, 0)

      forecast.push({
        month: monthKey,
        totalInstallments: totalInstall,
        remainingBalance: monthlyIncome - totalInstall,
        loans: loanDetails,
      })
    }
    return forecast
  }

  /**
   * Merge Finance Mode — tandai bahwa pasangan sudah merge keuangan
   */
  function activateMergeMode(): void {
    isMerged.value = true
    localStorage.setItem('budgetin-merged', 'true')

    // Otomatis buat plan bulan ini jika belum ada
    if (!currentPlan.value) {
      createMonthlyPlan(currentMonthKey.value)
    }
  }

  return {
    plans,
    loans,
    isMerged,
    isLoading,
    error,
    currentMonthKey,
    currentPlan,
    totalMonthlyInstallments,
    createMonthlyPlan,
    updateExpenseItem,
    addLoan,
    deleteLoan,
    generateLoanForecast,
    activateMergeMode,
  }
})
