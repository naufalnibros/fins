<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '@/composables/useCurrency'
import { GOLD_PRICE_REFERENCE } from '@/utils/constants'

const { formatRupiah } = useCurrency()

const props = defineProps<{
  targetGrams?: number
  karatType?: '24k' | '22k' | '18k'
}>()

const karat = computed(() => props.karatType ?? '22k')
const grams = computed(() => props.targetGrams ?? 10)

const pricePerGram = computed(() => {
  const map: Record<string, number> = {
    '24k': GOLD_PRICE_REFERENCE.per_gram_24k,
    '22k': GOLD_PRICE_REFERENCE.per_gram_22k,
    '18k': GOLD_PRICE_REFERENCE.per_gram_18k,
  }
  return map[karat.value]
})

const estimatedTotal = computed(() => pricePerGram.value * grams.value)
</script>

<template>
  <div class="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl border border-amber-200 p-4 space-y-3">
    <div class="flex items-center gap-2">
      <span class="text-2xl">💍</span>
      <div>
        <h3 class="font-semibold text-amber-900 text-sm">Estimasi Harga Cincin & Emas</h3>
        <p class="text-xs text-amber-700">Update: {{ GOLD_PRICE_REFERENCE.lastUpdated }}</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="bg-white/70 rounded-lg p-2">
        <p class="text-xs text-amber-600">24 Karat</p>
        <p class="text-sm font-bold text-amber-800">{{ formatRupiah(GOLD_PRICE_REFERENCE.per_gram_24k) }}</p>
        <p class="text-xs text-amber-500">/gram</p>
      </div>
      <div class="bg-white/70 rounded-lg p-2">
        <p class="text-xs text-amber-600">22 Karat</p>
        <p class="text-sm font-bold text-amber-800">{{ formatRupiah(GOLD_PRICE_REFERENCE.per_gram_22k) }}</p>
        <p class="text-xs text-amber-500">/gram</p>
      </div>
      <div class="bg-white/70 rounded-lg p-2">
        <p class="text-xs text-amber-600">18 Karat</p>
        <p class="text-sm font-bold text-amber-800">{{ formatRupiah(GOLD_PRICE_REFERENCE.per_gram_18k) }}</p>
        <p class="text-xs text-amber-500">/gram</p>
      </div>
    </div>

    <div class="bg-white/60 rounded-lg p-3">
      <p class="text-xs text-amber-700">Estimasi sepasang cincin ({{ grams }}g × {{ karat }})</p>
      <p class="text-lg font-bold text-amber-900">{{ formatRupiah(estimatedTotal) }}</p>
    </div>
  </div>
</template>
