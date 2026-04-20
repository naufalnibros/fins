<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMonthlyBudgetStore } from '@/stores/monthly-budget.store'
import { useCurrency } from '@/composables/useCurrency'
import AppButton from '@/components/common/AppButton.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import type { SplitMode } from '@/types/monthly.types'

const store = useMonthlyBudgetStore()
const { formatRupiah } = useCurrency()

const step = ref(1)
const incomeA = ref(0)
const incomeB = ref(0)
const selectedMode = ref<SplitMode>('50-50')
const customRatioA = ref(50)

const totalIncome = computed(() => incomeA.value + incomeB.value)
const ratioA = computed(() => {
  if (selectedMode.value === '50-50') return 50
  if (selectedMode.value === 'proportional' && totalIncome.value > 0)
    return Math.round((incomeA.value / totalIncome.value) * 100)
  return customRatioA.value
})
const ratioB = computed(() => 100 - ratioA.value)

function finalize() {
  store.activateMergeMode()
  step.value = 3
}
</script>

<template>
  <div class="bg-white rounded-xl border border-pink-200 p-4 space-y-4">
    <div class="flex items-center gap-2">
      <span class="text-2xl">💑</span>
      <h3 class="font-bold text-pink-800">Merge Keuangan Pasangan</h3>
    </div>

    <!-- Step 1: Input incomes -->
    <template v-if="step === 1">
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Penghasilan Pasangan A</label>
          <input v-model.number="incomeA" type="number" class="w-full rounded-lg border-gray-300 text-sm" placeholder="0" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Penghasilan Pasangan B</label>
          <input v-model.number="incomeB" type="number" class="w-full rounded-lg border-gray-300 text-sm" placeholder="0" />
        </div>
        <div class="bg-pink-50 rounded-lg p-3">
          <p class="text-sm text-pink-700">Total gabungan: <strong>{{ formatRupiah(totalIncome) }}</strong></p>
        </div>
        <AppButton variant="primary" class="w-full" :disabled="totalIncome <= 0" @click="step = 2">
          Lanjut →
        </AppButton>
      </div>
    </template>

    <!-- Step 2: Choose split mode -->
    <template v-else-if="step === 2">
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700">Metode Pembagian</label>
        <div class="space-y-2">
          <label class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer"
            :class="selectedMode === '50-50' ? 'border-pink-400 bg-pink-50' : 'border-gray-200'"
            @click="selectedMode = '50-50'">
            <input type="radio" v-model="selectedMode" value="50-50" class="text-pink-500" />
            <div>
              <p class="text-sm font-medium">50 : 50</p>
              <p class="text-xs text-gray-500">Bagi rata</p>
            </div>
          </label>
          <label class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer"
            :class="selectedMode === 'proportional' ? 'border-pink-400 bg-pink-50' : 'border-gray-200'"
            @click="selectedMode = 'proportional'">
            <input type="radio" v-model="selectedMode" value="proportional" class="text-pink-500" />
            <div>
              <p class="text-sm font-medium">Proporsional</p>
              <p class="text-xs text-gray-500">Sesuai besar penghasilan</p>
            </div>
          </label>
          <label class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer"
            :class="selectedMode === 'custom' ? 'border-pink-400 bg-pink-50' : 'border-gray-200'"
            @click="selectedMode = 'custom'">
            <input type="radio" v-model="selectedMode" value="custom" class="text-pink-500" />
            <div>
              <p class="text-sm font-medium">Custom</p>
              <p class="text-xs text-gray-500">Atur sendiri</p>
            </div>
          </label>
        </div>

        <div v-if="selectedMode === 'custom'" class="bg-gray-50 rounded-lg p-3">
          <label class="block text-sm mb-1">Rasio Pasangan A: {{ customRatioA }}%</label>
          <input type="range" v-model.number="customRatioA" min="0" max="100" class="w-full" />
        </div>

        <div class="bg-pink-50 rounded-lg p-3">
          <div class="flex justify-between text-sm">
            <span>Pasangan A: <strong>{{ ratioA }}%</strong> ({{ formatRupiah(totalIncome * ratioA / 100) }})</span>
            <span>B: <strong>{{ ratioB }}%</strong></span>
          </div>
          <ProgressBar :value="ratioA" :max="100" color="pink" class="mt-2" />
        </div>

        <div class="flex gap-2">
          <AppButton variant="secondary" class="flex-1" @click="step = 1">← Kembali</AppButton>
          <AppButton variant="primary" class="flex-1" @click="finalize">✅ Terapkan</AppButton>
        </div>
      </div>
    </template>

    <!-- Step 3: Done -->
    <template v-else>
      <div class="text-center space-y-3 py-4">
        <span class="text-4xl">🎉</span>
        <p class="font-semibold text-pink-800">Keuangan berhasil di-merge!</p>
        <p class="text-sm text-gray-600">Mode: {{ selectedMode }} ({{ ratioA }}:{{ ratioB }})</p>
        <p class="text-sm text-gray-600">Total: {{ formatRupiah(totalIncome) }}/bulan</p>
      </div>
    </template>
  </div>
</template>
