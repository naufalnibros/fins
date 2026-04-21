<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useBudgetStore } from '@/stores/budget.store'
import { useVendorStore } from '@/stores/vendor.store'
import { useCurrency } from '@/composables/useCurrency'
import { useBudget } from '@/composables/useBudget'
import PreBudgetCard from '@/components/pre/PreBudgetCard.vue'
import VendorTracker from '@/components/pre/VendorTracker.vue'
import VendorFormModal from '@/components/pre/VendorFormModal.vue'
import VendorDPModal from '@/components/pre/VendorDPModal.vue'
import EditCategoryBudgetModal from '@/components/pre/EditCategoryBudgetModal.vue'
import ContributorManager from '@/components/pre/ContributorManager.vue'
import SavingsGoalCard from '@/components/pre/SavingsGoalCard.vue'
import RingTracker from '@/components/pre/RingTracker.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import AppButton from '@/components/common/AppButton.vue'
import type { Vendor } from '@/types/vendor.types'
import type { BudgetCategory } from '@/types/budget.types'

const budgetStore = useBudgetStore()
const vendorStore = useVendorStore()
const { isSetup } = storeToRefs(budgetStore)
const { vendors } = storeToRefs(vendorStore)
const { formatRupiah, formatShort } = useCurrency()
const {
  categories,
  totalBudget,
  totalUsed,
  remainingBudget,
  usagePercentage,
  budgetStatusColor,
  budgetStatusLabel,
} = useBudget()

// Setup awal budget
const setupAmount = ref<number>(150_000_000)

function handleSetup() {
  if (setupAmount.value >= 10_000_000) {
    budgetStore.setupBudget(setupAmount.value)
  }
}

// Tab aktif
type Tab = 'budget' | 'vendor' | 'contributor' | 'savings'
const activeTab = ref<Tab>('budget')

// --- Modal state ---
const selectedVendor = ref<Vendor | null>(null)
const selectedCategory = ref<BudgetCategory | null>(null)
const isEditVendorOpen = ref(false)
const isDPModalOpen = ref(false)
const isEditCategoryOpen = ref(false)

function openEditVendor(vendor: Vendor) {
  selectedVendor.value = vendor
  isEditVendorOpen.value = true
}

function openDPModal(vendorId: string) {
  selectedVendor.value = vendors.value.find((v) => v.id === vendorId) ?? null
  isDPModalOpen.value = true
}

function openEditCategory(categoryId: string) {
  selectedCategory.value = categories.value.find((c) => c.id === categoryId) ?? null
  isEditCategoryOpen.value = true
}

function handleVendorEditSubmit(data: import('@/types/vendor.types').VendorFormData) {
  if (selectedVendor.value) {
    vendorStore.updateVendor(selectedVendor.value.id, data)
  }
  isEditVendorOpen.value = false
}

function handleDPSubmit(payload: { amount: number; notes: string }) {
  if (selectedVendor.value) {
    vendorStore.recordDpPayment(selectedVendor.value.id, payload.amount, payload.notes)
  }
  isDPModalOpen.value = false
}

function handleCategoryBudgetSubmit(amount: number) {
  if (selectedCategory.value) {
    budgetStore.updateCategoryBudget(selectedCategory.value.id, amount)
  }
  isEditCategoryOpen.value = false
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Pre-Wedding 💍</h1>
      <p class="text-gray-500 text-sm mt-1">Rencanakan budget dan kelola vendor pernikahanmu</p>
    </div>

    <!-- Setup Awal (jika belum ada budget) -->
    <div v-if="!isSetup" class="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
      <h2 class="text-lg font-semibold mb-1">Mulai Rencanakan Budget</h2>
      <p class="text-sm opacity-80 mb-4">Masukkan total budget pernikahanmu untuk memulai</p>
      <div class="flex gap-3">
        <input
          v-model.number="setupAmount"
          type="number"
          min="10000000"
          step="5000000"
          class="flex-1 rounded-xl border-0 text-gray-900 text-sm px-3 py-2"
          placeholder="Total budget (Rp)"
        />
        <AppButton variant="secondary" @click="handleSetup">Mulai</AppButton>
      </div>
      <p class="text-xs opacity-60 mt-2">Min. Rp 10.000.000</p>
    </div>

    <!-- Budget Overview (setelah setup) -->
    <template v-if="isSetup">
      <!-- Summary Card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs text-gray-500">Total Budget</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatRupiah(totalBudget) }}</p>
          </div>
          <span
            class="text-xs font-semibold px-3 py-1.5 rounded-full"
            :class="usagePercentage >= 90 ? 'bg-red-100 text-red-700' : usagePercentage >= 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'"
          >
            {{ budgetStatusLabel }}
          </span>
        </div>

        <ProgressBar
          :value="usagePercentage"
          :color="budgetStatusColor"
          :show-label="true"
          size="md"
        >
          <template #label>
            <span class="text-xs text-gray-500">Terpakai {{ formatShort(totalUsed) }} dari {{ formatShort(totalBudget) }}</span>
          </template>
        </ProgressBar>

        <div class="mt-3 flex justify-between text-sm">
          <div>
            <p class="text-gray-500 text-xs">Terpakai</p>
            <p class="font-semibold text-gray-800">{{ formatRupiah(totalUsed) }}</p>
          </div>
          <div class="text-right">
            <p class="text-gray-500 text-xs">Sisa</p>
            <p class="font-semibold" :class="remainingBudget < 0 ? 'text-red-600' : 'text-green-600'">
              {{ formatRupiah(remainingBudget) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 rounded-xl p-1">
        <button
          :class="['flex-1 text-xs py-2 rounded-lg font-medium transition-colors', activeTab === 'budget' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600']"
          @click="activeTab = 'budget'"
        >
          📊 Budget
        </button>
        <button
          :class="['flex-1 text-xs py-2 rounded-lg font-medium transition-colors', activeTab === 'vendor' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600']"
          @click="activeTab = 'vendor'"
        >
          🤝 Vendor
        </button>
        <button
          :class="['flex-1 text-xs py-2 rounded-lg font-medium transition-colors', activeTab === 'contributor' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600']"
          @click="activeTab = 'contributor'"
        >
          👥 Kontributor
        </button>
        <button
          :class="['flex-1 text-xs py-2 rounded-lg font-medium transition-colors', activeTab === 'savings' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600']"
          @click="activeTab = 'savings'"
        >
          💰 Tabungan
        </button>
      </div>

      <!-- Budget Tab -->
      <div v-if="activeTab === 'budget'" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PreBudgetCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @edit-allocation="openEditCategory"
        />
      </div>

      <!-- Vendor Tab -->
      <div v-else-if="activeTab === 'vendor'">
        <div v-if="vendors.length === 0" class="text-center py-10 text-gray-400">
          <p class="text-4xl mb-2">🤝</p>
          <p class="text-sm">Belum ada vendor. Tambahkan vendor pertamamu!</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <VendorTracker
            v-for="vendor in vendors"
            :key="vendor.id"
            :vendor="vendor"
            @edit="openEditVendor"
            @delete="vendorStore.deleteVendor"
            @record-dp="openDPModal"
          />
        </div>
      </div>

      <!-- Contributor Tab -->
      <ContributorManager v-else-if="activeTab === 'contributor'" />

      <!-- Savings Tab -->
      <div v-else class="space-y-4">
        <SavingsGoalCard />
        <RingTracker />
      </div>
    </template>
  </div>

  <!-- Modals -->
  <VendorFormModal
    v-if="isEditVendorOpen"
    :vendor="selectedVendor"
    @close="isEditVendorOpen = false"
    @submit="handleVendorEditSubmit"
  />
  <VendorDPModal
    v-if="isDPModalOpen"
    :vendor="selectedVendor"
    @close="isDPModalOpen = false"
    @submit="handleDPSubmit"
  />
  <EditCategoryBudgetModal
    v-if="isEditCategoryOpen"
    :category="selectedCategory"
    @close="isEditCategoryOpen = false"
    @submit="handleCategoryBudgetSubmit"
  />
</template>
