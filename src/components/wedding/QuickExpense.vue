<script setup lang="ts">
import { ref } from 'vue'
import { useWeddingDayStore } from '@/stores/wedding-day.store'
import { useBudgetStore } from '@/stores/budget.store'
import { storeToRefs } from 'pinia'
import AppButton from '@/components/common/AppButton.vue'

const weddingStore = useWeddingDayStore()
const budgetStore = useBudgetStore()
const { categories } = storeToRefs(budgetStore)

const description = ref('')
const amount = ref<number>(0)
const selectedCategoryId = ref('')

function submit() {
  if (!description.value || amount.value <= 0 || !selectedCategoryId.value) return

  weddingStore.addExpense({
    categoryId: selectedCategoryId.value,
    description: description.value,
    amount: amount.value,
  })

  description.value = ''
  amount.value = 0
  selectedCategoryId.value = ''
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
    <h3 class="font-semibold text-gray-900">Catat Pengeluaran Cepat</h3>

    <div>
      <label class="text-xs font-medium text-gray-700">Keterangan</label>
      <input
        v-model="description"
        type="text"
        placeholder="Apa yang dibayar?"
        class="mt-1 w-full rounded-lg border-gray-300 text-sm"
      />
    </div>

    <div>
      <label class="text-xs font-medium text-gray-700">Jumlah (Rp)</label>
      <input
        v-model.number="amount"
        type="number"
        min="0"
        step="10000"
        class="mt-1 w-full rounded-lg border-gray-300 text-sm"
      />
    </div>

    <div>
      <label class="text-xs font-medium text-gray-700">Kategori Budget</label>
      <select v-model="selectedCategoryId" class="mt-1 w-full rounded-lg border-gray-300 text-sm">
        <option value="" disabled>Pilih kategori...</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.icon }} {{ cat.name }}
        </option>
      </select>
    </div>

    <AppButton
      variant="primary"
      full-width
      :disabled="!description || amount <= 0 || !selectedCategoryId"
      @click="submit"
    >
      Kirim untuk Persetujuan
    </AppButton>
  </div>
</template>
