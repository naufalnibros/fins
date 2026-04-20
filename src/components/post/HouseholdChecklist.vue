<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useHouseholdStore } from '@/stores/household.store'
import { useCurrency } from '@/composables/useCurrency'
import AppButton from '@/components/common/AppButton.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import type { HouseholdItem } from '@/types/household.types'

const store = useHouseholdStore()
const { items, completionPercentage } = storeToRefs(store)
const { formatRupiah, formatShort } = useCurrency()

const editingId = ref<string | null>(null)
const actualPriceInput = ref<number>(0)

// Urutkan berdasarkan prioritas
const sortedItems = computed(() =>
  [...items.value].sort((a: HouseholdItem, b: HouseholdItem) => a.priority - b.priority)
)

function startBought(id: string) {
  editingId.value = id
  actualPriceInput.value = 0
}

function confirmBought(id: string) {
  if (actualPriceInput.value > 0) {
    store.markItemBought(id, actualPriceInput.value)
  }
  editingId.value = null
}

const statusIcon: Record<string, string> = {
  'not-bought': '⬜',
  planned: '🟡',
  bought: '✅',
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header progress -->
    <div class="bg-white rounded-xl border border-gray-100 p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold text-gray-900">Checklist Rumah Tangga</h3>
        <span class="text-sm text-gray-500">{{ completionPercentage }}% selesai</span>
      </div>
      <ProgressBar :value="completionPercentage" color="bg-emerald-500" />
    </div>

    <!-- Daftar item -->
    <div class="space-y-2">
      <div
        v-for="item in sortedItems"
        :key="item.id"
        class="bg-white rounded-xl border border-gray-100 p-3"
      >
        <div class="flex items-start gap-3">
          <span class="text-lg mt-0.5">{{ statusIcon[item.status] }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="font-medium text-gray-900 text-sm">{{ item.name }}</p>
              <p v-if="item.status === 'bought' && item.actualPrice" class="text-xs font-semibold text-green-600 shrink-0">
                {{ formatRupiah(item.actualPrice) }}
              </p>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">
              Estimasi: {{ formatShort(item.estimatedMinPrice) }} – {{ formatShort(item.estimatedMaxPrice) }}
            </p>

            <!-- Form harga aktual -->
            <div v-if="editingId === item.id" class="mt-2 flex gap-2">
              <input
                v-model.number="actualPriceInput"
                type="number"
                min="0"
                placeholder="Harga aktual (Rp)"
                class="flex-1 rounded-lg border-gray-300 text-xs py-1"
              />
              <AppButton size="sm" variant="primary" @click="confirmBought(item.id)">✓</AppButton>
              <AppButton size="sm" variant="ghost" @click="editingId = null">✗</AppButton>
            </div>

            <div v-else-if="item.status !== 'bought'" class="flex gap-2 mt-2">
              <button
                class="text-xs px-2 py-1 rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                @click="store.markItemPlanned(item.id)"
              >
                Rencanakan
              </button>
              <button
                class="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                @click="startBought(item.id)"
              >
                Tandai Beli
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
