<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number        // 0 - 100
  color?: string       // Tailwind bg class, default 'bg-purple-600'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const heightClass = computed(() => {
  const map = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }
  return map[props.size ?? 'md']
})

const safeValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-1" v-if="showLabel">
      <slot name="label" />
      <span class="text-xs font-medium text-gray-600">{{ safeValue }}%</span>
    </div>
    <div :class="['w-full bg-gray-200 rounded-full overflow-hidden', heightClass]">
      <div
        :class="['rounded-full transition-all duration-500', color ?? 'bg-purple-600', heightClass]"
        :style="{ width: `${safeValue}%` }"
        role="progressbar"
        :aria-valuenow="safeValue"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  </div>
</template>
