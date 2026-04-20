<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHouseholdStore } from '@/stores/household.store'
import { useCurrency } from '@/composables/useCurrency'
import AppButton from '@/components/common/AppButton.vue'
import type { LoanCalculation } from '@/types/household.types'

const store = useHouseholdStore()
const { formatRupiah } = useCurrency()

const principalAmount = ref<number>(500_000_000)
const annualInterestRate = ref<number>(7.5)
const termYears = ref<number>(15)

const result = ref<LoanCalculation | null>(null)

const termMonths = computed(() => termYears.value * 12)

function calculate() {
  result.value = store.calculateLoan(
    principalAmount.value,
    annualInterestRate.value,
    termMonths.value
  )
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
    <h3 class="font-semibold text-gray-900">Kalkulator KPR / Cicilan</h3>

    <div class="space-y-3">
      <div>
        <label class="text-xs font-medium text-gray-700">Nilai Pinjaman (Rp)</label>
        <input
          v-model.number="principalAmount"
          type="number"
          min="0"
          step="10000000"
          class="mt-1 w-full rounded-lg border-gray-300 text-sm"
        />
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Bunga per Tahun (%)</label>
        <input
          v-model.number="annualInterestRate"
          type="number"
          min="0"
          max="100"
          step="0.1"
          class="mt-1 w-full rounded-lg border-gray-300 text-sm"
        />
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Tenor (tahun)</label>
        <input
          v-model.number="termYears"
          type="number"
          min="1"
          max="30"
          class="mt-1 w-full rounded-lg border-gray-300 text-sm"
        />
      </div>
    </div>

    <AppButton variant="primary" full-width @click="calculate">Hitung Cicilan</AppButton>

    <!-- Hasil Kalkulasi -->
    <div v-if="result" class="bg-purple-50 rounded-xl p-4 space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Cicilan per Bulan</span>
        <span class="font-bold text-purple-700 text-base">{{ formatRupiah(result.monthlyPayment) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Total Pembayaran</span>
        <span class="font-semibold text-gray-800">{{ formatRupiah(result.totalPayment) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Total Bunga</span>
        <span class="font-semibold text-red-600">{{ formatRupiah(result.totalInterest) }}</span>
      </div>
      <div class="text-xs text-gray-400 pt-1">
        Tenor {{ termYears }} tahun ({{ termMonths }} bulan) · bunga {{ annualInterestRate }}%/tahun
      </div>
    </div>
  </div>
</template>
