// Store untuk manajemen vendor pernikahan

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { Vendor, VendorFormData, DPPayment, VendorStatus } from '@/types/vendor.types'

const STORAGE_KEY = 'budgetin-vendors'
const PAYMENT_KEY = 'budgetin-dp-payments'

function loadVendors(): Vendor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Vendor[]
    // Konversi string tanggal kembali ke Date
    return parsed.map((v) => ({
      ...v,
      dueDate: v.dueDate ? new Date(v.dueDate) : null,
      createdAt: new Date(v.createdAt),
      updatedAt: new Date(v.updatedAt),
    }))
  } catch {
    return []
  }
}

export const useVendorStore = defineStore('vendor', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const vendors = ref<Vendor[]>(loadVendors())
  const dpPayments = ref<DPPayment[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────
  const totalContractAmount = computed(() =>
    vendors.value.reduce((acc: number, v: Vendor) => acc + v.contractAmount, 0)
  )

  const settledCount = computed(() =>
    vendors.value.filter((v: Vendor) => v.status === 'settled').length
  )

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors.value))
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async function fetchVendors(): Promise<void> {
    // Data sudah di-load dari localStorage saat store diinisialisasi
    // Method ini ada untuk kompatibilitas dengan pola async yang konsisten
    isLoading.value = true
    error.value = null
    try {
      vendors.value = loadVendors()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan'
    } finally {
      isLoading.value = false
    }
  }

  function addVendor(formData: VendorFormData): Vendor {
    const now = new Date()
    const newVendor: Vendor = {
      id: uuidv4(),
      ...formData,
      dpPaidAmount: 0,
      remainingAmount: formData.contractAmount,
      status: 'quoted',
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      createdAt: now,
      updatedAt: now,
    }
    vendors.value.push(newVendor)
    persist()
    return newVendor
  }

  function updateVendor(id: string, formData: Partial<VendorFormData>): void {
    const index = vendors.value.findIndex((v) => v.id === id)
    if (index === -1) return
    vendors.value[index] = {
      ...vendors.value[index],
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : vendors.value[index].dueDate,
      updatedAt: new Date(),
    }
    persist()
  }

  function deleteVendor(id: string): void {
    vendors.value = vendors.value.filter((v) => v.id !== id)
    persist()
  }

  function updateVendorStatus(id: string, status: VendorStatus): void {
    const vendor = vendors.value.find((v) => v.id === id)
    if (!vendor) return
    vendor.status = status
    vendor.updatedAt = new Date()
    persist()
  }

  /**
   * Catat pembayaran DP untuk vendor
   */
  function recordDpPayment(vendorId: string, amount: number, notes = ''): void {
    const vendor = vendors.value.find((v) => v.id === vendorId)
    if (!vendor) return

    const payment: DPPayment = {
      id: uuidv4(),
      vendorId,
      amount,
      paidAt: new Date(),
      notes,
    }
    dpPayments.value.push(payment)
    localStorage.setItem(PAYMENT_KEY, JSON.stringify(dpPayments.value))

    // Update total DP yang sudah dibayar di vendor
    vendor.dpPaidAmount += amount
    vendor.remainingAmount = vendor.contractAmount - vendor.dpPaidAmount
    if (vendor.dpPaidAmount >= vendor.dpAmount) {
      vendor.status = 'dp-paid'
    }
    vendor.updatedAt = new Date()
    persist()
  }

  return {
    vendors,
    dpPayments,
    isLoading,
    error,
    totalContractAmount,
    settledCount,
    fetchVendors,
    addVendor,
    updateVendor,
    deleteVendor,
    updateVendorStatus,
    recordDpPayment,
  }
})
