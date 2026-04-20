<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSavingsStore } from '@/stores/savings.store'
import { useCurrency } from '@/composables/useCurrency'
import ProgressBar from '@/components/common/ProgressBar.vue'
import AppButton from '@/components/common/AppButton.vue'
import type { SavingsGoal, SavingsGoalType } from '@/types/savings.types'
import { HONEYMOON_DESTINATIONS } from '@/utils/constants'

const store = useSavingsStore()
const { goals, activeGoals, totalSaved, overallProgress } = storeToRefs(store)
const { formatRupiah, formatShort } = useCurrency()

// ─── Form State ─────────────────────────────────────────────────────────
const showForm = ref(false)
const formType = ref<SavingsGoalType>('honeymoon')
const formName = ref('')
const formTarget = ref(0)
const formDeadline = ref('')

// ─── Deposit State ──────────────────────────────────────────────────────
const depositGoalId = ref<string | null>(null)
const depositAmount = ref(0)
const depositNote = ref('')

const goalProgress = (goal: SavingsGoal) =>
  goal.targetAmount > 0
    ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
    : 0

const goalMonthsLeft = (goal: SavingsGoal) => {
  if (!goal.deadline) return null
  const diff = goal.deadline.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (30 * 24 * 60 * 60 * 1000)))
}

function createGoal() {
  if (!formName.value || formTarget.value <= 0) return

  if (formType.value === 'honeymoon') {
    store.createHoneymoonGoal(formName.value, formTarget.value, formDeadline.value || null)
  } else {
    store.addGoal({
      type: formType.value,
      name: formName.value,
      targetAmount: formTarget.value,
      monthlyTarget: formDeadline.value
        ? Math.round(formTarget.value / Math.max(1, Math.ceil((new Date(formDeadline.value).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000))))
        : Math.round(formTarget.value / 12),
      deadline: formDeadline.value || null,
    })
  }

  formName.value = ''
  formTarget.value = 0
  formDeadline.value = ''
  showForm.value = false
}

function submitDeposit(goalId: string) {
  if (depositAmount.value <= 0) return
  store.addDeposit(goalId, depositAmount.value, depositNote.value)
  depositGoalId.value = null
  depositAmount.value = 0
  depositNote.value = ''
}

function selectDestination(dest: typeof HONEYMOON_DESTINATIONS[number]) {
  formName.value = dest.name
  formTarget.value = Math.round((dest.estimatedCost.min + dest.estimatedCost.max) / 2)
}

const typeIcons: Record<SavingsGoalType, string> = {
  honeymoon: '✈️',
  'emergency-fund': '🛡️',
  insurance: '🏥',
  'ring-gold': '💍',
  custom: '🎯',
}

const typeLabels: Record<SavingsGoalType, string> = {
  honeymoon: 'Honeymoon',
  'emergency-fund': 'Dana Darurat',
  insurance: 'Asuransi',
  'ring-gold': 'Cincin & Emas',
  custom: 'Lainnya',
}
</script>

<template>
  <div class="space-y-4">
    <!-- Summary -->
    <div class="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-5 text-white">
      <p class="text-sm opacity-80">Total Tabungan</p>
      <p class="text-3xl font-bold mt-1">{{ formatRupiah(totalSaved) }}</p>
      <div class="mt-2">
        <div class="flex justify-between text-xs mb-1">
          <span>{{ activeGoals.length }} goal aktif</span>
          <span>{{ overallProgress }}%</span>
        </div>
        <div class="w-full h-2 bg-white/30 rounded-full overflow-hidden">
          <div class="h-full bg-white rounded-full transition-all" :style="{ width: `${overallProgress}%` }" />
        </div>
      </div>
    </div>

    <!-- Tambah Goal -->
    <AppButton variant="primary" full-width @click="showForm = !showForm">
      🎯 Buat Savings Goal Baru
    </AppButton>

    <!-- Form Goal -->
    <div v-if="showForm" class="bg-gray-50 rounded-xl p-4 space-y-3">
      <div>
        <label class="text-xs font-medium text-gray-700">Tipe Goal</label>
        <select v-model="formType" class="mt-1 w-full rounded-lg border-gray-300 text-sm">
          <option v-for="(label, key) in typeLabels" :key="key" :value="key">{{ typeIcons[key as SavingsGoalType] }} {{ label }}</option>
        </select>
      </div>

      <!-- Quick pick destinasi honeymoon -->
      <div v-if="formType === 'honeymoon'" class="space-y-1">
        <label class="text-xs font-medium text-gray-700">Pilih Destinasi (estimasi 2026)</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="dest in HONEYMOON_DESTINATIONS"
            :key="dest.name"
            class="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:bg-cyan-50 hover:border-cyan-300"
            :class="formName === dest.name ? 'bg-cyan-100 border-cyan-400' : ''"
            @click="selectDestination(dest)"
          >
            {{ dest.name }} ({{ formatShort(dest.estimatedCost.min) }}–{{ formatShort(dest.estimatedCost.max) }})
          </button>
        </div>
      </div>

      <div>
        <label class="text-xs font-medium text-gray-700">Nama Goal</label>
        <input v-model="formName" type="text" placeholder="Contoh: Honeymoon Bali" class="mt-1 w-full rounded-lg border-gray-300 text-sm" />
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Target (Rp)</label>
        <input v-model.number="formTarget" type="number" min="0" step="1000000" class="mt-1 w-full rounded-lg border-gray-300 text-sm" />
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700">Deadline (opsional)</label>
        <input v-model="formDeadline" type="date" class="mt-1 w-full rounded-lg border-gray-300 text-sm" />
      </div>
      <div class="flex gap-2">
        <AppButton variant="primary" size="sm" @click="createGoal">Buat Goal</AppButton>
        <AppButton variant="ghost" size="sm" @click="showForm = false">Batal</AppButton>
      </div>
    </div>

    <!-- Daftar Goals -->
    <div class="space-y-3">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="bg-white rounded-xl border border-gray-100 p-4 space-y-2"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ goal.icon }}</span>
            <div>
              <p class="font-medium text-gray-900 text-sm">{{ goal.name }}</p>
              <p class="text-xs text-gray-500">{{ typeLabels[goal.type] }}
                <span v-if="goalMonthsLeft(goal) !== null" class="text-orange-600"> · {{ goalMonthsLeft(goal) }} bulan lagi</span>
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold" :class="goal.status === 'completed' ? 'text-green-600' : 'text-purple-700'">
              {{ goalProgress(goal) }}%
            </p>
            <p class="text-xs text-gray-500" v-if="goal.status === 'active'">
              {{ formatShort(goal.monthlyTarget) }}/bln
            </p>
          </div>
        </div>

        <ProgressBar
          :value="goalProgress(goal)"
          :color="goal.status === 'completed' ? 'bg-green-500' : goal.status === 'paused' ? 'bg-gray-400' : 'bg-cyan-500'"
          size="sm"
        />

        <div class="flex justify-between text-xs text-gray-600">
          <span>{{ formatRupiah(goal.currentAmount) }}</span>
          <span>{{ formatRupiah(goal.targetAmount) }}</span>
        </div>

        <!-- Actions -->
        <div v-if="goal.status === 'active'" class="flex gap-2 pt-1">
          <button
            v-if="depositGoalId !== goal.id"
            class="flex-1 text-xs text-center py-1.5 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-medium"
            @click="depositGoalId = goal.id"
          >
            💰 Setor
          </button>
          <button
            class="text-xs px-2 py-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            @click="store.pauseGoal(goal.id)"
          >
            ⏸ Pause
          </button>
          <button
            class="text-xs px-2 py-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
            @click="store.deleteGoal(goal.id)"
          >
            🗑
          </button>
        </div>
        <div v-else-if="goal.status === 'paused'" class="pt-1">
          <button
            class="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
            @click="store.resumeGoal(goal.id)"
          >
            ▶ Lanjutkan
          </button>
        </div>
        <div v-else class="text-center py-1">
          <span class="text-xs text-green-600 font-medium">✅ Goal Tercapai!</span>
        </div>

        <!-- Deposit form inline -->
        <div v-if="depositGoalId === goal.id" class="bg-gray-50 rounded-lg p-3 space-y-2">
          <input v-model.number="depositAmount" type="number" min="0" step="100000" placeholder="Jumlah setor (Rp)" class="w-full rounded-lg border-gray-300 text-sm" />
          <input v-model="depositNote" type="text" placeholder="Catatan (opsional)" class="w-full rounded-lg border-gray-300 text-sm" />
          <div class="flex gap-2">
            <AppButton size="sm" variant="primary" @click="submitDeposit(goal.id)">Setor</AppButton>
            <AppButton size="sm" variant="ghost" @click="depositGoalId = null">Batal</AppButton>
          </div>
        </div>
      </div>

      <p v-if="goals.length === 0" class="text-center text-sm text-gray-400 py-6">
        Belum ada savings goal. Mulai rencanakan!
      </p>
    </div>
  </div>
</template>
