// Store untuk pengelolaan hari-H (amplop, pengeluaran real-time, approval)

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { AmploRecord, WeddingDayExpense } from '@/types/household.types'
import { APPROVAL_THRESHOLD_AMOUNT } from '@/utils/constants'

const AMPLOP_KEY = 'budgetin-amplop'
const EXPENSE_KEY = 'budgetkun-expenses'

function loadAmplop(): AmploRecord[] {
  try {
    const raw = localStorage.getItem(AMPLOP_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AmploRecord[]
    return parsed.map((r) => ({ ...r, recordedAt: new Date(r.recordedAt) }))
  } catch {
    return []
  }
}

function loadExpenses(): WeddingDayExpense[] {
  try {
    const raw = localStorage.getItem(EXPENSE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as WeddingDayExpense[]
    return parsed.map((e) => ({ ...e, recordedAt: new Date(e.recordedAt) }))
  } catch {
    return []
  }
}

export const useWeddingDayStore = defineStore('weddingDay', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const amploRecords = ref<AmploRecord[]>(loadAmplop())
  const expenses = ref<WeddingDayExpense[]>(loadExpenses())
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const totalAmploIncome = computed(() =>
    amploRecords.value.reduce((acc: number, r: AmploRecord) => acc + r.amount, 0)
  )

  const totalExpenses = computed(() =>
    expenses.value
      .filter((e: WeddingDayExpense) => e.status === 'approved')
      .reduce((acc: number, e: WeddingDayExpense) => acc + e.amount, 0)
  )

  const pendingExpenses = computed(() =>
    expenses.value.filter((e: WeddingDayExpense) => e.status === 'pending')
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function persistAmplop(): void {
    localStorage.setItem(AMPLOP_KEY, JSON.stringify(amploRecords.value))
  }

  function persistExpenses(): void {
    localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses.value))
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  function addAmploRecord(data: Omit<AmploRecord, 'id' | 'recordedAt'>): AmploRecord {
    const record: AmploRecord = {
      id: uuidv4(),
      ...data,
      recordedAt: new Date(),
    }
    amploRecords.value.push(record)
    persistAmplop()
    return record
  }

  function deleteAmploRecord(id: string): void {
    amploRecords.value = amploRecords.value.filter((r: AmploRecord) => r.id !== id)
    persistAmplop()
  }

  function addExpense(data: Omit<WeddingDayExpense, 'id' | 'recordedAt' | 'status' | 'approvedBy'>): WeddingDayExpense {
    // Use Case #8: Pengeluaran di bawah threshold langsung auto-approve
    const needsApproval = data.amount >= APPROVAL_THRESHOLD_AMOUNT
    const expense: WeddingDayExpense = {
      id: uuidv4(),
      ...data,
      status: needsApproval ? 'pending' : 'approved',
      approvedBy: needsApproval ? null : 'auto',
      recordedAt: new Date(),
    }
    expenses.value.push(expense)
    persistExpenses()
    return expense
  }

  function approveExpense(id: string, approvedBy: string): void {
    const expense = expenses.value.find((e: WeddingDayExpense) => e.id === id)
    if (!expense) return
    expense.status = 'approved'
    expense.approvedBy = approvedBy
    persistExpenses()
  }

  function rejectExpense(id: string): void {
    const expense = expenses.value.find((e: WeddingDayExpense) => e.id === id)
    if (!expense) return
    expense.status = 'rejected'
    persistExpenses()
  }

  return {
    amploRecords,
    expenses,
    isLoading,
    error,
    totalAmploIncome,
    totalExpenses,
    pendingExpenses,
    addAmploRecord,
    deleteAmploRecord,
    addExpense,
    approveExpense,
    rejectExpense,
  }
})
