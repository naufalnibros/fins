// Store untuk manajemen budget pernikahan
// Menggunakan localStorage untuk persistensi data lokal

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { BudgetCategory } from '@/types/budget.types'
import { DEFAULT_BUDGET_DISTRIBUTION } from '@/utils/constants'

const STORAGE_KEY = 'budgetin-budget'

function loadFromStorage(): { categories: BudgetCategory[]; totalBudget: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useBudgetStore = defineStore('budget', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const saved = loadFromStorage()
  const categories = ref<BudgetCategory[]>(saved?.categories ?? [])
  const totalBudget = ref<number>(saved?.totalBudget ?? 0)
  const isSetup = ref<boolean>(categories.value.length > 0)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const totalUsed = computed(() =>
    categories.value.reduce((acc: number, c: BudgetCategory) => acc + c.used, 0)
  )

  const remainingBudget = computed(() => totalBudget.value - totalUsed.value)

  const usagePercentage = computed(() =>
    totalBudget.value > 0
      ? Math.round((totalUsed.value / totalBudget.value) * 100)
      : 0
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function persist(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ categories: categories.value, totalBudget: totalBudget.value })
    )
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Inisialisasi budget awal berdasarkan total budget yang diinput pengguna
   */
  function setupBudget(amount: number): void {
    totalBudget.value = amount
    categories.value = DEFAULT_BUDGET_DISTRIBUTION.map((dist) => ({
      id: uuidv4(),
      name: dist.name,
      percentage: dist.percentage,
      allocatedAmount: Math.round((amount * dist.percentage) / 100),
      used: 0,
      color: dist.color,
      icon: dist.icon,
    }))
    isSetup.value = true
    persist()
  }

  /**
   * Update alokasi budget untuk kategori tertentu
   */
  function updateCategoryBudget(categoryId: string, amount: number): void {
    const category = categories.value.find((c) => c.id === categoryId)
    if (!category) return
    category.allocatedAmount = amount
    category.percentage = Math.round((amount / totalBudget.value) * 100)
    persist()
  }

  /**
   * Catat pengeluaran ke kategori tertentu
   */
  function addExpense(categoryId: string, amount: number): void {
    const category = categories.value.find((c) => c.id === categoryId)
    if (!category) return
    category.used += amount
    persist()
  }

  /**
   * Reset pengeluaran kategori
   */
  function resetCategoryExpense(categoryId: string): void {
    const category = categories.value.find((c) => c.id === categoryId)
    if (!category) return
    category.used = 0
    persist()
  }

  return {
    categories,
    totalBudget,
    isSetup,
    totalUsed,
    remainingBudget,
    usagePercentage,
    setupBudget,
    updateCategoryBudget,
    addExpense,
    resetCategoryExpense,
  }
})
