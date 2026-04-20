// Store untuk kontributor dana pernikahan (pihak keluarga, dll)

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { Contributor } from '@/types/vendor.types'

const STORAGE_KEY = 'budgetin-contributors'

function loadContributors(): Contributor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Contributor[]
    return parsed.map((c) => ({
      ...c,
      confirmedAt: c.confirmedAt ? new Date(c.confirmedAt) : null,
    }))
  } catch {
    return []
  }
}

export const useContributorStore = defineStore('contributor', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const contributors = ref<Contributor[]>(loadContributors())
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const totalContribution = computed(() =>
    contributors.value.reduce((acc: number, c: Contributor) => acc + c.contributionAmount, 0)
  )

  const confirmedContribution = computed(() =>
    contributors.value
      .filter((c: Contributor) => c.confirmedAt !== null)
      .reduce((acc: number, c: Contributor) => acc + c.contributionAmount, 0)
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contributors.value))
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  function addContributor(data: Omit<Contributor, 'id'>): Contributor {
    const newContributor: Contributor = { id: uuidv4(), ...data }
    contributors.value.push(newContributor)
    persist()
    return newContributor
  }

  function updateContributor(id: string, data: Partial<Omit<Contributor, 'id'>>): void {
    const index = contributors.value.findIndex((c) => c.id === id)
    if (index === -1) return
    contributors.value[index] = { ...contributors.value[index], ...data }
    persist()
  }

  function deleteContributor(id: string): void {
    contributors.value = contributors.value.filter((c) => c.id !== id)
    persist()
  }

  function confirmContributor(id: string): void {
    const contributor = contributors.value.find((c) => c.id === id)
    if (!contributor) return
    contributor.confirmedAt = new Date()
    persist()
  }

  return {
    contributors,
    isLoading,
    error,
    totalContribution,
    confirmedContribution,
    addContributor,
    updateContributor,
    deleteContributor,
    confirmContributor,
  }
})
