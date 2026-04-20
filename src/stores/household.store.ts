// Store untuk pengelolaan rumah tangga pasca-nikah

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { HouseholdItem, HouseholdBudget, MergeFinanceData, LoanCalculation } from '@/types/household.types'
import { HOUSEHOLD_ITEMS } from '@/utils/constants'

const STORAGE_KEY = 'budgetin-household'

function loadItems(): HouseholdItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // Seed dari konstanta default
      return HOUSEHOLD_ITEMS.map((item) => ({
        id: uuidv4(),
        name: item.name,
        estimatedMinPrice: item.min,
        estimatedMaxPrice: item.max,
        actualPrice: null,
        priority: item.priority,
        status: 'not-bought' as const,
        purchasedAt: null,
        notes: '',
      }))
    }
    const parsed = JSON.parse(raw) as HouseholdItem[]
    return parsed.map((i) => ({
      ...i,
      purchasedAt: i.purchasedAt ? new Date(i.purchasedAt) : null,
    }))
  } catch {
    return []
  }
}

export const useHouseholdStore = defineStore('household', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const items = ref<HouseholdItem[]>(loadItems())
  const budget = ref<HouseholdBudget>({
    amplopIncome: 0,
    remainingWeddingBudget: 0,
    otherIncome: 0,
    totalAvailable: 0,
    totalSpent: 0,
    remaining: 0,
  })
  const mergeFinance = ref<MergeFinanceData | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const boughtItems = computed(() =>
    items.value.filter((i: HouseholdItem) => i.status === 'bought')
  )

  const totalActualSpent = computed(() =>
    boughtItems.value.reduce((acc: number, i: HouseholdItem) => acc + (i.actualPrice ?? 0), 0)
  )

  const completionPercentage = computed(() =>
    items.value.length > 0
      ? Math.round((boughtItems.value.length / items.value.length) * 100)
      : 0
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  function markItemBought(id: string, actualPrice: number): void {
    const item = items.value.find((i: HouseholdItem) => i.id === id)
    if (!item) return
    item.status = 'bought'
    item.actualPrice = actualPrice
    item.purchasedAt = new Date()
    persist()
  }

  function markItemPlanned(id: string): void {
    const item = items.value.find((i: HouseholdItem) => i.id === id)
    if (!item) return
    item.status = 'planned'
    persist()
  }

  function addCustomItem(data: Omit<HouseholdItem, 'id'>): HouseholdItem {
    const newItem: HouseholdItem = { id: uuidv4(), ...data }
    items.value.push(newItem)
    persist()
    return newItem
  }

  function updateBudget(data: Partial<HouseholdBudget>): void {
    budget.value = { ...budget.value, ...data }
    budget.value.totalAvailable =
      budget.value.amplopIncome +
      budget.value.remainingWeddingBudget +
      budget.value.otherIncome
    budget.value.totalSpent = totalActualSpent.value
    budget.value.remaining = budget.value.totalAvailable - budget.value.totalSpent
  }

  /**
   * Kalkulasi cicilan KPR/KTA menggunakan rumus anuitas
   */
  function calculateLoan(
    principalAmount: number,
    annualInterestRate: number,
    termMonths: number
  ): LoanCalculation {
    const monthlyRate = annualInterestRate / 100 / 12
    let monthlyPayment: number

    if (monthlyRate === 0) {
      monthlyPayment = principalAmount / termMonths
    } else {
      // Rumus anuitas: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      const factor = Math.pow(1 + monthlyRate, termMonths)
      monthlyPayment = (principalAmount * monthlyRate * factor) / (factor - 1)
    }

    const totalPayment = monthlyPayment * termMonths
    const totalInterest = totalPayment - principalAmount

    return {
      type: 'kpr',
      principalAmount,
      annualInterestRate,
      termMonths,
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    }
  }

  function saveMergeFinance(data: MergeFinanceData): void {
    mergeFinance.value = data
    localStorage.setItem('budgetin-merge-finance', JSON.stringify(data))
  }

  return {
    items,
    budget,
    mergeFinance,
    isLoading,
    error,
    boughtItems,
    totalActualSpent,
    completionPercentage,
    markItemBought,
    markItemPlanned,
    addCustomItem,
    updateBudget,
    calculateLoan,
    saveMergeFinance,
  }
})
