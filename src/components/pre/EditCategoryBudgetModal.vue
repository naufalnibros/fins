<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import type { BudgetCategory } from '@/types/budget.types'

const props = defineProps<{
  category?: BudgetCategory | null
}>()

const emit = defineEmits<{
  close: []
  submit: [amount: number]
}>()

const newAmount = ref(0)
const error = ref('')

watch(
  () => props.category,
  (c) => {
    newAmount.value = c?.allocatedAmount ?? 0
    error.value = ''
  },
  { immediate: true }
)

const minAmount = computed(() => props.category?.used ?? 0)

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

function validate(): boolean {
  error.value = ''
  if (newAmount.value < 0) { error.value = 'Anggaran tidak boleh negatif'; return false }
  if (newAmount.value < minAmount.value) {
    error.value = `Anggaran minimal ${formatRupiah(minAmount.value)} (sudah terpakai)`
    return false
  }
  return true
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', newAmount.value)
}
</script>

<template>
  <AppModal title="✏️ Ubah Alokasi Anggaran" size="sm" @close="emit('close')">
    <div v-if="category" class="space-y-3">
      <!-- Info Kategori -->
      <div class="bg-purple-50 rounded-lg p-3 text-sm">
        <p class="font-semibold text-purple-800">{{ category.icon }} {{ category.name }}</p>
        <div class="mt-1 text-purple-700 space-y-0.5 text-xs">
          <p>Alokasi Saat Ini: <span class="font-medium">{{ formatRupiah(category.allocatedAmount) }}</span></p>
          <p>Sudah Dipakai: <span class="font-medium">{{ formatRupiah(category.used) }}</span></p>
          <p>Sisa: <span class="font-semibold">{{ formatRupiah(category.allocatedAmount - category.used) }}</span></p>
        </div>
      </div>

      <div v-if="minAmount > 0" class="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
        <span>⚠️</span>
        <span>Anggaran baru tidak boleh kurang dari pengeluaran yang sudah tercatat ({{ formatRupiah(minAmount) }})</span>
      </div>

      <form class="space-y-3" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Anggaran Baru (Rp)</label>
          <input v-model.number="newAmount" type="number" :min="minAmount" step="100000"
            class="w-full rounded-lg border-gray-300 text-sm"
            :class="error ? 'border-red-400' : ''" />
          <p v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</p>
        </div>

        <div class="flex gap-2 pt-1">
          <AppButton type="button" variant="ghost" class="flex-1" @click="emit('close')">Batal</AppButton>
          <AppButton type="submit" variant="primary" class="flex-1">Simpan</AppButton>
        </div>
      </form>
    </div>
  </AppModal>
</template>
