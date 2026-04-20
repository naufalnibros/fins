<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMonthlyBudgetStore } from '@/stores/monthly-budget.store'
import { useCurrency } from '@/composables/useCurrency'
import AppButton from '@/components/common/AppButton.vue'

const store = useMonthlyBudgetStore()
const { formatRupiah } = useCurrency()

const showForm = ref(false)
const form = ref({ name: '', principalAmount: 0, interestRate: 5.5, remainingMonths: 12, monthlyPayment: 0 })

function addLoan() {
  store.addLoan({
    name: form.value.name,
    type: 'other',
    principalAmount: form.value.principalAmount,
    monthlyPayment: form.value.monthlyPayment,
    remainingMonths: form.value.remainingMonths,
    interestRate: form.value.interestRate,
    startDate: new Date(),
    notes: '',
  })
  showForm.value = false
  form.value = { name: '', principalAmount: 0, interestRate: 5.5, remainingMonths: 12, monthlyPayment: 0 }
}

const forecast = computed(() => store.generateLoanForecast(10_000_000))
const totalMonthlyPayment = computed(() => store.loans.reduce((s, l) => s + l.monthlyPayment, 0))
</script>

<template>
  <div class="bg-white rounded-xl border border-purple-200 p-4 space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-2xl">📈</span>
        <h3 class="font-bold text-purple-800">Forecast Cicilan</h3>
      </div>
      <AppButton variant="primary" size="sm" @click="showForm = !showForm">
        {{ showForm ? 'Tutup' : '+ Cicilan' }}
      </AppButton>
    </div>

    <!-- Add loan form -->
    <div v-if="showForm" class="bg-purple-50 rounded-lg p-3 space-y-2">
      <input v-model="form.name" type="text" placeholder="Nama cicilan (KPR, Motor...)"
        class="w-full rounded-lg border-gray-300 text-sm" />
      <div class="grid grid-cols-2 gap-2">
        <input v-model.number="form.principalAmount" type="number" placeholder="Pokok"
          class="w-full rounded-lg border-gray-300 text-sm" />
        <input v-model.number="form.monthlyPayment" type="number" placeholder="Cicilan/bulan"
          class="w-full rounded-lg border-gray-300 text-sm" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <input v-model.number="form.interestRate" type="number" step="0.1" placeholder="Bunga %/thn"
          class="w-full rounded-lg border-gray-300 text-sm" />
        <input v-model.number="form.remainingMonths" type="number" placeholder="Tenor (bulan)"
          class="w-full rounded-lg border-gray-300 text-sm" />
      </div>
      <AppButton variant="primary" size="sm" class="w-full" :disabled="!form.name || form.monthlyPayment <= 0" @click="addLoan">
        Simpan
      </AppButton>
    </div>

    <!-- Loans list -->
    <div v-if="store.loans.length" class="space-y-2">
      <div v-for="loan in store.loans" :key="loan.id"
        class="flex justify-between items-center bg-gray-50 rounded-lg p-2">
        <div>
          <p class="text-sm font-medium">{{ loan.name }}</p>
          <p class="text-xs text-gray-500">{{ loan.remainingMonths }} bulan @ {{ loan.interestRate }}%</p>
        </div>
        <p class="text-sm font-bold text-purple-700">{{ formatRupiah(loan.monthlyPayment) }}/bln</p>
      </div>
      <div class="bg-purple-50 rounded-lg p-2 text-center">
        <p class="text-xs text-purple-600">Total cicilan/bulan</p>
        <p class="text-lg font-bold text-purple-800">{{ formatRupiah(totalMonthlyPayment) }}</p>
      </div>
    </div>

    <!-- 12-month forecast -->
    <div v-if="forecast.length" class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead>
          <tr class="text-left text-gray-500">
            <th class="pb-1">Bulan</th>
            <th class="pb-1 text-right">Bayar</th>
            <th class="pb-1 text-right">Sisa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in forecast" :key="m.month" class="border-t border-gray-100">
            <td class="py-1">{{ m.month }}</td>
            <td class="py-1 text-right">{{ formatRupiah(m.totalInstallments) }}</td>
            <td class="py-1 text-right">{{ formatRupiah(m.remainingBalance) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="!store.loans.length" class="text-sm text-gray-400 text-center py-2">Belum ada cicilan.</p>
  </div>
</template>
