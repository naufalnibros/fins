<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeddingDayStore } from '@/stores/wedding-day.store'
import { useCurrency } from '@/composables/useCurrency'
import AmploCounter from '@/components/wedding/AmploCounter.vue'
import QuickExpense from '@/components/wedding/QuickExpense.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'

const store = useWeddingDayStore()
const { totalAmploIncome, totalExpenses, pendingExpenses } = storeToRefs(store)
const { formatRupiah } = useCurrency()

type Tab = 'amplop' | 'expense' | 'approval'
const activeTab = ref<Tab>('amplop')

function handleApprove(id: string) {
  store.approveExpense(id, 'Admin')
}

function handleReject(id: string) {
  store.rejectExpense(id)
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Hari-H 🎊</h1>
      <p class="text-gray-500 text-sm mt-1">Pantau amplop dan pengeluaran hari resepsi</p>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-rose-50 rounded-xl p-4">
        <p class="text-xs text-rose-600 font-medium">💰 Total Amplop</p>
        <p class="text-lg font-bold text-rose-700 mt-1">{{ formatRupiah(totalAmploIncome) }}</p>
      </div>
      <div class="bg-orange-50 rounded-xl p-4">
        <p class="text-xs text-orange-600 font-medium">🧾 Total Pengeluaran</p>
        <p class="text-lg font-bold text-orange-700 mt-1">{{ formatRupiah(totalExpenses) }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 rounded-xl p-1">
      <button
        :class="['flex-1 text-sm py-2 rounded-lg font-medium transition-colors', activeTab === 'amplop' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-600']"
        @click="activeTab = 'amplop'"
      >
        📩 Amplop
      </button>
      <button
        :class="['flex-1 text-sm py-2 rounded-lg font-medium transition-colors', activeTab === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-600']"
        @click="activeTab = 'expense'"
      >
        💸 Catat
      </button>
      <button
        :class="['flex-1 text-sm py-2 rounded-lg font-medium transition-colors relative', activeTab === 'approval' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-600']"
        @click="activeTab = 'approval'"
      >
        ✅ Approval
        <span
          v-if="pendingExpenses.length > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
        >
          {{ pendingExpenses.length }}
        </span>
      </button>
    </div>

    <!-- Amplop Tab -->
    <AmploCounter v-if="activeTab === 'amplop'" />

    <!-- Catat Pengeluaran Tab -->
    <QuickExpense v-else-if="activeTab === 'expense'" />

    <!-- Approval Tab -->
    <div v-else class="space-y-3">
      <div v-if="pendingExpenses.length === 0" class="text-center py-10 text-gray-400">
        <p class="text-4xl mb-2">✅</p>
        <p class="text-sm">Semua pengeluaran sudah disetujui</p>
      </div>
      <div
        v-for="expense in pendingExpenses"
        :key="expense.id"
        class="bg-white rounded-xl border border-gray-100 p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="font-medium text-gray-900">{{ expense.description }}</p>
            <p class="text-sm font-bold text-purple-700 mt-0.5">{{ formatRupiah(expense.amount) }}</p>
          </div>
          <AppBadge variant="warning" label="Menunggu" />
        </div>
        <div class="flex gap-2">
          <AppButton size="sm" variant="primary" @click="handleApprove(expense.id)">
            ✓ Setujui
          </AppButton>
          <AppButton size="sm" variant="danger" @click="handleReject(expense.id)">
            ✗ Tolak
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
