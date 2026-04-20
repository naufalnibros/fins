<script setup lang="ts">
import { computed } from 'vue'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const props = defineProps<{
  variant?: BadgeVariant
  label: string
}>()

const variantClass = computed(() => {
  const map: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-700',
  }
  return map[props.variant ?? 'neutral']
})
</script>

<template>
  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClass]">
    {{ label }}
  </span>
</template>
