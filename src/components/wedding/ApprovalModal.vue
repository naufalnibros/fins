<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useCurrency } from '@/composables/useCurrency'
import { APPROVAL_THRESHOLD_AMOUNT } from '@/utils/constants'

const { formatRupiah } = useCurrency()

defineProps<{
  show: boolean
  expenseDescription: string
  expenseAmount: number
}>()

const emit = defineEmits<{
  (e: 'approve'): void
  (e: 'reject'): void
  (e: 'close'): void
}>()

const approverName = ref('')
const reason = ref('')

function handleApprove() {
  emit('approve')
}

function handleReject() {
  emit('reject')
}
</script>

<template>
  <AppModal :show="show" title="⚠️ Approval Diperlukan" @close="emit('close')">
    <div class="space-y-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-3">
        <p class="text-sm text-red-700">
          Pengeluaran di atas <strong>{{ formatRupiah(APPROVAL_THRESHOLD_AMOUNT) }}</strong> membutuhkan persetujuan.
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-3 space-y-1">
        <p class="text-sm text-gray-600">Deskripsi</p>
        <p class="font-semibold">{{ expenseDescription }}</p>
        <p class="text-lg font-bold text-red-600">{{ formatRupiah(expenseAmount) }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama yang approve</label>
        <input v-model="approverName" type="text" placeholder="Nama lengkap"
          class="w-full rounded-lg border-gray-300 text-sm" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
        <textarea v-model="reason" rows="2" placeholder="Alasan approve/reject..."
          class="w-full rounded-lg border-gray-300 text-sm" />
      </div>

      <div class="flex gap-3">
        <AppButton variant="danger" class="flex-1" @click="handleReject">
          ❌ Tolak
        </AppButton>
        <AppButton variant="primary" class="flex-1" :disabled="!approverName.trim()" @click="handleApprove">
          ✅ Setujui
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>
