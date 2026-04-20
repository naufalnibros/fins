// Tipe-tipe untuk manajemen vendor

import type { VendorCategory } from './budget.types'

export type VendorStatus = 'quoted' | 'dp-paid' | 'settled' | 'cancelled'

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  contactPerson: string
  phone: string
  contractAmount: number
  dpAmount: number
  dpPaidAmount: number
  remainingAmount: number
  status: VendorStatus
  dueDate: Date | null
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface VendorFormData {
  name: string
  category: VendorCategory
  contactPerson: string
  phone: string
  contractAmount: number
  dpAmount: number
  dueDate: string | null
  notes: string
}

export interface DPPayment {
  id: string
  vendorId: string
  amount: number
  paidAt: Date
  notes: string
}

export interface Contributor {
  id: string
  name: string
  relation: 'mempelai-pria' | 'mempelai-wanita' | 'ortu-pria' | 'ortu-wanita' | 'keluarga' | 'other'
  contributionAmount: number
  notes: string
  confirmedAt: Date | null
}
