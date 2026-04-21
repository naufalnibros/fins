# Halaman Hari-H (Wedding Day)
**Route:** `/wedding-day`
**Tujuan Utama:** Menjadi pusat komando keuangan saat hari resepsi berlangsung — mencatat semua pemasukan amplop/transfer dari tamu, merekam pengeluaran mendadak, dan mengelola alur persetujuan (approval) untuk pengeluaran besar di atas Rp 5.000.000.

---

## 1. Overview Fitur & Layanan (Untuk Product Owner)

- **Statistik Real-time Hari-H:** Dua kartu di bagian atas menampilkan total amplop yang terkumpul dan total pengeluaran secara langsung, membantu tim keluarga memantau arus kas secara seketika.
- **Pencatatan Amplop & Transfer (AmploCounter):** Form untuk mencatat setiap pemasukan amplop fisik maupun transfer bank dari tamu undangan, lengkap dengan nama tamu, relasi, dan jumlah. Total dipisah antara amplop fisik dan transfer.
- **Catat Pengeluaran Cepat (QuickExpense):** Form sederhana untuk merekam pengeluaran mendadak di hari H, dikategorikan ke salah satu kategori budget yang sudah ada. Setelah disubmit, pengeluaran masuk ke antrian persetujuan.
- **Alur Approval Pengeluaran:** Pengeluaran yang di-submit melalui `QuickExpense` masuk ke status "menunggu" dan ditampilkan di tab Approval. Pengguna berwenang bisa menyetujui atau menolak setiap item. Tab Approval menampilkan badge notifikasi merah berisi jumlah item pending.

---

## 2. User Interaction Flow (Untuk PO & QA)

### Alur: Tab 📩 Amplop
- [ ] **Aksi:** Buka tab Amplop → **Ekspektasi:** Muncul summary card gradient merah-pink berisi total terkumpul, jumlah amplop fisik, dan jumlah transfer.
- [ ] **Aksi:** Klik "Catat Amplop Baru" → **Ekspektasi:** Form muncul dengan field nama tamu, relasi (dropdown 5 pilihan), jumlah (Rp), toggle amplop/transfer, dan catatan.
- [ ] **Aksi:** Submit form dengan nama tamu kosong atau jumlah = 0 → **Ekspektasi:** Tidak ada aksi (validasi guard).
- [ ] **Aksi:** Submit form valid dengan `isEnvelope = true` → **Ekspektasi:** Record ditambah, `envelopeCount` bertambah 1, total naik.
- [ ] **Aksi:** Submit form valid dengan `isEnvelope = false` (transfer) → **Ekspektasi:** Record ditambah, `transferCount` bertambah 1, total naik.
- [ ] **Aksi:** Form di-submit → **Ekspektasi:** Form otomatis tertutup, semua field di-reset.

### Alur: Tab 💸 Catat
- [ ] **Aksi:** Buka tab Catat → **Ekspektasi:** Muncul form dengan field keterangan, jumlah (Rp), dan dropdown kategori budget (dari `budget.store`).
- [ ] **Aksi:** Submit form tanpa mengisi semua field → **Ekspektasi:** Tombol "Kirim untuk Persetujuan" disabled, tidak bisa diklik.
- [ ] **Aksi:** Submit form lengkap dengan jumlah < Rp 5.000.000 → **Ekspektasi:** Pengeluaran otomatis disetujui (status `approved`), tidak masuk antrian approval.
- [ ] **Aksi:** Submit form lengkap dengan jumlah ≥ Rp 5.000.000 → **Ekspektasi:** Pengeluaran masuk antrian (status `pending`), badge merah di tab Approval bertambah.

### Alur: Tab ✅ Approval
- [ ] **Aksi:** Tidak ada pending → **Ekspektasi:** Tampil empty state ikon ✅ dengan teks "Semua pengeluaran sudah disetujui".
- [ ] **Aksi:** Ada item pending → **Ekspektasi:** Setiap item tampil sebagai kartu berisi deskripsi, nominal (ungu bold), dan badge "Menunggu".
- [ ] **Aksi:** Klik "✓ Setujui" pada item → **Ekspektasi:** Item hilang dari daftar pending, status berubah `approved`, nominal masuk ke `totalExpenses`.
- [ ] **Aksi:** Klik "✗ Tolak" pada item → **Ekspektasi:** Item hilang dari daftar pending, status berubah `rejected`.
- [ ] **Aksi:** Badge notifikasi merah di tab → **Ekspektasi:** Selalu menampilkan jumlah item pending secara real-time; hilang saat tidak ada pending.

---

## 3. Detail Teknis (Untuk Frontend Engineer)

### A. UI Components

| Komponen | Peran |
|---|---|
| `AmploCounter` | Panel lengkap pencatatan amplop — summary card, tombol tambah, form, dan riwayat |
| `QuickExpense` | Form inline pencatatan pengeluaran mendadak, submit ke antrian approval |
| `AppBadge` | Menampilkan badge status "Menunggu" (variant `warning`) di kartu approval |
| `AppButton` | Tombol aksi Setujui (variant `primary`) dan Tolak (variant `danger`) |

### B. State Management & Hooks

**Store: `useWeddingDayStore`** (`src/stores/wedding-day.store.ts`)
- `amploRecords`: `Ref<AmploRecord[]>` — Riwayat semua catatan amplop/transfer.
- `expenses`: `Ref<WeddingDayExpense[]>` — Semua pengeluaran hari H (pending, approved, rejected).
- `totalAmploIncome`: `ComputedRef<number>` — Akumulasi seluruh `amploRecords[].amount`.
- `totalExpenses`: `ComputedRef<number>` — Akumulasi pengeluaran dengan status `approved`.
- `pendingExpenses`: `ComputedRef<WeddingDayExpense[]>` — Filter expenses dengan status `pending`.

**Store: `useBudgetStore`** (digunakan di `QuickExpense`)
- `categories`: `Ref<BudgetCategory[]>` — Sumber data untuk dropdown pilihan kategori di form pengeluaran.

**Composable: `useAmplop`** (`src/composables/useAmplop.ts`) — digunakan di `AmploCounter`
- `totalAmploAmount`: Total akumulasi uang amplop.
- `envelopeCount`: Jumlah record dengan `isEnvelope = true`.
- `transferCount`: Jumlah record dengan `isEnvelope = false`.
- `amploRecords`: Ref ke array semua record amplop.
- `addAmploRecord(data)`: Fungsi untuk menambah record baru.

**State lokal (view)**
- `activeTab`: `Ref<'amplop' | 'expense' | 'approval'>` — Mengontrol tab yang aktif.

### C. API & Data Fetching

Halaman ini tidak melakukan HTTP request. Semua data disimpan ke **`localStorage`** via Pinia stores.

| Fungsi Store/Composable | Kapan Dipanggil | Efek |
|---|---|---|
| `addAmploRecord(data)` (via `useAmplop`) | Submit form amplop valid | Push record baru ke `amploRecords`, update total, simpan ke `localStorage` |
| `weddingStore.addExpense(data)` | Submit form `QuickExpense` | Push expense baru; jika `amount < APPROVAL_THRESHOLD_AMOUNT` (5jt) → status `approved`, jika tidak → status `pending` |
| `weddingStore.approveExpense(id, 'Admin')` | Klik "✓ Setujui" di tab Approval | Update status expense jadi `approved`, nominal masuk ke `totalExpenses` |
| `weddingStore.rejectExpense(id)` | Klik "✗ Tolak" di tab Approval | Update status expense jadi `rejected` |

### D. Edge Cases & Validations

- *Form amplop tidak valid:* Guard `if (!guestName.value || amount.value <= 0) return` di `submitRecord()` di `AmploCounter`.
- *Form pengeluaran tidak valid:* Tombol submit di `QuickExpense` menggunakan `:disabled="!description || amount <= 0 || !selectedCategoryId"` — tidak bisa diklik kecuali ketiga field terisi.
- *Auto-approval threshold:* Pengeluaran di bawah `APPROVAL_THRESHOLD_AMOUNT` (Rp 5.000.000, dari `constants.ts`) langsung disetujui tanpa masuk antrian. Logika ini ada di `wedding-day.store.ts`, bukan di komponen.
- *Badge approval:* Hanya muncul jika `pendingExpenses.length > 0`. Hilang otomatis saat antrian kosong.
- *Approver hardcoded:* Fungsi `handleApprove` di view memanggil `store.approveExpense(id, 'Admin')` — nama approver saat ini di-hardcode sebagai `'Admin'`, belum ada input nama approver dinamis di level view (meskipun `ApprovalModal.vue` sudah dibuat dengan field approver, komponen tersebut belum diintegrasikan ke view ini).
- *Reset form setelah submit:* Baik di `AmploCounter` maupun `QuickExpense`, semua field direset ke nilai default dan form ditutup setelah submit berhasil.
- *Data persisten:* Semua record amplop dan pengeluaran tetap ada setelah reload karena di-persist ke `localStorage`.
