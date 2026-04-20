// Composable untuk CRUD vendor dan status tracker

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useVendorStore } from '@/stores/vendor.store'
import type { VendorStatus } from '@/types/vendor.types'
import type { VendorCategory } from '@/types/budget.types'

export function useVendor() {
  const store = useVendorStore()
  const { vendors, isLoading, error } = storeToRefs(store)

  // Total kontrak semua vendor
  const totalContractAmount = computed(() =>
    vendors.value.reduce((acc, v) => acc + v.contractAmount, 0)
  )

  // Total DP yang sudah dibayar
  const totalDpPaid = computed(() =>
    vendors.value.reduce((acc, v) => acc + v.dpPaidAmount, 0)
  )

  // Vendor yang mendekati jatuh tempo (7 hari ke depan)
  const upcomingDueVendors = computed(() => {
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    return vendors.value.filter(
      (v) =>
        v.dueDate !== null &&
        v.dueDate <= sevenDaysFromNow &&
        v.status !== 'settled' &&
        v.status !== 'cancelled'
    )
  })

  // Filter vendor berdasarkan status
  const vendorsByStatus = (status: VendorStatus) =>
    computed(() => vendors.value.filter((v) => v.status === status))

  // Filter vendor berdasarkan kategori
  const vendorsByCategory = (category: VendorCategory) =>
    computed(() => vendors.value.filter((v) => v.category === category))

  return {
    vendors,
    isLoading,
    error,
    totalContractAmount,
    totalDpPaid,
    upcomingDueVendors,
    vendorsByStatus,
    vendorsByCategory,
    // Actions
    fetchVendors: store.fetchVendors,
    addVendor: store.addVendor,
    updateVendor: store.updateVendor,
    deleteVendor: store.deleteVendor,
    updateVendorStatus: store.updateVendorStatus,
    recordDpPayment: store.recordDpPayment,
  }
}
