// Store untuk Savings Goals: Honeymoon, Dana Darurat, Cincin/Emas, dll

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { SavingsGoal, SavingsDeposit, SavingsGoalFormData, SavingsGoalType } from '@/types/savings.types'

const STORAGE_KEY = 'budgetin-savings-goals'

function loadGoals(): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavingsGoal[]
    return parsed.map((g) => ({
      ...g,
      deadline: g.deadline ? new Date(g.deadline) : null,
      createdAt: new Date(g.createdAt),
      updatedAt: new Date(g.updatedAt),
      deposits: g.deposits.map((d) => ({
        ...d,
        depositedAt: new Date(d.depositedAt),
      })),
    }))
  } catch {
    return []
  }
}

// Icon & warna default per tipe goal
const GOAL_DEFAULTS: Record<SavingsGoalType, { icon: string; color: string }> = {
  honeymoon: { icon: '✈️', color: '#06b6d4' },
  'emergency-fund': { icon: '🛡️', color: '#10b981' },
  insurance: { icon: '🏥', color: '#8b5cf6' },
  'ring-gold': { icon: '💍', color: '#f59e0b' },
  custom: { icon: '🎯', color: '#6366f1' },
}

export const useSavingsStore = defineStore('savings', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const goals = ref<SavingsGoal[]>(loadGoals())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const activeGoals = computed(() =>
    goals.value.filter((g: SavingsGoal) => g.status === 'active')
  )

  const totalSaved = computed(() =>
    goals.value.reduce((acc: number, g: SavingsGoal) => acc + g.currentAmount, 0)
  )

  const totalTarget = computed(() =>
    activeGoals.value.reduce((acc: number, g: SavingsGoal) => acc + g.targetAmount, 0)
  )

  const overallProgress = computed(() =>
    totalTarget.value > 0
      ? Math.round((totalSaved.value / totalTarget.value) * 100)
      : 0
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals.value))
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  function addGoal(formData: SavingsGoalFormData): SavingsGoal {
    const defaults = GOAL_DEFAULTS[formData.type]
    const now = new Date()
    const goal: SavingsGoal = {
      id: uuidv4(),
      type: formData.type,
      name: formData.name,
      targetAmount: formData.targetAmount,
      currentAmount: 0,
      monthlyTarget: formData.monthlyTarget,
      deadline: formData.deadline ? new Date(formData.deadline) : null,
      status: 'active',
      icon: defaults.icon,
      color: defaults.color,
      deposits: [],
      createdAt: now,
      updatedAt: now,
    }
    goals.value.push(goal)
    persist()
    return goal
  }

  function addDeposit(goalId: string, amount: number, note = ''): void {
    const goal = goals.value.find((g: SavingsGoal) => g.id === goalId)
    if (!goal) return

    const deposit: SavingsDeposit = {
      id: uuidv4(),
      goalId,
      amount,
      note,
      depositedAt: new Date(),
    }
    goal.deposits.push(deposit)
    goal.currentAmount += amount
    goal.updatedAt = new Date()

    // Otomatis tandai selesai jika target tercapai
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed'
    }
    persist()
  }

  function pauseGoal(goalId: string): void {
    const goal = goals.value.find((g: SavingsGoal) => g.id === goalId)
    if (!goal) return
    goal.status = 'paused'
    goal.updatedAt = new Date()
    persist()
  }

  function resumeGoal(goalId: string): void {
    const goal = goals.value.find((g: SavingsGoal) => g.id === goalId)
    if (!goal) return
    goal.status = 'active'
    goal.updatedAt = new Date()
    persist()
  }

  function deleteGoal(goalId: string): void {
    goals.value = goals.value.filter((g: SavingsGoal) => g.id !== goalId)
    persist()
  }

  /**
   * Buat goal Dana Darurat otomatis berdasarkan pengeluaran bulanan
   */
  function createEmergencyFundGoal(monthlyExpenses: number, targetMonths = 6): SavingsGoal {
    return addGoal({
      type: 'emergency-fund',
      name: `Dana Darurat ${targetMonths} Bulan`,
      targetAmount: monthlyExpenses * targetMonths,
      monthlyTarget: Math.round((monthlyExpenses * targetMonths) / 12),
      deadline: null,
    })
  }

  /**
   * Buat goal Honeymoon dengan estimasi dari destinasi
   */
  function createHoneymoonGoal(
    destination: string,
    targetAmount: number,
    deadline: string | null
  ): SavingsGoal {
    const monthsLeft = deadline
      ? Math.max(1, Math.ceil((new Date(deadline).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)))
      : 12

    return addGoal({
      type: 'honeymoon',
      name: `Honeymoon ${destination}`,
      targetAmount,
      monthlyTarget: Math.round(targetAmount / monthsLeft),
      deadline,
    })
  }

  return {
    goals,
    isLoading,
    error,
    activeGoals,
    totalSaved,
    totalTarget,
    overallProgress,
    addGoal,
    addDeposit,
    pauseGoal,
    resumeGoal,
    deleteGoal,
    createEmergencyFundGoal,
    createHoneymoonGoal,
  }
})
