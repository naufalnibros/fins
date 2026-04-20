<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContributorStore } from '@/stores/contributor.store'
import { useCurrency } from '@/composables/useCurrency'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import type { Contributor } from '@/types/vendor.types'

const store = useContributorStore()
const { contributors, totalContribution, confirmedContribution } = storeToRefs(store)
const { formatRupiah, formatShort } = useCurrency()

const showForm = ref(false)
const formName = ref('')
const formRelation = ref<Contributor['relation']>('ortu-pria')
const formAmount = ref(0)
const formNotes = ref('')

const pendingContribution = computed(() =>
  totalContribution.value - confirmedContribution.value
)

function submit() {
  if (!formName.value || formAmount.value <= 0) return
  store.addContributor({
    name: formName.value,
    relation: formRelation.value,
    contributionAmount: formAmount.value,
    notes: formNotes.value,
    confirmedAt: null,
  })
  formName.value = ''
  formAmount.value = 0
  formNotes.value = ''
  showForm.value = false
}

const relationLabels: Record<string, string> = {
  'mempelai-pria': '🤵 Mempelai Pria',
  'mempelai-wanita': '👰 Mempelai Wanita',
  'ortu-pria': '👨‍👩‍👦 Ortu Pria',
  'ortu-wanita': '👨‍👩‍👧 Ortu Wanita',
  keluarga: '👪 Keluarga',
  other: '🤝 Lainnya',
}
</script>

<template>
  <div class="space-y-4">
    <!-- Summary Card -->
    <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
      <p class="text-sm opacity-80">Total Kontribusi Dana</p>
      <p class="text-3xl font-bold mt-1">{{ formatRupiah(totalContribution) }}</p>
      <div class="flex gap-4 mt-3 text-sm">
        <span>✅ Terkonfirmasi: {{ formatShort(confirmedContribution) }}</span>
        <span>⏳ Pending: {{ formatShort(pendingContribution) }}</span>
      </div>
    </div>

    <!-- Tombol Tambah -->
    <AppButton variant="primary" full-width @click="showForm = !showForm">
      ➕ Tambah Kontributor
    </AppButton>

    <!-- Form -->
    <div v-if="showForm" class="bg-gray-50 rounded-xl p-4 space-y-3">
      <div>
        <label class="text-xs font-medium text-gray-700">Nama Kontributor</label>
        <input v-model="formName" type="text" placeholder="Contoh: Ayah Naufal" class="mt-1 w-full rounded-lg border-gray-300 text-sm" />
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Pihak / Relasi</label>
        <select v-model="formRelation" class="mt-1 w-full rounded-lg border-gray-300 text-sm">
          <option v-for="(label, key) in relationLabels" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Jumlah Kontribusi (Rp)</label>
        <input v-model.number="formAmount" type="number" min="0" step="1000000" class="mt-1 w-full rounded-lg border-gray-300 text-sm" />
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Catatan</label>
        <input v-model="formNotes" type="text" placeholder="Opsional" class="mt-1 w-full rounded-lg border-gray-300 text-sm" />
      </div>
      <div class="flex gap-2">
        <AppButton variant="primary" size="sm" @click="submit">Simpan</AppButton>
        <AppButton variant="ghost" size="sm" @click="showForm = false">Batal</AppButton>
      </div>
    </div>

    <!-- Daftar Kontributor -->
    <div class="space-y-2">
      <div
        v-for="contributor in contributors"
        :key="contributor.id"
        class="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div>
            <p class="font-medium text-gray-900 text-sm">{{ contributor.name }}</p>
            <p class="text-xs text-gray-500">{{ relationLabels[contributor.relation] || contributor.relation }}</p>
          </div>
        </div>
        <div class="text-right flex items-center gap-2">
          <div>
            <p class="font-semibold text-purple-700 text-sm">{{ formatRupiah(contributor.contributionAmount) }}</p>
            <AppBadge
              :variant="contributor.confirmedAt ? 'success' : 'warning'"
              :label="contributor.confirmedAt ? 'Konfirm' : 'Pending'"
            />
          </div>
          <button
            v-if="!contributor.confirmedAt"
            class="p-1.5 rounded-lg text-green-500 hover:bg-green-50"
            title="Konfirmasi"
            @click="store.confirmContributor(contributor.id)"
          >
            ✓
          </button>
          <button
            class="p-1.5 rounded-lg text-red-400 hover:bg-red-50"
            title="Hapus"
            @click="store.deleteContributor(contributor.id)"
          >
            ×
          </button>
        </div>
      </div>
      <p v-if="contributors.length === 0" class="text-center text-sm text-gray-400 py-4">
        Belum ada kontributor
      </p>
    </div>
  </div>
</template>
