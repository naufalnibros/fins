# Design System — Budgetin Wedding
**Versi:** 1.0.0
**Stack:** Vue 3 + Vite 5 + TypeScript + Tailwind CSS v3 + @tailwindcss/forms
**Terakhir diperbarui:** April 2026

---

## Daftar Isi

- [Design System — Budgetin Wedding](#design-system--budgetin-wedding)
  - [Daftar Isi](#daftar-isi)
  - [1. Filosofi \& Prinsip Desain](#1-filosofi--prinsip-desain)
    - [Mobile-First](#mobile-first)
    - [Clarity over Cleverness](#clarity-over-cleverness)
    - [Emotional Warmth](#emotional-warmth)
    - [Zero-Latency Feedback](#zero-latency-feedback)
  - [2. Fondasi: Token Desain](#2-fondasi-token-desain)
    - [2.1 Palet Warna](#21-palet-warna)
      - [Warna Primary (Ungu)](#warna-primary-ungu)
      - [Warna Fungsional (dari Tailwind default)](#warna-fungsional-dari-tailwind-default)
      - [Warna Background](#warna-background)
    - [2.2 Tipografi](#22-tipografi)
      - [Skala Ukuran Font](#skala-ukuran-font)
      - [Font Weight](#font-weight)
    - [2.3 Spacing \& Sizing](#23-spacing--sizing)
    - [2.4 Border Radius](#24-border-radius)
    - [2.5 Bayangan (Shadow)](#25-bayangan-shadow)
  - [3. Sistem Warna Semantik](#3-sistem-warna-semantik)
    - [Status Anggaran (Budget)](#status-anggaran-budget)
    - [Status Vendor](#status-vendor)
    - [Status Konfirmasi Kontributor](#status-konfirmasi-kontributor)
    - [Status Pengeluaran Hari-H](#status-pengeluaran-hari-h)
    - [Warna Saldo (Positif / Negatif)](#warna-saldo-positif--negatif)
    - [Notifikasi Toast](#notifikasi-toast)
  - [4. Komponen Umum (Common Components)](#4-komponen-umum-common-components)
    - [4.1 AppButton](#41-appbutton)
      - [Props](#props)
      - [Varian Visual](#varian-visual)
      - [Ukuran](#ukuran)
      - [Loading State](#loading-state)
      - [Perilaku Aksesibilitas](#perilaku-aksesibilitas)
      - [Contoh Penggunaan](#contoh-penggunaan)
    - [4.2 AppBadge](#42-appbadge)
      - [Props](#props-1)
      - [Varian Warna](#varian-warna)
      - [Struktur Visual](#struktur-visual)
      - [Contoh Penggunaan](#contoh-penggunaan-1)
    - [4.3 ProgressBar](#43-progressbar)
      - [Props](#props-2)
      - [Ukuran Bar](#ukuran-bar)
      - [Slot `#label`](#slot-label)
      - [Aksesibilitas](#aksesibilitas)
      - [Transisi](#transisi)
    - [4.4 AppModal](#44-appmodal)
      - [Props](#props-3)
      - [Ukuran Panel](#ukuran-panel)
      - [Events](#events)
      - [Perilaku](#perilaku)
      - [Slot](#slot)
      - [Struktur Visual](#struktur-visual-1)
  - [5. Pola UI Berulang (UI Patterns)](#5-pola-ui-berulang-ui-patterns)
    - [5.1 Summary / Hero Card](#51-summary--hero-card)
    - [5.2 Data Card](#52-data-card)
    - [5.3 Tab Navigation](#53-tab-navigation)
    - [5.4 Inline Form](#54-inline-form)
    - [5.5 Empty State](#55-empty-state)
  - [6. Layout \& Navigasi Global](#6-layout--navigasi-global)
    - [6.1 Page Container](#61-page-container)
    - [6.2 Bottom Navigation Bar](#62-bottom-navigation-bar)
    - [6.3 Toast Notification System](#63-toast-notification-system)
  - [7. Sistem Ikon](#7-sistem-ikon)
    - [Emoji per Konteks](#emoji-per-konteks)
    - [SVG Inline](#svg-inline)
  - [8. Animasi \& Transisi](#8-animasi--transisi)
    - [Transisi Warna](#transisi-warna)
    - [Transisi Progress Bar](#transisi-progress-bar)
    - [Hover Shadow pada Kartu](#hover-shadow-pada-kartu)
    - [Transisi Toast](#transisi-toast)
    - [Tap Highlight Removal](#tap-highlight-removal)
  - [9. Aksesibilitas (a11y)](#9-aksesibilitas-a11y)
  - [10. Utilitas \& Helper Functions](#10-utilitas--helper-functions)
    - [10.1 Currency (`src/utils/currency.ts`)](#101-currency-srcutilscurrencyts)
    - [10.2 Date (`src/utils/date.ts`)](#102-date-srcutilsdatets)
    - [10.3 Konstanta Domain (`src/utils/constants.ts`)](#103-konstanta-domain-srcutilsconstantsts)
  - [11. Panduan Penggunaan Komponen](#11-panduan-penggunaan-komponen)
    - [Kapan Menggunakan Tiap Varian AppButton](#kapan-menggunakan-tiap-varian-appbutton)
    - [Kapan Menggunakan Inline Form vs Modal](#kapan-menggunakan-inline-form-vs-modal)
    - [Kapan Menggunakan Hero Card vs Data Card](#kapan-menggunakan-hero-card-vs-data-card)
    - [Aturan Penulisan Teks](#aturan-penulisan-teks)

---

## 1. Filosofi & Prinsip Desain

Budgetin Wedding dirancang sebagai **Progressive Web App (PWA) mobile-first** untuk digunakan di hari pernikahan maupun persiapannya. Desain mengikuti empat prinsip utama:

### Mobile-First
Semua layout dirancang untuk layar ponsel (320px–430px) terlebih dahulu. Elemen seperti bottom navigation, tab pill, dan kartu full-width mencerminkan prioritas ini. Breakpoint `sm:` hanya digunakan secara selektif untuk grid 2-kolom pada layar yang lebih lebar.

### Clarity over Cleverness
Informasi keuangan harus mudah dibaca sekilas. Hierarki visual yang jelas: nominal besar tampil di ukuran font besar (`text-2xl`/`text-3xl`), label kecil dengan `text-xs`, dan perbedaan warna tegas untuk status (merah = masalah, hijau = aman).

### Emotional Warmth
Aplikasi pernikahan memerlukan nuansa hangat. Gradient ungu-pink digunakan secara konsisten di banner setup dan summary cards utama. Emoji digunakan sebagai ikon untuk menjaga tone yang ringan dan tidak kaku.

### Zero-Latency Feedback
Karena tidak ada backend, semua aksi bersifat sinkron. Namun setiap interaksi tetap memberikan feedback visual: tombol memiliki `transition-colors`, progress bar menggunakan `transition-all duration-500`, dan modal mengunci scroll body.

---

## 2. Fondasi: Token Desain

### 2.1 Palet Warna

Konfigurasi berada di `tailwind.config.js`. Selain palet default Tailwind, terdapat ekstensi kustom:

#### Warna Primary (Ungu)
Digunakan untuk elemen aksi utama, navigasi aktif, dan badge interaktif.

| Token | Hex | Penggunaan |
|---|---|---|
| `primary-50` | `#fdf4ff` | Background subtle |
| `primary-100` | `#fae8ff` | Hover background |
| `primary-200` | `#f3d0fe` | Border accent |
| `primary-300` | `#e9a8fd` | — |
| `primary-400` | `#d946ef` | — |
| `primary-500` | `#c026d3` | — |
| `primary-600` | `#a21caf` | Teks aktif pada latar terang |
| `primary-700` | `#86198f` | Teks aktif tab, navigasi aktif |
| `primary-800` | `#701a75` | — |
| `primary-900` | `#4a044e` | Teks gelap pada latar ungu |

> **Catatan Implementasi:** Dalam praktiknya, komponen lebih sering menggunakan alias Tailwind bawaan `purple-600`, `purple-700` daripada token `primary-*` kustom. Keduanya merujuk nilai yang sama.

#### Warna Fungsional (dari Tailwind default)

| Warna | Kelas Utama | Peran |
|---|---|---|
| Ungu (Purple) | `purple-600`, `purple-700` | Aksi utama, navigasi aktif, tema Pre-Wedding |
| Mawar (Rose) | `rose-500`, `rose-600` | Tema Hari-H, amplop |
| Pink | `pink-500`, `pink-600` | Gradien romantis, summary card |
| Hijau (Green/Emerald) | `green-500`, `emerald-600` | Status aman, tema Post-Wedding |
| Kuning (Yellow/Amber) | `yellow-500`, `amber-600` | Peringatan, status pending |
| Merah (Red) | `red-500`, `red-600` | Error, bahaya, tolak, over budget |
| Biru (Blue/Cyan) | `blue-500`, `cyan-500` | Informasi, tabungan, transfer |
| Ungu Indigo | `indigo-500`, `violet-700` | Kontributor, anniversary review |
| Abu (Gray) | `gray-50` s.d. `gray-900` | Background, teks, border, divider |

#### Warna Background
- **Halaman:** `bg-gray-50` — latar belakang keseluruhan aplikasi
- **Kartu:** `bg-white` — semua kartu dan panel
- **Input / Form:** `bg-gray-50` — container form inline

### 2.2 Tipografi

**Font Family:** `Inter` (Google Fonts) dengan fallback `sans-serif`. Dikonfigurasi via `fontFamily.sans` di `tailwind.config.js`.

#### Skala Ukuran Font

| Kelas Tailwind | Ukuran | Penggunaan |
|---|---|---|
| `text-xs` | 12px | Label, caption, sub-label input, badge |
| `text-sm` | 14px | Body teks, tombol, item daftar, teks form |
| `text-base` | 16px | Tombol ukuran `lg` |
| `text-lg` | 18px | Judul sub-panel, nominal sedang |
| `text-xl` | 20px | Ikon navigasi, nominal penting |
| `text-2xl` | 24px | Judul halaman (`h1`), nominal utama di summary card |
| `text-3xl` | 30px | Nominal sangat besar di hero gradient card |

#### Font Weight

| Kelas | Penggunaan |
|---|---|
| `font-medium` | Label form, tab aktif |
| `font-semibold` | Judul kartu, nama vendor, nama kontributor |
| `font-bold` | Nominal uang, judul halaman `h1` |

### 2.3 Spacing & Sizing

Semua spacing menggunakan skala default Tailwind (1 unit = 4px).

| Konteks | Kelas | Nilai |
|---|---|---|
| Padding halaman | `px-4 py-6` | 16px horizontal, 24px vertikal |
| Padding kartu | `p-4` / `p-5` | 16px / 20px |
| Padding modal | `px-6 py-4` | 24px horizontal, 16px vertikal |
| Gap antar elemen | `space-y-4` / `space-y-6` | 16px / 24px vertikal |
| Gap grid | `gap-3` / `gap-2` | 12px / 8px |
| Padding tombol `sm` | `px-3 py-1.5` | 12px × 6px |
| Padding tombol `md` | `px-4 py-2` | 16px × 8px |
| Padding tombol `lg` | `px-6 py-3` | 24px × 12px |
| Max width konten | `max-w-2xl mx-auto` | 672px, terpusat |
| Bottom padding body | `pb-20` | 80px — ruang untuk bottom nav |

### 2.4 Border Radius

| Kelas | Nilai | Penggunaan |
|---|---|---|
| `rounded-lg` | 8px | Tombol, input form, tag kecil |
| `rounded-xl` | 12px | Kartu data, tab pill, toast, badge |
| `rounded-2xl` | 16px | Modal panel, hero gradient card, summary card |
| `rounded-full` | 9999px | Badge status, indikator titik aktif navigasi, avatar |

### 2.5 Bayangan (Shadow)

| Kelas | Penggunaan |
|---|---|
| `shadow-sm` | Tab aktif dalam pill nav |
| `hover:shadow-md` | Kartu saat di-hover (transisi halus) |
| `shadow-lg` | Toast notification |
| `shadow-xl` | Panel modal |

---

## 3. Sistem Warna Semantik

Sistem warna semantik digunakan secara konsisten di seluruh komponen untuk menyampaikan makna tanpa teks tambahan:

### Status Anggaran (Budget)

| Kondisi | Threshold | Warna | Kelas |
|---|---|---|---|
| Aman | `usagePercentage < 75%` | Hijau | `bg-green-100 text-green-700` / `bg-green-500` |
| Perhatian | `75% ≤ usagePercentage < 90%` | Kuning | `bg-yellow-100 text-yellow-700` / `bg-yellow-500` |
| Bahaya | `usagePercentage ≥ 90%` | Merah | `bg-red-100 text-red-700` / `bg-red-500` |

### Status Vendor

| Status | Nilai | Warna Badge |
|---|---|---|
| Penawaran | `quoted` | Kuning (`warning`) |
| DP Dibayar | `dp-paid` | Biru (`info`) |
| Lunas | `settled` | Hijau (`success`) |
| Dibatalkan | `cancelled` | Merah (`danger`) |

### Status Konfirmasi Kontributor

| Status | Warna Badge |
|---|---|
| Belum dikonfirmasi | Kuning (`warning`) — label "Pending" |
| Sudah dikonfirmasi | Hijau (`success`) — label "Konfirm" |

### Status Pengeluaran Hari-H

| Status | Kondisi |
|---|---|
| Auto-approved | Jumlah < Rp 5.000.000 (konstanta `APPROVAL_THRESHOLD_AMOUNT`) |
| Pending approval | Jumlah ≥ Rp 5.000.000 — tampil badge `warning` "Menunggu" |

### Warna Saldo (Positif / Negatif)

Digunakan di manapun ada nilai sisa anggaran atau net result:
- **Positif / Aman:** `text-green-600`
- **Negatif / Defisit:** `text-red-600`

### Notifikasi Toast

| Tipe | Emoji | Makna |
|---|---|---|
| `success` | ✅ | Operasi berhasil |
| `error` | ❌ | Terjadi kesalahan |
| `warning` | ⚠️ | Perhatian diperlukan |
| `info` | ℹ️ | Informasi umum |

---

## 4. Komponen Umum (Common Components)

Semua komponen umum berada di `src/components/common/`.

### 4.1 AppButton

**File:** `src/components/common/AppButton.vue`

Tombol aksi serbaguna dengan 4 varian visual, 3 ukuran, dan dukungan loading state.

#### Props

| Prop | Tipe | Default | Deskripsi |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | Gaya visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran padding dan font |
| `disabled` | `boolean` | `false` | Nonaktifkan tombol |
| `loading` | `boolean` | `false` | Tampilkan spinner, nonaktifkan klik |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Atribut HTML type |
| `fullWidth` | `boolean` | `false` | Rentangkan ke lebar penuh (`w-full`) |

#### Varian Visual

| Varian | Background | Teks | Hover | Focus Ring |
|---|---|---|---|---|
| `primary` | `bg-purple-600` | `text-white` | `hover:bg-purple-700` | `ring-purple-500` |
| `secondary` | `bg-gray-100` | `text-gray-800` | `hover:bg-gray-200` | `ring-gray-400` |
| `danger` | `bg-red-600` | `text-white` | `hover:bg-red-700` | `ring-red-500` |
| `ghost` | `bg-transparent` | `text-gray-600` | `hover:bg-gray-100` | `ring-gray-400` |

#### Ukuran

| Ukuran | Padding | Font |
|---|---|---|
| `sm` | `px-3 py-1.5` | `text-sm` |
| `md` | `px-4 py-2` | `text-sm` |
| `lg` | `px-6 py-3` | `text-base` |

#### Loading State
Saat `loading = true`, spinner SVG animasi `animate-spin` muncul di kiri konten slot, dan tombol otomatis `disabled`.

#### Perilaku Aksesibilitas
- Atribut `type` selalu dideklarasikan (default `button`) untuk mencegah form submission tidak disengaja.
- State `disabled` menggunakan atribut native HTML + kelas `disabled:opacity-50 disabled:cursor-not-allowed`.
- Focus ring `focus:ring-2 focus:ring-offset-2` tampil pada semua varian saat tombol difokus via keyboard.

#### Contoh Penggunaan
```vue
<AppButton variant="primary" size="md" @click="handleSave">Simpan</AppButton>
<AppButton variant="danger" size="sm" @click="handleDelete">Hapus</AppButton>
<AppButton variant="ghost" full-width :loading="isSubmitting">Proses...</AppButton>
```

---

### 4.2 AppBadge

**File:** `src/components/common/AppBadge.vue`

Label status pill read-only. Tidak memiliki interaksi, hanya menampilkan teks dengan warna semantik.

#### Props

| Prop | Tipe | Default | Deskripsi |
|---|---|---|---|
| `label` | `string` | — *(wajib)* | Teks yang ditampilkan |
| `variant` | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` | Warna semantik |

#### Varian Warna

| Varian | Background | Teks |
|---|---|---|
| `success` | `bg-green-100` | `text-green-800` |
| `warning` | `bg-yellow-100` | `text-yellow-800` |
| `danger` | `bg-red-100` | `text-red-800` |
| `info` | `bg-blue-100` | `text-blue-800` |
| `neutral` | `bg-gray-100` | `text-gray-700` |

#### Struktur Visual
- Shape: `rounded-full` (pill)
- Padding: `px-2.5 py-0.5`
- Font: `text-xs font-medium`

#### Contoh Penggunaan
```vue
<AppBadge variant="success" label="Lunas" />
<AppBadge variant="warning" label="Pending" />
<AppBadge variant="danger" label="Dibatalkan" />
```

---

### 4.3 ProgressBar

**File:** `src/components/common/ProgressBar.vue`

Bar progress linear yang dapat dikonfigurasi ukuran, warna, dan label-nya.

#### Props

| Prop | Tipe | Default | Deskripsi |
|---|---|---|---|
| `value` | `number` | — *(wajib)* | Nilai progres (0–100). Nilai di luar range otomatis di-clamp. |
| `color` | `string` | `'bg-purple-600'` | Kelas Tailwind untuk warna bar |
| `showLabel` | `boolean` | `false` | Tampilkan baris label di atas bar |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tinggi bar |

#### Ukuran Bar

| Ukuran | Tinggi |
|---|---|
| `sm` | `h-1.5` (6px) — digunakan di kartu kategori |
| `md` | `h-2.5` (10px) — digunakan di summary card |
| `lg` | `h-4` (16px) — untuk visualisasi besar |

#### Slot `#label`
Jika `showLabel = true`, slot `#label` dirender di kiri atas bar, dan persentase nilai tampil otomatis di kanan. Contoh:
```vue
<ProgressBar :value="usagePercentage" color="bg-green-500" :show-label="true" size="md">
  <template #label>
    <span class="text-xs text-gray-500">Terpakai {{ formatShort(totalUsed) }}</span>
  </template>
</ProgressBar>
```

#### Aksesibilitas
Bar inner memiliki atribut ARIA: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.

#### Transisi
Bar menggunakan `transition-all duration-500` — animasi halus saat nilai berubah.

---

### 4.4 AppModal

**File:** `src/components/common/AppModal.vue`

Modal dialog dengan backdrop, header, body slot, dan opsional footer slot. Menggunakan Vue `<Teleport>` ke `body` untuk manajemen z-index yang benar.

#### Props

| Prop | Tipe | Default | Deskripsi |
|---|---|---|---|
| `title` | `string` | — *(wajib)* | Judul header modal |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Lebar maksimum panel |

#### Ukuran Panel

| Ukuran | Max Width |
|---|---|
| `sm` | `max-w-sm` (384px) |
| `md` | `max-w-md` (448px) |
| `lg` | `max-w-lg` (512px) |

#### Events

| Event | Kapan dipanggil |
|---|---|
| `close` | Klik backdrop, klik tombol ×, atau tekan tombol `Escape` |

#### Perilaku

- **Backdrop:** `bg-black/50` — semi-transparan. Klik di luar panel memanggil `emit('close')`.
- **Scroll lock:** `document.body.style.overflow = 'hidden'` saat modal mount, dikembalikan saat unmount.
- **Keyboard:** Listener `keydown` untuk `Escape` dipasang saat mount dan dibersihkan saat unmount (`onUnmounted`).
- **Teleport:** Dirender langsung ke `<body>`, melewati hirarki DOM komponen untuk z-index yang benar.

#### Slot

| Slot | Deskripsi |
|---|---|
| `default` | Konten body modal — dipasang di `px-6 py-4` |
| `footer` | Konten footer modal — hanya tampil jika slot diisi. Menggunakan flexbox `justify-end gap-3` |

#### Struktur Visual
```
┌─────────────────────────────────┐
│ [Judul]                      [×]│  ← Header dengan border-b
├─────────────────────────────────┤
│                                 │
│   <slot />                      │  ← Body
│                                 │
├─────────────────────────────────┤
│              [Batal] [Simpan]   │  ← Footer (opsional) dengan border-t
└─────────────────────────────────┘
```

---

## 5. Pola UI Berulang (UI Patterns)

Pola-pola berikut tidak terabstraksi menjadi komponen tersendiri, tetapi diulang secara konsisten di seluruh codebase.

### 5.1 Summary / Hero Card

**Digunakan di:** `ContributorManager`, `SavingsGoalCard`, `AmploCounter`, kartu ringkasan `PreWeddingView`

Kartu besar dengan gradient yang menampilkan angka utama dan sub-statistik.

```
Struktur visual:
┌─────────────────────────────────────┐
│  Label kecil (text-sm opacity-80)   │  ← bg gradient (ungu/rose/cyan/dll)
│  NOMINAL BESAR (text-3xl font-bold) │
│  Stat A       Stat B       Stat C   │  ← text-sm, flex gap-4
└─────────────────────────────────────┘
```

**Kelas umum:** `bg-gradient-to-br from-[color]-500 to-[color]-600 rounded-2xl p-5 text-white`

**Contoh gradien per konteks:**
| Halaman/Komponen | Gradient |
|---|---|
| Setup budget (Pre-Wedding) | `from-purple-600 to-pink-500` |
| Summary kontributor | `from-indigo-500 to-purple-600` |
| Summary tabungan | `from-cyan-500 to-blue-600` |
| Summary amplop (Hari-H) | `from-rose-500 to-pink-600` |
| Dana darurat | `from-green-50 to-emerald-100` (lebih subtle) |
| Estimasi cincin | `from-amber-50 to-yellow-100` (lebih subtle) |

---

### 5.2 Data Card

**Digunakan di:** `PreBudgetCard`, `VendorTracker`, daftar kontributor, daftar cicilan

Kartu putih dengan border tipis, konten informasi, dan interaksi hover.

```
Kelas umum:
bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow
```

**Anatomi umum:**
```
┌──────────────────────────────────────┐
│ [Ikon/Judul]              [Badge]    │  ← Header row
│ ─────────────────────────────────── │  ← divider (opsional)
│ Stat kiri        Stat kanan          │  ← grid-cols-2 gap-2/3
│ ─────────────────────────────────── │
│ [Progress Bar]                       │
│ Sisa: Rp xxx                         │  ← Footer row kecil
└──────────────────────────────────────┘
```

---

### 5.3 Tab Navigation

**Digunakan di:** `PreWeddingView` (4 tab), `WeddingDayView` (3 tab), `PostWeddingView` (5 tab)

Tab pill horizontal dengan latar abu sebagai container dan tab aktif berwarna putih.

```vue
<!-- Pola Tab Container -->
<div class="flex gap-1 bg-gray-100 rounded-xl p-1">
  <button
    :class="['flex-1 text-xs py-2 rounded-lg font-medium transition-colors',
      activeTab === 'X' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600']"
    @click="activeTab = 'X'"
  >
    📊 Label
  </button>
</div>
```

**Aturan warna tab aktif per halaman:**

| Halaman | Warna Teks Tab Aktif |
|---|---|
| Pre-Wedding | `text-purple-700` |
| Hari-H | `text-rose-600` |
| Post-Wedding | `text-emerald-700` |

**Catatan mobile:** Jika tab > 4 item (seperti Post-Wedding dengan 5 tab), container menggunakan `overflow-x-auto` dan tombol menggunakan `flex-shrink-0` agar tidak mengecil.

---

### 5.4 Inline Form

**Digunakan di:** `ContributorManager`, `SavingsGoalCard`, `AmploCounter`, `LoanForecast`, dll.

Form yang tersembunyi secara default dan muncul setelah tombol "Tambah" diklik, tanpa membuka modal.

**Pola toggle visibility:**
```vue
<AppButton @click="showForm = !showForm">➕ Tambah</AppButton>

<div v-if="showForm" class="bg-gray-50 rounded-xl p-4 space-y-3">
  <!-- Field-field form -->
  <div class="flex gap-2">
    <AppButton variant="primary" size="sm" @click="submit">Simpan</AppButton>
    <AppButton variant="ghost" size="sm" @click="showForm = false">Batal</AppButton>
  </div>
</div>
```

**Styling form:**
- Container: `bg-gray-50 rounded-xl p-4 space-y-3`
- Label: `text-xs font-medium text-gray-700`
- Input/Select: `w-full rounded-lg border-gray-300 text-sm` (dari `@tailwindcss/forms`)
- Grup aksi: `flex gap-2` dengan tombol `sm`

**Validasi visual:**
- Tombol submit menggunakan `:disabled` binding secara langsung
- Tidak ada library form validation — guard dilakukan di fungsi JavaScript

---

### 5.5 Empty State

**Digunakan di:** Tab vendor kosong, daftar approval kosong, dll.

```
Pola standar:
┌──────────────────────────────┐
│                              │
│        [Emoji besar]         │  ← text-4xl, mb-2
│    Teks panduan singkat      │  ← text-sm text-gray-400
│                              │
└──────────────────────────────┘
```

```vue
<div class="text-center py-10 text-gray-400">
  <p class="text-4xl mb-2">🤝</p>
  <p class="text-sm">Belum ada data.</p>
</div>
```

---

## 6. Layout & Navigasi Global

### 6.1 Page Container

Setiap halaman (view) menggunakan pola container yang seragam:

```vue
<div class="max-w-2xl mx-auto px-4 py-6 space-y-6">
  <!-- Heading -->
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Nama Halaman 🎊</h1>
    <p class="text-gray-500 text-sm mt-1">Deskripsi singkat halaman</p>
  </div>
  <!-- Konten -->
</div>
```

- **Max width:** `max-w-2xl` (672px) — optimal untuk tablet dan desktop, penuh di mobile
- **Padding:** `px-4 py-6` — 16px kiri-kanan, 24px atas-bawah
- **Spacing antar section:** `space-y-6` (24px)
- **Heading h1:** Selalu `text-2xl font-bold text-gray-900` dengan emoji di akhir
- **Sub-heading:** `text-gray-500 text-sm mt-1`

### 6.2 Bottom Navigation Bar

**File:** `src/App.vue`

Navigasi utama aplikasi berupa bar tetap di bagian bawah layar.

**Spesifikasi:**
- Posisi: `fixed bottom-0 left-0 right-0` dengan `z-index` default
- Background: `bg-white` dengan `border-t border-gray-200`
- Safe area: kelas `safe-bottom` untuk mendukung notch iPhone
- Max width inner: `max-w-2xl mx-auto` — konten nav tidak melebihi lebar konten halaman

**Item navigasi:**
```
[💍 Pre-Wedding]  [🎊 Hari-H]  [🏠 Post-Wedding]
```

**State aktif:**
- Warna teks: `text-purple-700`
- Indikator titik: `w-1 h-1 rounded-full bg-purple-600` muncul di bawah label
- Tidak aktif: `text-gray-400 hover:text-gray-600`

**Body offset:** `<body>` menggunakan `pb-20` (80px) agar konten tidak tertutup navigation bar.

### 6.3 Toast Notification System

**File:** `src/composables/useNotification.ts` + `src/App.vue`

Sistem notifikasi global berbasis singleton ref Pinia-free.

**Posisi:** `fixed top-4 right-4 z-50` — pojok kanan atas, di atas semua elemen

**Struktur kartu toast:**
```
┌───────────────────────────────────────┐
│ [Emoji] Judul Bold           [×]      │
│         Pesan sub (opsional)          │
└───────────────────────────────────────┘
```

**Spesifikasi visual kartu:**
- Lebar: `w-72` (288px)
- Background: `bg-white rounded-xl shadow-lg border border-gray-100 p-4`
- Layout: `flex gap-3` dengan emoji kiri, teks tengah, tombol × kanan

**Animasi:** `TransitionGroup` dengan nama `toast`:
- Enter: slide dari kanan (`translateX(100%)`) + fade in
- Leave: slide ke kanan + fade out
- Durasi: `0.3s ease`

**Auto-dismiss:** Setiap notifikasi otomatis dihapus setelah `duration` ms (default **4000ms**) via `setTimeout`.

**API Composable:**
```typescript
const { success, error, warning, info } = useNotification()

success('Budget tersimpan', 'Total Rp 150 jt berhasil diset')
error('Gagal menyimpan')
warning('Hampir melebihi batas')
info('Data diperbarui')
```

---

## 7. Sistem Ikon

Aplikasi menggunakan **emoji Unicode** sebagai ikon — tidak ada library ikon eksternal (tidak ada Heroicons, FontAwesome, dll.), kecuali beberapa SVG inline minimal.

### Emoji per Konteks

| Emoji | Konteks |
|---|---|
| 💍 | Pre-Wedding, cincin |
| 🎊 | Hari-H, resepsi |
| 🏠 | Post-Wedding, rumah tangga |
| 📊 | Budget, statistik |
| 🤝 | Vendor |
| 👥 | Kontributor |
| 💰 | Tabungan, uang |
| 📩 | Amplop |
| 💸 | Pengeluaran |
| ✅ | Approval, konfirmasi |
| 💑 | Merge keuangan pasangan |
| 📈 | Cicilan, forecast |
| 🎂 | Anniversary review |
| 🛡️ | Dana darurat |
| ✈️ | Honeymoon |
| 💍 | Cincin & emas |
| ⚠️ | Peringatan |
| ❌ | Error, tolak |
| ℹ️ | Informasi |

### SVG Inline

Digunakan hanya untuk ikon yang memerlukan presisi piksel:
- **Ikon + (plus):** Di tombol "Catat Amplop Baru" (`AmploCounter.vue`)
- **Ikon kalender:** Di `VendorTracker.vue` untuk tanggal jatuh tempo
- **Ikon X:** Di tombol tutup `AppModal.vue`
- **Spinner:** Di `AppButton.vue` saat `loading = true`

Semua SVG menggunakan `fill="none" stroke="currentColor"` (outline style) dengan `stroke-width="2"`.

---

## 8. Animasi & Transisi

### Transisi Warna
Semua elemen interaktif menggunakan `transition-colors` untuk hover/fokus yang mulus.

### Transisi Progress Bar
`transition-all duration-500` — animasi lebar bar saat nilai berubah (0.5 detik).

### Hover Shadow pada Kartu
`hover:shadow-md transition-shadow` pada `PreBudgetCard` dan `VendorTracker`.

### Transisi Toast
Didefinisikan di `<style>` global dalam `App.vue`:
```css
.toast-enter-active,
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to   { opacity: 0; transform: translateX(100%); }
```

### Tap Highlight Removal
```css
@layer base {
  * { -webkit-tap-highlight-color: transparent; }
}
```
Menghilangkan highlight biru/abu bawaan browser saat tap di mobile.

---

## 9. Aksesibilitas (a11y)

| Komponen/Pola | Implementasi a11y |
|---|---|
| `ProgressBar` | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| `AppModal` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` untuk judul, close via `Escape` |
| `AppModal` — tombol tutup | `aria-label="Tutup"` |
| `AppButton` — disabled | Atribut HTML native `disabled` + visual `opacity-50 cursor-not-allowed` |
| `AppButton` — fokus | `focus:ring-2 focus:ring-offset-2` pada semua varian |
| Emoji sebagai ikon informasional | Dibungkus `<span role="img">` di `PreBudgetCard` |
| Input form | `@tailwindcss/forms` menyediakan reset style yang aksesibel dan konsisten lintas browser |
| Scroll lock modal | `overflow: hidden` pada body saat modal terbuka, dikembalikan saat unmount |

---

## 10. Utilitas & Helper Functions

### 10.1 Currency (`src/utils/currency.ts`)

| Fungsi | Input | Output | Contoh |
|---|---|---|---|
| `formatRupiah(amount)` | `number` | `string` | `150000` → `"Rp 150.000"` |
| `formatRupiahShort(amount)` | `number` | `string` | `150000000` → `"Rp 150 jt"` |
| `parseRupiah(input)` | `string` | `number` | `"Rp 150.000"` → `150000` |

Diakses melalui composable `useCurrency()`:
```typescript
const { formatRupiah, formatShort } = useCurrency()
// formatShort adalah alias dari formatRupiahShort
```

### 10.2 Date (`src/utils/date.ts`)

| Fungsi | Input | Output | Contoh |
|---|---|---|---|
| `formatDateId(date)` | `Date` | `string` | `"20 April 2026"` |
| `formatDateShort(date)` | `Date` | `string` | `"20/04/2026"` |
| `daysUntil(targetDate)` | `Date` | `number` | Hari tersisa (negatif = sudah lewat) |
| `timeProgressPercentage(start, end)` | `Date, Date` | `number` | Persentase waktu berjalan (0–100) |
| `parseDate(dateString)` | `"YYYY-MM-DD"` | `Date` | Parse aman dengan waktu `T00:00:00` |

### 10.3 Konstanta Domain (`src/utils/constants.ts`)

Semua nilai bisnis di-hardcode dalam konstanta terpusat:

| Konstanta | Tipe | Deskripsi |
|---|---|---|
| `VENDOR_PRICE_RANGES` | `Record<VendorCategory, {min,max}>` | Rentang harga vendor per kategori |
| `DEFAULT_BUDGET_DISTRIBUTION` | `BudgetCategory[]` | Distribusi % default 8 kategori (total 100%) |
| `AMPLOP_ESTIMATES` | `Record<relation, {min,max,label}>` | Estimasi nominal amplop per relasi tamu |
| `HOUSEHOLD_ITEMS` | `Array<{name,min,max,priority}>` | Daftar starter kit rumah tangga |
| `HONEYMOON_DESTINATIONS` | Array | Destinasi honeymoon + estimasi biaya |
| `DEFAULT_MONTHLY_EXPENSES` | Array | Template pengeluaran bulanan default |
| `INSURANCE_RECOMMENDATIONS` | `InsuranceRecommendation[]` | Rekomendasi asuransi (jiwa, kesehatan, kendaraan) |
| `GOLD_PRICE_REFERENCE` | Object | Harga emas referensi per gram 18K/22K/24K |
| `APPROVAL_THRESHOLD_AMOUNT` | `number` | Rp 5.000.000 — batas auto-approve pengeluaran |
| `EMERGENCY_FUND_MONTHS` | `number` | Jumlah bulan target dana darurat |
| `SUPPORTED_CITIES` | Array | Kota yang didukung (Surabaya, Malang, dll.) |
| `VENDOR_STATUS_LABELS` | Record | Label display + warna per status vendor |
| `VENDOR_CATEGORY_LABELS` | Record | Label display per kategori vendor |

---

## 11. Panduan Penggunaan Komponen

### Kapan Menggunakan Tiap Varian AppButton

| Situasi | Varian |
|---|---|
| Aksi utama halaman (Simpan, Mulai, Terapkan) | `primary` |
| Aksi sekunder (Batal, Kembali, Tutup) | `secondary` atau `ghost` |
| Aksi destruktif (Hapus, Tolak) | `danger` |
| Tombol tersembunyi dalam daftar/kartu | `ghost` |

### Kapan Menggunakan Inline Form vs Modal

| Situasi | Gunakan |
|---|---|
| Form pendek (≤ 4 field), dalam konteks halaman | Inline Form (`v-if="showForm"`) |
| Form dengan konfirmasi / pesan penting | `AppModal` |
| Form yang perlu isolasi dari konten lain | `AppModal` |

### Kapan Menggunakan Hero Card vs Data Card

| Situasi | Gunakan |
|---|---|
| Menampilkan total/ringkasan angka paling penting | Hero Card (gradient) |
| Menampilkan item dalam daftar dengan detail | Data Card (putih, border) |

### Aturan Penulisan Teks

| Elemen | Aturan |
|---|---|
| Judul `h1` | Nama halaman + emoji di akhir, `text-2xl font-bold text-gray-900` |
| Sub-heading kartu (`h3`) | `font-semibold text-gray-900 text-sm` |
| Label form | `text-xs font-medium text-gray-700` |
| Teks kecil/caption | `text-xs text-gray-500` |
| Nominal uang utama | Selalu menggunakan `formatRupiah()` atau `formatShort()` — tidak pernah hardcode format |
| Tanggal | Selalu menggunakan `formatDateId()` atau `formatDateShort()` — tidak pernah manual |
