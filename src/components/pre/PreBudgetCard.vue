<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { useCurrency } from '@/composables/useCurrency'
import type { BudgetCategory } from '@/types/budget.types'

const props = defineProps<{
  category: BudgetCategory
}>()

const { formatRupiah, formatShort } = useCurrency()

const usagePercentage = computed(() =>
  props.category.allocatedAmount > 0
    ? Math.round((props.category.used / props.category.allocatedAmount) * 100)
    : 0
)

const barColor = computed(() => {
  if (usagePercentage.value >= 90) return 'bg-red-500'
  if (usagePercentage.value >= 75) return 'bg-yellow-500'
  return 'bg-green-500'
})

const remaining = computed(() => props.category.allocatedAmount - props.category.used)
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-2xl" role="img">{{ category.icon }}</span>
        <div>
          <h3 class="font-medium text-gray-900 text-sm">{{ category.name }}</h3>
          <p class="text-xs text-gray-500">{{ category.percentage }}% dari total budget</p>
        </div>
      </div>
      <span
        class="text-xs font-semibold px-2 py-1 rounded-lg"
        :style="{ background: category.color + '20', color: category.color }"
      >
        {{ usagePercentage }}%
      </span>
    </div>

    <ProgressBar
      :value="usagePercentage"
      :color="barColor"
      size="sm"
      class="mb-3"
    />

    <div class="grid grid-cols-2 gap-2 text-xs">
      <div>
        <p class="text-gray-500">Alokasi</p>
        <p class="font-semibold text-gray-800">{{ formatShort(category.allocatedAmount) }}</p>
      </div>
      <div>
        <p class="text-gray-500">Terpakai</p>
        <p class="font-semibold" :class="usagePercentage >= 90 ? 'text-red-600' : 'text-gray-800'">
          {{ formatShort(category.used) }}
        </p>
      </div>
    </div>

    <div class="mt-2 pt-2 border-t border-gray-50">
      <p class="text-xs text-gray-500">
        Sisa: <span class="font-medium" :class="remaining < 0 ? 'text-red-600' : 'text-green-600'">
          {{ formatRupiah(remaining) }}
        </span>
      </p>
    </div>
  </div>
</template>
