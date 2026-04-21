# Halaman Post-Wedding
**Route:** `/post-wedding`
**Tujuan Utama:** Membantu pasangan baru mengelola kehidupan finansial setelah menikah — mencakup checklist perabot rumah tangga, kalkulasi KPR/cicilan, penggabungan keuangan pasangan, perencanaan budget bulanan, pelacakan dana darurat, forecasting cicilan 12 bulan, dan review komprehensif keuangan pernikahan.

---

## 1. Overview Fitur & Layanan (Untuk Product Owner)

- **Checklist Perabot Rumah Tangga:** Daftar barang-barang rumah tangga yang perlu disiapkan beserta harga estimasi dan status pembelian. Membantu pasangan memastikan tidak ada kebutuhan rumah yang terlewat.
- **Kalkulator KPR / Cicilan:** Simulator pinjaman dengan formula anuitas untuk menghitung cicilan bulanan dari KPR atau kredit lainnya berdasarkan pokok, bunga, dan tenor.
- **Merge Finance Wizard:** Panduan langkah demi langkah (3 langkah) untuk menggabungkan keuangan pasangan, memilih metode pembagian biaya (50:50, proporsional, atau kustom), dan menentukan kontribusi masing-masing pihak.
- **Perencanaan Budget Bulanan:** Tampilan ringkasan budget bulanan aktif (dari template default pengeluaran rumah tangga) dengan breakdown per kategori dan perbandingan antara anggaran vs. realisasi.
- **Tracker Dana Darurat:** Komponen yang membantu pasangan membangun dana darurat senilai N bulan pengeluaran (default dari konstanta `EMERGENCY_FUND_MONTHS`). Menampilkan berapa bulan pengeluaran yang sudah tercukupi.
- **Forecast Cicilan 12 Bulan:** Input berbagai cicilan aktif (KPR, motor, KTA, dll.) dan lihat proyeksi total pembayaran dan saldo tersisa selama 12 bulan ke depan dalam bentuk tabel.
- **Anniversary Review:** Rekap menyeluruh keuangan pernikahan — membandingkan total budget, pengeluaran aktual, amplop masuk, kontribusi, dan menghasilkan net result (surplus/defisit). Dilengkapi rekomendasi asuransi berdasarkan konstanta `INSURANCE_RECOMMENDATIONS`.

---

## 2. User Interaction Flow (Untuk PO & QA)

### Alur: Tab 🏡 Checklist
- [ ] **Aksi:** Buka tab Checklist → **Ekspektasi:** Muncul daftar item rumah tangga (`HouseholdChecklist`) dengan status centang dan estimasi harga.
- [ ] **Aksi:** Centang item → **Ekspektasi:** Item ditandai terbeli, total budget terpakai terupdate.
- [ ] **Aksi:** Buka `LoanCalc` di bawah checklist → **Ekspektasi:** Form kalkulator cicilan dengan input pokok, bunga per tahun, dan tenor bulan. Hasil cicilan dihitung secara real-time.

### Alur: Tab 💑 Merge
- [ ] **Aksi:** Buka tab Merge → **Ekspektasi:** Tampil `MergeWizard` di **Step 1**: input penghasilan Pasangan A dan B.
- [ ] **Aksi:** Input kedua penghasilan lalu klik "Lanjut →" → **Ekspektasi:** Pindah ke **Step 2**: pilih metode pembagian (50:50 / Proporsional / Custom).
- [ ] **Aksi:** Pilih metode "50:50" → **Ekspektasi:** Progress bar menunjukkan 50:50, estimasi kontribusi masing-masing dihitung.
- [ ] **Aksi:** Pilih metode "Proporsional" → **Ekspektasi:** Rasio dihitung otomatis dari perbandingan penghasilan A dan B.
- [ ] **Aksi:** Pilih metode "Custom" → **Ekspektasi:** Slider muncul untuk mengatur rasio Pasangan A secara manual (0–100%).
- [ ] **Aksi:** Klik "✅ Terapkan" → **Ekspektasi:** Pindah ke **Step 3**: tampil konfirmasi keberhasilan merge dengan mode dan rasio terpilih. Store `isMerged` di-set `true`.
- [ ] **Aksi:** Klik "← Kembali" di Step 2 → **Ekspektasi:** Kembali ke Step 1 untuk mengedit penghasilan.

### Alur: Tab 📊 Bulanan
- [ ] **Aksi:** Buka tab Bulanan → **Ekspektasi:** `MonthlyBudgetPlanner` menampilkan plan bulan aktif (jika ada) dengan ringkasan budget, terpakai, dan sisa; diikuti breakdown per kategori dengan progress bar.
- [ ] **Aksi:** Belum ada plan aktif → **Ekspektasi:** Pesan "Belum ada budget bulanan aktif."
- [ ] **Aksi:** Di bawah planner, `EmergencyFundTracker` tampil → **Ekspektasi:** Jika goal dana darurat belum dibuat, tampil tombol "🛡️ Buat Dana Darurat".
- [ ] **Aksi:** Klik "🛡️ Buat Dana Darurat" → **Ekspektasi:** Goal dana darurat dibuat di `savings.store` dengan target = `monthlyExpense × EMERGENCY_FUND_MONTHS`, progress bar muncul.
- [ ] **Aksi:** Goal dana darurat sudah ada → **Ekspektasi:** Progress bar, persentase, dan "Cukup untuk X bulan" tampil.

### Alur: Tab 📈 Cicilan
- [ ] **Aksi:** Buka tab Cicilan tanpa data → **Ekspektasi:** Tampil pesan "Belum ada cicilan." dan tombol "+ Cicilan".
- [ ] **Aksi:** Klik "+ Cicilan" → **Ekspektasi:** Form muncul dengan field nama, pokok, cicilan/bulan, bunga %/tahun, dan tenor (bulan).
- [ ] **Aksi:** Submit form dengan nama kosong atau cicilan = 0 → **Ekspektasi:** Tombol "Simpan" disabled.
- [ ] **Aksi:** Submit form valid → **Ekspektasi:** Cicilan ditambahkan ke daftar, tabel forecast 12 bulan muncul di bawah.
- [ ] **Aksi:** Melihat tabel forecast → **Ekspektasi:** 12 baris menunjukkan bulan, total bayar per bulan, dan sisa saldo.

### Alur: Tab 🎂 Review
- [ ] **Aksi:** Buka tab Review → **Ekspektasi:** `AnniversaryReview` menampilkan 4 kartu statistik (total budget, total keluar, amplop masuk, kontribusi) dan kotak hasil akhir (hijau jika surplus, merah jika defisit).
- [ ] **Aksi:** Melihat tips → **Ekspektasi:** Ditampilkan tips otomatis berdasarkan kondisi (contoh: "⚠️ N vendor belum lunas").
- [ ] **Aksi:** Melihat rekomendasi asuransi → **Ekspektasi:** Daftar asuransi (jiwa, kesehatan, kendaraan) dengan estimasi premi minimum per bulan.

---

## 3. Detail Teknis (Untuk Frontend Engineer)

### A. UI Components

| Komponen | Peran |
|---|---|
| `HouseholdChecklist` | Daftar item rumah tangga dengan toggle status beli |
| `LoanCalc` | Form kalkulator cicilan anuitas (input → output real-time) |
| `MergeWizard` | Wizard 3-step untuk merge keuangan pasangan |
| `EmergencyFundTracker` | Tracker dana darurat berbasis `savings.store` |
| `MonthlyBudgetPlanner` | Ringkasan budget bulanan dari `monthly-budget.store` |
| `LoanForecast` | Form input cicilan + tabel proyeksi 12 bulan |
| `AnniversaryReview` | Rekap seluruh keuangan pernikahan + rekomendasi asuransi |
| `ProgressBar` | Komponen shared — digunakan di `MonthlyBudgetPlanner` dan `EmergencyFundTracker` |
| `AppButton` | Komponen shared — digunakan di seluruh sub-komponen |

### B. State Management & Hooks

**Store: `useMonthlyBudgetStore`** (`src/stores/monthly-budget.store.ts`)
- `plans`: `Ref<MonthlyBudgetPlan[]>` — Semua rencana budget bulanan.
- `currentPlan`: `ComputedRef<MonthlyBudgetPlan | undefined>` — Plan dengan `monthYear` sama dengan bulan saat ini.
- `loans`: `Ref<LoanEntry[]>` — Daftar cicilan aktif.
- `isMerged`: `Ref<boolean>` — Flag apakah pasangan sudah aktivasi merge mode. Di-persist di `localStorage` key `'budgetin-merged'`.
- `totalMonthlyInstallments`: Total cicilan per bulan dari semua `loans`.
- `generateLoanForecast(monthlyIncome)`: Menghasilkan array 12 `LoanForecastMonth` berisi `month`, `totalInstallments`, `remainingBalance`, dan detail per loan.
- `activateMergeMode()`: Set `isMerged = true` dan otomatis buat plan bulan ini jika belum ada.
- `addLoan(data: Omit<LoanEntry, 'id'>)`: Tambah cicilan baru dengan auto-generate ID.

**Store: `useSavingsStore`** (`src/stores/savings.store.ts`) — digunakan di `EmergencyFundTracker`
- `goals`: `Ref<SavingsGoal[]>` — Dicari goal dengan `type === 'emergency-fund'`.
- `createEmergencyFundGoal(monthlyExpense)`: Buat goal baru dengan target = `monthlyExpense × EMERGENCY_FUND_MONTHS`.

**Store: `useBudgetStore`** — digunakan di `AnniversaryReview`
- `totalBudget`, `totalUsed`: Diambil langsung dari store untuk kalkulasi net result.

**Store: `useWeddingDayStore`** — digunakan di `AnniversaryReview`
- `totalAmploIncome`: Pemasukan total amplop dari hari H.

**Store: `useContributorStore`** — digunakan di `AnniversaryReview`
- `contributors`: Array kontributor, disum `contributionAmount` untuk total kontribusi.

**Store: `useVendorStore`** — digunakan di `AnniversaryReview`
- `vendors`: Difilter `status === 'settled'` untuk menghitung vendor yang belum lunas.

**State lokal (view)**
- `activeTab`: `Ref<'checklist' | 'merge' | 'monthly' | 'loans' | 'review'>` — Mengontrol tab yang aktif.

**State lokal (`MergeWizard`)**
- `step`: `Ref<1 | 2 | 3>` — Tahap wizard saat ini.
- `incomeA`, `incomeB`: `Ref<number>` — Penghasilan masing-masing pasangan.
- `selectedMode`: `Ref<SplitMode>` — Mode pembagian (`'50-50' | 'proportional' | 'custom'`).
- `customRatioA`: `Ref<number>` — Persentase kontribusi A jika mode custom (0–100).
- `ratioA` / `ratioB`: `ComputedRef<number>` — Rasio final berdasarkan mode terpilih.

### C. API & Data Fetching

Halaman ini tidak melakukan HTTP request. Semua data disimpan ke **`localStorage`** via Pinia stores.

| Fungsi Store | Kapan Dipanggil | Efek |
|---|---|---|
| `monthlyBudgetStore.activateMergeMode()` | Klik "✅ Terapkan" di Step 2 wizard | Set `isMerged = true`, buat plan bulan ini jika belum ada, simpan ke `localStorage` |
| `monthlyBudgetStore.addLoan(data)` | Submit form cicilan di `LoanForecast` | Push `LoanEntry` baru (dengan `startDate: new Date()`), simpan ke `localStorage` |
| `monthlyBudgetStore.generateLoanForecast(income)` | Computed di `LoanForecast` — reaktif terhadap `store.loans` | Kalkulasi 12 bulan proyeksi; di-render ke tabel |
| `savingsStore.createEmergencyFundGoal(monthlyExpense)` | Klik "🛡️ Buat Dana Darurat" | Buat `SavingsGoal` baru tipe `emergency-fund`, target = prop `monthlyExpense` × konstanta |

### D. Edge Cases & Validations

- *Prop `monthlyExpense` hardcoded:* `EmergencyFundTracker` di view dipanggil dengan `:monthly-expense="5000000"` — nilainya hardcoded, belum dinamis dari plan bulanan aktif.
- *Forecast tanpa income dinamis:* `generateLoanForecast` di `LoanForecast.vue` dipanggil dengan nilai tetap `10_000_000` — bukan dari penghasilan aktual pasangan yang sudah di-input di Merge Wizard.
- *Tombol "Simpan" cicilan disabled:* Guard `:disabled="!form.name || form.monthlyPayment <= 0"` mencegah submit cicilan tidak valid.
- *Merge step tidak bisa lanjut:* Tombol "Lanjut →" disabled selama `totalIncome <= 0` (salah satu atau kedua penghasilan masih 0).
- *Tab overflow pada mobile:* Container tab menggunakan `overflow-x-auto` karena ada 5 tab yang tidak muat dalam satu baris sempit.
- *Net result negatif di Review:* Kotak hasil akhir berubah background dan warna teks menjadi merah jika `netResult < 0`.
- *Tips dinamis di Review:* Array `tips` hanya menampilkan item jika kondisinya terpenuhi — tidak ada tips kosong yang ditampilkan.
- *Plan bulanan belum ada:* `MonthlyBudgetPlanner` menangani `currentPlan === undefined` dengan pesan teks fallback, tidak crash.
- *Data `AnniversaryReview` cross-store:* Komponen ini membaca dari 4 store sekaligus (`budget`, `weddingDay`, `contributor`, `vendor`) — jika salah satu store belum punya data, computed akan mengembalikan nilai `0` atau array kosong (aman).
