<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budget.store'
import { useVendorStore } from '@/stores/vendor.store'
import { useContributorStore } from '@/stores/contributor.store'
import { useWeddingDayStore } from '@/stores/wedding-day.store'
import { useCurrency } from '@/composables/useCurrency'
import { INSURANCE_RECOMMENDATIONS } from '@/utils/constants'

const budget = useBudgetStore()
const vendor = useVendorStore()
const contributor = useContributorStore()
const weddingDay = useWeddingDayStore()
const { formatRupiah } = useCurrency()

const totalBudget = computed(() => budget.totalBudget)
const totalSpent = computed(() => budget.totalUsed)
const totalAmplop = computed(() => weddingDay.totalAmploIncome)
const totalContributions = computed(() => contributor.contributors.reduce((s, c) => s + c.contributionAmount, 0))
const vendorCount = computed(() => vendor.vendors.length)
const paidVendors = computed(() => vendor.vendors.filter(v => v.status === 'settled').length)

const netResult = computed(() => totalAmplop.value + totalContributions.value - totalSpent.value)
const isPositive = computed(() => netResult.value >= 0)

const tips = computed(() => {
  const t: string[] = []
  if (netResult.value < 0) t.push('💡 Pengeluaran lebih besar dari pemasukan. Pertimbangkan mengurangi budget.')
  if (totalAmplop.value > totalSpent.value * 0.5) t.push('🎉 Amplop menutupi >50% biaya — great!')
  if (vendorCount.value > 0 && paidVendors.value < vendorCount.value)
    t.push(`⚠️ ${vendorCount.value - paidVendors.value} vendor belum lunas`)
  return t
})
</script>

<template>
  <div class="bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl border border-violet-200 p-4 space-y-4">
    <div class="flex items-center gap-2">
      <span class="text-2xl">🎂</span>
      <h3 class="font-bold text-violet-800">Anniversary Review</h3>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="bg-white/70 rounded-lg p-3 text-center">
        <p class="text-xs text-gray-500">Total Budget</p>
        <p class="text-sm font-bold">{{ formatRupiah(totalBudget) }}</p>
      </div>
      <div class="bg-white/70 rounded-lg p-3 text-center">
        <p class="text-xs text-gray-500">Total Keluar</p>
        <p class="text-sm font-bold text-red-600">{{ formatRupiah(totalSpent) }}</p>
      </div>
      <div class="bg-white/70 rounded-lg p-3 text-center">
        <p class="text-xs text-gray-500">Amplop Masuk</p>
        <p class="text-sm font-bold text-green-600">{{ formatRupiah(totalAmplop) }}</p>
      </div>
      <div class="bg-white/70 rounded-lg p-3 text-center">
        <p class="text-xs text-gray-500">Kontribusi</p>
        <p class="text-sm font-bold text-blue-600">{{ formatRupiah(totalContributions) }}</p>
      </div>
    </div>

    <div :class="isPositive ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'"
      class="rounded-lg border p-3 text-center">
      <p class="text-xs" :class="isPositive ? 'text-green-600' : 'text-red-600'">Hasil Akhir</p>
      <p class="text-xl font-bold" :class="isPositive ? 'text-green-700' : 'text-red-700'">
        {{ isPositive ? '+' : '' }}{{ formatRupiah(netResult) }}
      </p>
    </div>

    <div v-if="tips.length" class="space-y-1">
      <p v-for="(tip, i) in tips" :key="i" class="text-xs text-gray-600">{{ tip }}</p>
    </div>

    <!-- Insurance recommendations -->
    <div class="bg-white/60 rounded-lg p-3 space-y-2">
      <p class="text-xs font-semibold text-violet-700">💡 Rekomendasi Asuransi</p>
      <div v-for="ins in INSURANCE_RECOMMENDATIONS" :key="ins.type"
        class="flex justify-between text-xs">
        <span>{{ ins.type }}</span>
        <span class="text-gray-500">{{ formatRupiah(ins.monthlyPremium.min) }}/bln</span>
      </div>
    </div>
  </div>
</template>
