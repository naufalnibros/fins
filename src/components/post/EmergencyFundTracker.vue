<script setup lang="ts">
import { computed } from 'vue'
import { useSavingsStore } from '@/stores/savings.store'
import { useCurrency } from '@/composables/useCurrency'
import ProgressBar from '@/components/common/ProgressBar.vue'
import AppButton from '@/components/common/AppButton.vue'
import { EMERGENCY_FUND_MONTHS } from '@/utils/constants'

const savings = useSavingsStore()
const { formatRupiah } = useCurrency()

const props = defineProps<{ monthlyExpense: number }>()

const emergencyGoal = computed(() =>
  savings.goals.find(g => g.type === 'emergency-fund')
)

const targetAmount = computed(() => props.monthlyExpense * EMERGENCY_FUND_MONTHS)

function createGoal() {
  savings.createEmergencyFundGoal(props.monthlyExpense)
}

const progress = computed(() => {
  if (!emergencyGoal.value) return 0
  return Math.min(100, Math.round((emergencyGoal.value.currentAmount / emergencyGoal.value.targetAmount) * 100))
})

const monthsCovered = computed(() => {
  if (!emergencyGoal.value || props.monthlyExpense <= 0) return 0
  return Math.floor(emergencyGoal.value.currentAmount / props.monthlyExpense)
})
</script>

<template>
  <div class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 p-4 space-y-3">
    <div class="flex items-center gap-2">
      <span class="text-2xl">🛡️</span>
      <div>
        <h3 class="font-bold text-green-800 text-sm">Dana Darurat</h3>
        <p class="text-xs text-green-600">Target {{ EMERGENCY_FUND_MONTHS }} bulan pengeluaran</p>
      </div>
    </div>

    <template v-if="!emergencyGoal">
      <div class="bg-white/60 rounded-lg p-3 text-center space-y-2">
        <p class="text-sm text-gray-600">
          Target: <strong>{{ formatRupiah(targetAmount) }}</strong>
          <span class="text-xs">({{ EMERGENCY_FUND_MONTHS }}× {{ formatRupiah(monthlyExpense) }})</span>
        </p>
        <AppButton variant="primary" size="sm" @click="createGoal">
          🛡️ Buat Dana Darurat
        </AppButton>
      </div>
    </template>

    <template v-else>
      <ProgressBar :value="emergencyGoal.currentAmount" :max="emergencyGoal.targetAmount" color="green" />
      <div class="flex justify-between text-sm">
        <span class="text-green-700">{{ formatRupiah(emergencyGoal.currentAmount) }}</span>
        <span class="text-green-600">{{ progress }}%</span>
      </div>
      <div class="bg-white/60 rounded-lg p-2 text-center">
        <p class="text-xs text-gray-500">Cukup untuk</p>
        <p class="text-xl font-bold text-green-700">{{ monthsCovered }} bulan</p>
      </div>
    </template>
  </div>
</template>
