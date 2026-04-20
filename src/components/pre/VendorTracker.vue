<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from '@/components/common/AppBadge.vue'
import { useCurrency } from '@/composables/useCurrency'
import { VENDOR_STATUS_LABELS, VENDOR_CATEGORY_LABELS } from '@/utils/constants'
import { formatDateId, daysUntil } from '@/utils/date'
import type { Vendor } from '@/types/vendor.types'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const props = defineProps<{
  vendor: Vendor
}>()

const emit = defineEmits<{
  edit: [vendor: Vendor]
  delete: [vendorId: string]
  recordDp: [vendorId: string]
}>()

const { formatShort } = useCurrency()

const statusBadgeVariant = computed((): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    quoted: 'warning',
    'dp-paid': 'info',
    settled: 'success',
    cancelled: 'danger',
  }
  return map[props.vendor.status] ?? 'neutral'
})

const dpPercentage = computed(() =>
  props.vendor.contractAmount > 0
    ? Math.round((props.vendor.dpPaidAmount / props.vendor.contractAmount) * 100)
    : 0
)

const daysLeft = computed(() =>
  props.vendor.dueDate ? daysUntil(props.vendor.dueDate) : null
)

const dueDateUrgent = computed(() =>
  daysLeft.value !== null && daysLeft.value <= 7 && daysLeft.value >= 0
)
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="font-semibold text-gray-900">{{ vendor.name }}</h3>
        <p class="text-xs text-gray-500 mt-0.5">{{ VENDOR_CATEGORY_LABELS[vendor.category] }}</p>
      </div>
      <AppBadge
        :variant="statusBadgeVariant"
        :label="VENDOR_STATUS_LABELS[vendor.status].label"
      />
    </div>

    <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
      <div>
        <p class="text-gray-500 text-xs">Kontrak</p>
        <p class="font-medium text-gray-800">{{ formatShort(vendor.contractAmount) }}</p>
      </div>
      <div>
        <p class="text-gray-500 text-xs">DP</p>
        <p class="font-medium text-gray-800">{{ formatShort(vendor.dpAmount) }} <span class="text-xs text-gray-400">({{ dpPercentage }}%)</span></p>
      </div>
    </div>

    <div v-if="vendor.dueDate" class="mt-3 flex items-center gap-1.5 text-xs" :class="dueDateUrgent ? 'text-red-600' : 'text-gray-500'">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {{ formatDateId(vendor.dueDate) }}
      <span v-if="daysLeft !== null" class="font-medium">
        ({{ daysLeft >= 0 ? `${daysLeft} hari lagi` : 'Sudah lewat' }})
      </span>
    </div>

    <div class="mt-3 flex items-center gap-2">
      <button
        class="flex-1 text-xs text-center py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium"
        @click="emit('recordDp', vendor.id)"
      >
        Catat DP
      </button>
      <button
        class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
        @click="emit('edit', vendor)"
        title="Edit vendor"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
        @click="emit('delete', vendor.id)"
        title="Hapus vendor"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>
