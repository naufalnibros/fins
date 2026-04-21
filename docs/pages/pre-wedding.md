# Halaman Pre-Wedding
**Route:** `/pre-wedding` (alias: `/` → redirect ke `/pre-wedding`)
**Tujuan Utama:** Membantu pasangan merencanakan anggaran pernikahan secara menyeluruh — mulai dari penetapan total budget, pelacakan vendor, pencatatan kontributor dana, hingga pengelolaan tabungan dan estimasi biaya cincin.

---

## 1. Overview Fitur & Layanan (Untuk Product Owner)

- **Setup Budget Awal:** Pengguna yang baru pertama kali membuka aplikasi diarahkan untuk memasukkan total anggaran pernikahan (minimum Rp 10.000.000). Setelah disubmit, budget didistribusikan otomatis ke kategori-kategori pengeluaran berdasarkan persentase default.
- **Ringkasan Budget:** Kartu statistik yang menampilkan total budget, total terpakai, sisa anggaran, dan progress bar berwarna-warni (hijau/kuning/merah) sesuai tingkat penggunaan.
- **Manajemen Kategori Budget:** Setiap kategori (mis. catering, gedung, dekorasi) ditampilkan dalam kartu individual berisi alokasi, pengeluaran aktual, dan status.
- **Pelacakan Vendor:** Daftar vendor pernikahan beserta status pembayaran (quoted, dp-paid, settled, cancelled). Vendor dapat dihapus langsung dari kartu.
- **Manajemen Kontributor Dana:** Pencatatan siapa saja (orang tua, keluarga, dll.) yang berkontribusi ke dana pernikahan, lengkap dengan status konfirmasi. Tampil ringkasan total terkonfirmasi vs. pending.
- **Savings Goals:** Pembuatan dan pemantauan tujuan tabungan seperti honeymoon, dana darurat, cincin, atau kustom. Setiap goal bisa menerima setoran (deposit) dan dilacak progressnya.
- **Estimasi Harga Cincin & Emas:** Widget informatif yang menampilkan harga emas referensi per gram (18K/22K/24K) dan estimasi biaya sepasang cincin.

---

## 2. User Interaction Flow (Untuk PO & QA)

### Alur: Pertama Kali Buka Aplikasi
- [ ] **Aksi:** Buka halaman Pre-Wedding tanpa data → **Ekspektasi:** Muncul banner gradient ungu-pink berisi form input total budget, field default terisi Rp 150.000.000.
- [ ] **Aksi:** Isi nominal < Rp 10.000.000 lalu klik "Mulai" → **Ekspektasi:** Tidak terjadi apa-apa (validasi minimum, tombol tidak mengeksekusi `setupBudget`).
- [ ] **Aksi:** Isi nominal ≥ Rp 10.000.000 lalu klik "Mulai" → **Ekspektasi:** Banner setup hilang, muncul Summary Card + tab navigasi 4 tab.

### Alur: Tab 📊 Budget
- [ ] **Aksi:** Melihat kartu kategori budget → **Ekspektasi:** Setiap kartu (`PreBudgetCard`) menampilkan nama kategori, alokasi (Rp), pengeluaran, dan progress bar.
- [ ] **Aksi:** Badge status di summary card → **Ekspektasi:** Warna berubah → hijau (< 75%), kuning (75–89%), merah (≥ 90%) sesuai `usagePercentage`.

### Alur: Tab 🤝 Vendor
- [ ] **Aksi:** Belum ada vendor → **Ekspektasi:** Tampil empty state dengan ikon 🤝 dan teks ajakan.
- [ ] **Aksi:** Klik tombol hapus di kartu vendor → **Ekspektasi:** Vendor dihapus dari daftar dan dari `localStorage`.
- [ ] **Aksi:** Event `@edit` atau `@record-dp` di kartu vendor → **Ekspektasi:** Saat ini handler kosong `() => {}` (fitur belum diimplementasi di view, hanya di komponen).

### Alur: Tab 👥 Kontributor
- [ ] **Aksi:** Klik "➕ Tambah Kontributor" → **Ekspektasi:** Form muncul di bawah tombol dengan field nama, relasi (dropdown), jumlah, dan catatan.
- [ ] **Aksi:** Submit form dengan nama kosong atau jumlah = 0 → **Ekspektasi:** Tidak ada aksi (validasi guard di fungsi `submit()`).
- [ ] **Aksi:** Submit form valid → **Ekspektasi:** Kontributor ditambahkan ke daftar dengan badge "⏳ Pending", total kontribusi terupdate.
- [ ] **Aksi:** Klik tombol ✓ di baris kontributor yang belum dikonfirmasi → **Ekspektasi:** Badge berubah jadi "✅ Konfirm", nominal masuk ke `confirmedContribution`.

### Alur: Tab 💰 Tabungan
- [ ] **Aksi:** Klik "🎯 Buat Savings Goal Baru" → **Ekspektasi:** Form muncul dengan pilihan tipe goal (honeymoon, dana darurat, cincin, dll).
- [ ] **Aksi:** Pilih tipe `honeymoon` → **Ekspektasi:** Muncul quick-pick destinasi honeymoon (dari konstanta `HONEYMOON_DESTINATIONS`) yang bisa diklik untuk mengisi otomatis nama dan target biaya.
- [ ] **Aksi:** Submit goal tanpa nama/target → **Ekspektasi:** Tidak ada aksi (guard validasi).
- [ ] **Aksi:** Klik tombol deposit (ikon +) di kartu goal → **Ekspektasi:** Muncul mini-form setoran dengan field jumlah dan catatan.
- [ ] **Aksi:** Submit deposit valid → **Ekspektasi:** `currentAmount` goal bertambah, progress bar terupdate.
- [ ] **Aksi:** Klik pause/resume goal → **Ekspektasi:** Status goal berubah antara `active` ↔ `paused`.
- [ ] **Aksi:** Klik hapus goal → **Ekspektasi:** Goal dihapus dari daftar.
- [ ] **Widget RingTracker:** Menampilkan harga emas 24K/22K/18K per gram dan estimasi biaya sepasang cincin (read-only, tidak ada interaksi).

---

## 3. Detail Teknis (Untuk Frontend Engineer)

### A. UI Components

| Komponen | Peran |
|---|---|
| `PreBudgetCard` | Kartu per kategori budget — menampilkan alokasi, pengeluaran, dan progress |
| `VendorTracker` | Kartu vendor tunggal dengan aksi edit/hapus/DP |
| `ContributorManager` | Panel lengkap manajemen kontributor (form + daftar) |
| `SavingsGoalCard` | Panel savings goals (form buat goal, deposit, list goal) |
| `RingTracker` | Widget statis estimasi harga emas & cincin |
| `ProgressBar` | Komponen shared — digunakan di summary card & kartu kategori |
| `AppButton` | Komponen shared — tombol aksi utama |

### B. State Management & Hooks

**Store: `useBudgetStore`** (`src/stores/budget.store.ts`)
- `isSetup`: `boolean` — Flag apakah budget sudah diinisialisasi. Mengontrol apakah banner setup atau konten utama yang ditampilkan.
- `totalBudget`: `Ref<number>` — Total anggaran yang diinput user.
- `totalUsed`: `ComputedRef<number>` — Akumulasi semua pengeluaran dari semua kategori.
- `remainingBudget`: `ComputedRef<number>` — Selisih `totalBudget - totalUsed`, bisa negatif.

**Composable: `useBudget`** (`src/composables/useBudget.ts`)
- `categories`: Daftar kategori budget dengan alokasi dan pengeluaran.
- `usagePercentage`: Persentase pemakaian, digunakan untuk warna badge status.
- `budgetStatusColor` / `budgetStatusLabel`: Mapping warna dan label dari `usagePercentage`.

**Store: `useVendorStore`** (`src/stores/vendor.store.ts`)
- `vendors`: `Ref<Vendor[]>` — Daftar vendor, di-expose via `storeToRefs`.

**Store: `useContributorStore`** (`src/stores/contributor.store.ts`)
- `contributors`: `Ref<Contributor[]>` — Daftar kontributor dana.
- `totalContribution`: Total nominal semua kontributor.
- `confirmedContribution`: Total nominal yang sudah dikonfirmasi (`confirmedAt !== null`).

**Store: `useSavingsStore`** (`src/stores/savings.store.ts`)
- `goals`: `Ref<SavingsGoal[]>` — Semua savings goals.
- `activeGoals`: Goals dengan status `active`.
- `totalSaved`: Total `currentAmount` dari semua goals.
- `overallProgress`: Persentase total tabungan terhadap total target.

**State lokal (view)**
- `setupAmount`: `Ref<number>` — Default `150_000_000`, binding ke input setup budget.
- `activeTab`: `Ref<'budget' | 'vendor' | 'contributor' | 'savings'>` — Mengontrol tab yang aktif.

### C. API & Data Fetching

Halaman ini tidak melakukan HTTP request. Semua data disimpan dan dibaca dari **`localStorage`** melalui Pinia stores.

| Fungsi Store | Kapan Dipanggil | Efek |
|---|---|---|
| `budgetStore.setupBudget(amount)` | Klik "Mulai" saat belum setup | Set `totalBudget`, distribusikan ke kategori, simpan ke `localStorage` |
| `vendorStore.deleteVendor(id)` | Klik hapus di `VendorTracker` | Hapus vendor dari array, update `localStorage` |
| `contributorStore.addContributor(data)` | Submit form kontributor | Push kontributor baru ke array, update `localStorage` |
| `contributorStore.confirmContributor(id)` | Klik ✓ di baris kontributor | Set `confirmedAt = new Date()`, update `localStorage` |
| `savingsStore.addGoal(data)` | Submit form goal baru (non-honeymoon) | Push goal baru, hitung `monthlyTarget`, simpan |
| `savingsStore.createHoneymoonGoal(...)` | Submit form goal tipe honeymoon | Goal dibuat dengan icon ✈️ dan warna biru |
| `savingsStore.addDeposit(goalId, amount, note)` | Submit form deposit | Tambah deposit ke `goal.deposits`, update `currentAmount` |
| `savingsStore.pauseGoal(id)` / `resumeGoal(id)` | Klik pause/resume | Toggle status `active` ↔ `paused` |
| `savingsStore.deleteGoal(id)` | Klik hapus goal | Hapus goal dari array |

### D. Edge Cases & Validations

- *Budget belum di-setup:* Konten utama (summary card, tabs) sepenuhnya tersembunyi via `v-if="isSetup"`. Hanya banner setup yang tampil.
- *Input budget < Rp 10.000.000:* Guard di `handleSetup()` — `if (setupAmount.value >= 10_000_000)` — mencegah eksekusi.
- *Vendor kosong:* Tampil empty state dengan emoji dan teks panduan.
- *Form kontributor tidak valid:* Guard `if (!formName.value || formAmount.value <= 0) return` di fungsi `submit()`.
- *Form savings goal tidak valid:* Guard `if (!formName.value || formTarget.value <= 0) return` di `createGoal()`.
- *Deposit 0 atau negatif:* Guard `if (depositAmount.value <= 0) return` di `submitDeposit()`.
- *`remainingBudget` negatif:* Teks sisa anggaran di summary card berubah warna menjadi `text-red-600`.
- *Data persisten:* Semua store menggunakan `localStorage` — data tetap ada setelah reload atau navigasi antar halaman.
- *Tab handler edit/DP vendor:* Event `@edit` dan `@record-dp` saat ini diarahkan ke handler kosong `() => {}`, artinya fungsi ini belum diimplementasi di level view.
