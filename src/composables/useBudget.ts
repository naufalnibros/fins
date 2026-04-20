// Composable untuk kalkulasi budget pernikahan

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBudgetStore } from '@/stores/budget.store'

export function useBudget() {
  const store = useBudgetStore()
  const { categories, totalBudget, totalUsed, remainingBudget, usagePercentage } =
    storeToRefs(store)

  // Warna progress bar berdasarkan persentase penggunaan
  const budgetStatusColor = computed(() => {
    if (usagePercentage.value >= 90) return 'bg-red-500'
    if (usagePercentage.value >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  })

  // Label status budget
  const budgetStatusLabel = computed(() => {
    if (usagePercentage.value >= 100) return 'Over Budget!'
    if (usagePercentage.value >= 90) return 'Hampir Habis'
    if (usagePercentage.value >= 75) return 'Waspada'
    return 'Aman'
  })

  return {
    categories,
    totalBudget,
    totalUsed,
    remainingBudget,
    usagePercentage,
    budgetStatusColor,
    budgetStatusLabel,
    // Actions
    setupBudget: store.setupBudget,
    updateCategoryBudget: store.updateCategoryBudget,
    addExpense: store.addExpense,
  }
}
