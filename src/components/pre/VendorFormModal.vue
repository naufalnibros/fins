<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'
import { VENDOR_CATEGORY_LABELS } from '@/utils/constants'
import type { Vendor, VendorFormData } from '@/types/vendor.types'
import type { VendorCategory } from '@/types/budget.types'

const props = defineProps<{
  vendor?: Vendor | null
}>()

const emit = defineEmits<{
  close: []
  submit: [data: VendorFormData]
}>()

const isEdit = computed(() => !!props.vendor)

const blankForm = (): VendorFormData => ({
  name: '',
  category: 'catering' as VendorCategory,
  contactPerson: '',
  phone: '',
  contractAmount: 0,
  dpAmount: 0,
  dueDate: null,
  notes: '',
})

const form = ref<VendorFormData>(blankForm())

watch(
  () => props.vendor,
  (v) => {
    if (v) {
      form.value = {
        name: v.name,
        category: v.category,
        contactPerson: v.contactPerson,
        phone: v.phone,
        contractAmount: v.contractAmount,
        dpAmount: v.dpAmount,
        dueDate: v.dueDate ? v.dueDate.toISOString().slice(0, 10) : null,
        notes: v.notes,
      }
    } else {
      form.value = blankForm()
    }
  },
  { immediate: true }
)

const errors = ref<Partial<Record<keyof VendorFormData, string>>>({})

function validate(): boolean {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Nama vendor wajib diisi'
  if (form.value.contractAmount <= 0) errors.value.contractAmount = 'Harga kontrak harus lebih dari 0'
  if (form.value.dpAmount < 0) errors.value.dpAmount = 'DP tidak boleh negatif'
  if (form.value.dpAmount > form.value.contractAmount)
    errors.value.dpAmount = 'DP tidak boleh melebihi harga kontrak'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { ...form.value })
}

const categoryOptions = Object.entries(VENDOR_CATEGORY_LABELS) as [VendorCategory, string][]
</script>

<template>
  <AppModal :title="isEdit ? '✏️ Edit Vendor' : '➕ Tambah Vendor'" size="md" @close="emit('close')">
    <form class="space-y-3" @submit.prevent="handleSubmit">
      <!-- Nama Vendor -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">Nama Vendor <span class="text-red-500">*</span></label>
        <input v-model="form.name" type="text" placeholder="Contoh: Catering Bu Siti"
          class="w-full rounded-lg border-gray-300 text-sm"
          :class="errors.name ? 'border-red-400' : ''" />
        <p v-if="errors.name" class="text-xs text-red-500 mt-0.5">{{ errors.name }}</p>
      </div>

      <!-- Kategori -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
        <select v-model="form.category" class="w-full rounded-lg border-gray-300 text-sm">
          <option v-for="[key, label] in categoryOptions" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>

      <!-- Kontak -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Nama Kontak</label>
          <input v-model="form.contactPerson" type="text" placeholder="Nama PIC"
            class="w-full rounded-lg border-gray-300 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">No. HP</label>
          <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx"
            class="w-full rounded-lg border-gray-300 text-sm" />
        </div>
      </div>

      <!-- Harga -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Harga Kontrak (Rp) <span class="text-red-500">*</span></label>
          <input v-model.number="form.contractAmount" type="number" min="0" step="100000"
            class="w-full rounded-lg border-gray-300 text-sm"
            :class="errors.contractAmount ? 'border-red-400' : ''" />
          <p v-if="errors.contractAmount" class="text-xs text-red-500 mt-0.5">{{ errors.contractAmount }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Nilai DP (Rp)</label>
          <input v-model.number="form.dpAmount" type="number" min="0" step="100000"
            class="w-full rounded-lg border-gray-300 text-sm"
            :class="errors.dpAmount ? 'border-red-400' : ''" />
          <p v-if="errors.dpAmount" class="text-xs text-red-500 mt-0.5">{{ errors.dpAmount }}</p>
        </div>
      </div>

      <!-- Jatuh Tempo -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">Tanggal Jatuh Tempo</label>
        <input v-model="form.dueDate" type="date" class="w-full rounded-lg border-gray-300 text-sm" />
      </div>

      <!-- Catatan -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
        <textarea v-model="form.notes" rows="2" placeholder="Info tambahan (opsional)"
          class="w-full rounded-lg border-gray-300 text-sm" />
      </div>

      <div class="flex gap-2 pt-1">
        <AppButton type="button" variant="ghost" class="flex-1" @click="emit('close')">Batal</AppButton>
        <AppButton type="submit" variant="primary" class="flex-1">
          {{ isEdit ? 'Simpan Perubahan' : 'Tambah Vendor' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>
