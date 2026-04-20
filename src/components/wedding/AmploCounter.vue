<script setup lang="ts">
import { ref } from 'vue'
import { useCurrency } from '@/composables/useCurrency'
import { useAmplop } from '@/composables/useAmplop'
import AppButton from '@/components/common/AppButton.vue'

const { formatRupiah } = useCurrency()
const { totalAmploAmount, envelopeCount, transferCount, amploRecords, addAmploRecord } = useAmplop()

// Form untuk tambah amplop baru
const showForm = ref(false)
const guestName = ref('')
const relation = ref<'temanKantor' | 'keluargaDekat' | 'kenalanOrtu' | 'temanDekat' | 'other'>('temanKantor')
const amount = ref<number>(0)
const isEnvelope = ref(true)
const notes = ref('')

function submitRecord() {
  if (!guestName.value || amount.value <= 0) return

  addAmploRecord({
    guestName: guestName.value,
    relation: relation.value,
    amount: amount.value,
    isEnvelope: isEnvelope.value,
    notes: notes.value,
  })

  // Reset form
  guestName.value = ''
  amount.value = 0
  notes.value = ''
  showForm.value = false
}
</script>

<template>
  <div class="space-y-4">
    <!-- Summary Card -->
    <div class="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white">
      <p class="text-sm opacity-80">Total Amplop Terkumpul</p>
      <p class="text-3xl font-bold mt-1">{{ formatRupiah(totalAmploAmount) }}</p>
      <div class="flex gap-4 mt-3 text-sm">
        <span>📩 {{ envelopeCount }} amplop fisik</span>
        <span>💳 {{ transferCount }} transfer</span>
      </div>
    </div>

    <!-- Tombol Tambah -->
    <AppButton variant="primary" full-width @click="showForm = !showForm">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Catat Amplop Baru
    </AppButton>

    <!-- Form Tambah Amplop -->
    <div v-if="showForm" class="bg-gray-50 rounded-xl p-4 space-y-3">
      <div>
        <label class="text-xs font-medium text-gray-700">Nama Tamu</label>
        <input
          v-model="guestName"
          type="text"
          placeholder="Nama tamu"
          class="mt-1 w-full rounded-lg border-gray-300 text-sm"
        />
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Relasi</label>
        <select v-model="relation" class="mt-1 w-full rounded-lg border-gray-300 text-sm">
          <option value="temanKantor">Teman Kantor</option>
          <option value="keluargaDekat">Keluarga Dekat</option>
          <option value="kenalanOrtu">Kenalan Orang Tua</option>
          <option value="temanDekat">Teman Dekat</option>
          <option value="other">Lainnya</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Jumlah (Rp)</label>
        <input
          v-model.number="amount"
          type="number"
          min="0"
          step="50000"
          placeholder="0"
          class="mt-1 w-full rounded-lg border-gray-300 text-sm"
        />
      </div>
      <div class="flex items-center gap-2">
        <input v-model="isEnvelope" type="checkbox" id="is-envelope" class="rounded border-gray-300" />
        <label for="is-envelope" class="text-xs text-gray-700">Amplop Fisik (uncheck jika transfer)</label>
      </div>
      <div class="flex gap-2">
        <AppButton variant="primary" size="sm" @click="submitRecord">Simpan</AppButton>
        <AppButton variant="ghost" size="sm" @click="showForm = false">Batal</AppButton>
      </div>
    </div>

    <!-- Daftar Amplop Terbaru -->
    <div class="space-y-2">
      <h3 class="text-sm font-medium text-gray-700">Catatan Terbaru</h3>
      <div
        v-for="record in [...amploRecords].reverse().slice(0, 10)"
        :key="record.id"
        class="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-3 py-2.5"
      >
        <div>
          <p class="text-sm font-medium text-gray-800">{{ record.guestName }}</p>
          <p class="text-xs text-gray-500">{{ record.isEnvelope ? '📩' : '💳' }} {{ record.relation }}</p>
        </div>
        <p class="text-sm font-semibold text-green-600">+{{ formatRupiah(record.amount) }}</p>
      </div>
      <p v-if="amploRecords.length === 0" class="text-center text-sm text-gray-400 py-4">
        Belum ada catatan amplop
      </p>
    </div>
  </div>
</template>
