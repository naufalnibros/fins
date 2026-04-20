// Composable untuk counter amplop dan estimasi pendapatan hari-H

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeddingDayStore } from '@/stores/wedding-day.store'
import { AMPLOP_ESTIMATES } from '@/utils/constants'

export function useAmplop() {
  const store = useWeddingDayStore()
  const { amploRecords, isLoading } = storeToRefs(store)

  // Total semua amplop yang terkumpul
  const totalAmploAmount = computed(() =>
    amploRecords.value.reduce((acc, r) => acc + r.amount, 0)
  )

  // Jumlah amplop fisik
  const envelopeCount = computed(() =>
    amploRecords.value.filter((r) => r.isEnvelope).length
  )

  // Jumlah transfer digital
  const transferCount = computed(() =>
    amploRecords.value.filter((r) => !r.isEnvelope).length
  )

  // Estimasi pendapatan berdasarkan jumlah tamu per kategori
  function estimateAmploIncome(guestCounts: {
    temanKantor: number
    keluargaDekat: number
    kenalanOrtu: number
    temanDekat: number
    other: number
  }): { minEstimate: number; maxEstimate: number; midEstimate: number } {
    let minEstimate = 0
    let maxEstimate = 0

    for (const [relation, count] of Object.entries(guestCounts)) {
      const key = relation as keyof typeof AMPLOP_ESTIMATES
      if (key in AMPLOP_ESTIMATES) {
        minEstimate += AMPLOP_ESTIMATES[key].min * count
        maxEstimate += AMPLOP_ESTIMATES[key].max * count
      }
    }

    return {
      minEstimate,
      maxEstimate,
      midEstimate: Math.round((minEstimate + maxEstimate) / 2),
    }
  }

  return {
    amploRecords,
    isLoading,
    totalAmploAmount,
    envelopeCount,
    transferCount,
    estimateAmploIncome,
    // Actions
    addAmploRecord: store.addAmploRecord,
    deleteAmploRecord: store.deleteAmploRecord,
  }
}
