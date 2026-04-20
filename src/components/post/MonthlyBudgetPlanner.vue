<script setup lang="ts">
import { computed } from 'vue'
import { useMonthlyBudgetStore } from '@/stores/monthly-budget.store'
import { useCurrency } from '@/composables/useCurrency'
import ProgressBar from '@/components/common/ProgressBar.vue'

const store = useMonthlyBudgetStore()
const { formatRupiah } = useCurrency()

const activePlan = computed(() => store.currentPlan)
const totalBudget = computed(() => activePlan.value?.totalBudgeted ?? 0)
const totalSpent = computed(() => activePlan.value?.totalActual ?? 0)
const remaining = computed(() => totalBudget.value - totalSpent.value)

const categoryIcons: Record<string, string> = {
  housing: '🏠', food: '🍽️', transport: '🚗', utilities: '💡',
  insurance: '🛡️', entertainment: '🎬', savings: '💰', other: '📦'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-blue-200 p-4 space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-2xl">📊</span>
        <h3 class="font-bold text-blue-800">Budget Bulanan</h3>
      </div>
      <span v-if="activePlan" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
        {{ activePlan.monthYear }}
      </span>
    </div>

    <template v-if="!activePlan">
      <p class="text-sm text-gray-500 text-center py-4">Belum ada budget bulanan aktif.</p>
    </template>

    <template v-else>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="bg-blue-50 rounded-lg p-2">
          <p class="text-xs text-blue-600">Budget</p>
          <p class="text-sm font-bold text-blue-800">{{ formatRupiah(totalBudget) }}</p>
        </div>
        <div class="bg-orange-50 rounded-lg p-2">
          <p class="text-xs text-orange-600">Terpakai</p>
          <p class="text-sm font-bold text-orange-800">{{ formatRupiah(totalSpent) }}</p>
        </div>
        <div :class="remaining >= 0 ? 'bg-green-50' : 'bg-red-50'" class="rounded-lg p-2">
          <p class="text-xs" :class="remaining >= 0 ? 'text-green-600' : 'text-red-600'">Sisa</p>
          <p class="text-sm font-bold" :class="remaining >= 0 ? 'text-green-800' : 'text-red-800'">
            {{ formatRupiah(remaining) }}
          </p>
        </div>
      </div>

      <div class="space-y-2">
        <div v-for="item in activePlan.items" :key="item.category"
          class="flex items-center gap-2">
          <span class="text-lg w-7 text-center">{{ categoryIcons[item.category] ?? '📦' }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between text-xs mb-0.5">
              <span class="truncate font-medium text-gray-700">{{ item.name }}</span>
              <span class="text-gray-500">{{ formatRupiah(item.actualAmount) }}/{{ formatRupiah(item.budgetedAmount) }}</span>
            </div>
            <ProgressBar :value="item.actualAmount" :max="item.budgetedAmount"
              :color="item.actualAmount > item.budgetedAmount ? 'red' : 'blue'" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
