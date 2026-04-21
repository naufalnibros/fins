<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import type { Vendor } from '@/types/vendor.types'

const props = defineProps<{
  vendor?: Vendor | null
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: { amount: number; notes: string }]
}>()

const amount = ref(0)
const notes = ref('')
const error = ref('')

const maxAmount = computed(() => props.vendor?.remainingAmount ?? 0)

watch(
  () => props.vendor,
  () => {
    amount.value = 0
    notes.value = ''
    error.value = ''
  }
)

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

function validate(): boolean {
  error.value = ''
  if (amount.value <= 0) { error.value = 'Jumlah harus lebih dari 0'; return false }
  if (amount.value > maxAmount.value) { error.value = `Jumlah melebihi sisa pembayaran (${formatRupiah(maxAmount.value)})`; return false }
  return true
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { amount: amount.value, notes: notes.value })
}
</script>

<template>
  <AppModal title="💳 Catat Pembayaran DP" size="sm" @close="emit('close')">
    <div v-if="vendor" class="space-y-3">
      <!-- Info Vendor -->
      <div class="bg-pink-50 rounded-lg p-3 text-sm">
        <p class="font-semibold text-pink-800">{{ vendor.name }}</p>
        <div class="mt-1 text-pink-700 space-y-0.5 text-xs">
          <p>Nilai DP: <span class="font-medium">{{ formatRupiah(vendor.dpAmount) }}</span></p>
          <p>Sudah Dibayar: <span class="font-medium">{{ formatRupiah(vendor.dpPaidAmount) }}</span></p>
          <p>Sisa: <span class="font-semibold text-pink-900">{{ formatRupiah(vendor.remainingAmount) }}</span></p>
        </div>
      </div>

      <form class="space-y-3" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Jumlah Pembayaran (Rp) <span class="text-red-500">*</span></label>
          <input v-model.number="amount" type="number" min="1" :max="maxAmount" step="50000"
            class="w-full rounded-lg border-gray-300 text-sm"
            :class="error ? 'border-red-400' : ''" />
          <p v-if="error" class="text-xs text-red-500 mt-0.5">{{ error }}</p>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Catatan (opsional)</label>
          <input v-model="notes" type="text" placeholder="Misal: transfer BCA"
            class="w-full rounded-lg border-gray-300 text-sm" />
        </div>

        <div class="flex gap-2 pt-1">
          <AppButton type="button" variant="ghost" class="flex-1" @click="emit('close')">Batal</AppButton>
          <AppButton type="submit" variant="primary" class="flex-1">Catat Bayar</AppButton>
        </div>
      </form>
    </div>
  </AppModal>
</template>
