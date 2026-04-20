<script setup lang="ts">
import { ref } from 'vue'
import HouseholdChecklist from '@/components/post/HouseholdChecklist.vue'
import LoanCalc from '@/components/post/LoanCalc.vue'
import MergeWizard from '@/components/post/MergeWizard.vue'
import EmergencyFundTracker from '@/components/post/EmergencyFundTracker.vue'
import MonthlyBudgetPlanner from '@/components/post/MonthlyBudgetPlanner.vue'
import LoanForecast from '@/components/post/LoanForecast.vue'
import AnniversaryReview from '@/components/post/AnniversaryReview.vue'

type Tab = 'checklist' | 'merge' | 'monthly' | 'loans' | 'review'
const activeTab = ref<Tab>('checklist')
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Post-Wedding 🏠</h1>
      <p class="text-gray-500 text-sm mt-1">Setup rumah tangga dan kelola keuangan bersama</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
      <button
        :class="['flex-shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition-colors', activeTab === 'checklist' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600']"
        @click="activeTab = 'checklist'"
      >
        🏡 Checklist
      </button>
      <button
        :class="['flex-shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition-colors', activeTab === 'merge' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600']"
        @click="activeTab = 'merge'"
      >
        💑 Merge
      </button>
      <button
        :class="['flex-shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition-colors', activeTab === 'monthly' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600']"
        @click="activeTab = 'monthly'"
      >
        📊 Bulanan
      </button>
      <button
        :class="['flex-shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition-colors', activeTab === 'loans' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600']"
        @click="activeTab = 'loans'"
      >
        📈 Cicilan
      </button>
      <button
        :class="['flex-shrink-0 text-xs py-2 px-3 rounded-lg font-medium transition-colors', activeTab === 'review' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600']"
        @click="activeTab = 'review'"
      >
        🎂 Review
      </button>
    </div>

    <div v-if="activeTab === 'checklist'" class="space-y-4">
      <HouseholdChecklist />
      <LoanCalc />
    </div>
    <MergeWizard v-else-if="activeTab === 'merge'" />
    <div v-else-if="activeTab === 'monthly'" class="space-y-4">
      <MonthlyBudgetPlanner />
      <EmergencyFundTracker :monthly-expense="5000000" />
    </div>
    <LoanForecast v-else-if="activeTab === 'loans'" />
    <AnniversaryReview v-else />
  </div>
</template>
