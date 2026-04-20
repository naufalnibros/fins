// Wedding Template Auto-Generator
// Use Case: Saat user pilih tipe "Pernikahan", otomatis generate semua template data
// Sheet: Vendors & Contracts, Guest Contribution, Pre-Wedding Budget, Post-Wedding Household

import type { TemplateSheet, WeddingTemplateConfig } from '@/types/monthly.types'

// ═══════════════════════════════════════════════════════════════════════════
// 1. VENDORS & CONTRACTS — Detail Kolom Sheet
// ═══════════════════════════════════════════════════════════════════════════
export const VENDORS_SHEET: TemplateSheet = {
  name: 'Vendors & Contracts',
  columns: [
    { key: 'no', label: 'No', type: 'number', width: 40, required: true, description: 'Nomor urut vendor' },
    { key: 'vendorName', label: 'Nama Vendor', type: 'text', width: 180, required: true, description: 'Nama perusahaan/individu vendor' },
    { key: 'category', label: 'Kategori', type: 'text', width: 130, required: true, description: 'Venue, Catering, WO, Fotografer, MUA, Dekorasi, dll' },
    { key: 'contactPerson', label: 'PIC / Kontak', type: 'text', width: 140, required: false, description: 'Nama kontak di vendor' },
    { key: 'phone', label: 'No. HP', type: 'text', width: 130, required: false, description: 'Nomor telepon vendor' },
    { key: 'contractAmount', label: 'Nilai Kontrak', type: 'currency', width: 150, required: true, description: 'Total harga yang disepakati (Rp)' },
    { key: 'dpAmount', label: 'DP Disepakati', type: 'currency', width: 130, required: true, description: 'Jumlah DP yang harus dibayar (Rp)' },
    { key: 'dpPaidAmount', label: 'DP Terbayar', type: 'currency', width: 130, required: false, description: 'Jumlah DP yang sudah dibayar (Rp)' },
    { key: 'sisaPembayaran', label: 'Sisa Pembayaran', type: 'currency', width: 140, required: false, description: '=Nilai Kontrak - DP Terbayar (otomatis)' },
    { key: 'dpDueDate', label: 'Jatuh Tempo DP', type: 'date', width: 120, required: true, description: 'Tanggal batas bayar DP' },
    { key: 'pelunasanDate', label: 'Jatuh Tempo Pelunasan', type: 'date', width: 140, required: true, description: 'Tanggal batas pelunasan' },
    { key: 'status', label: 'Status', type: 'status', width: 100, required: true, description: 'Quoted → DP Paid → Lunas → Cancelled' },
    { key: 'reminderDays', label: 'Reminder (hari)', type: 'number', width: 100, required: false, description: 'H-berapa kirim reminder (default: 7)' },
    { key: 'notes', label: 'Catatan', type: 'text', width: 200, required: false, description: 'Catatan tambahan, syarat khusus, dll' },
  ],
  sampleRows: [
    { no: 1, vendorName: 'Grand Ballroom Ciputra World', category: 'Venue', contactPerson: 'Pak Budi', phone: '08123456789', contractAmount: 75000000, dpAmount: 25000000, dpPaidAmount: 25000000, sisaPembayaran: 50000000, dpDueDate: '2026-01-15', pelunasanDate: '2026-06-01', status: 'DP Paid', reminderDays: 7, notes: 'Include sound system + 50 meja' },
    { no: 2, vendorName: 'Sari Catering Premium', category: 'Catering', contactPerson: 'Ibu Sari', phone: '08198765432', contractAmount: 85000000, dpAmount: 30000000, dpPaidAmount: 0, sisaPembayaran: 85000000, dpDueDate: '2026-02-01', pelunasanDate: '2026-06-10', status: 'Quoted', reminderDays: 7, notes: '500 pax × Rp 170.000, include setup prasmanan' },
    { no: 3, vendorName: 'Luminous Photo & Video', category: 'Dokumentasi', contactPerson: 'Ryan', phone: '08567891234', contractAmount: 25000000, dpAmount: 10000000, dpPaidAmount: 10000000, sisaPembayaran: 15000000, dpDueDate: '2026-01-20', pelunasanDate: '2026-07-01', status: 'DP Paid', reminderDays: 14, notes: '2 fotografer + 1 videografer + drone' },
    { no: 4, vendorName: 'Bloom & Petal Decoration', category: 'Dekorasi', contactPerson: 'Mbak Dian', phone: '08234567890', contractAmount: 35000000, dpAmount: 15000000, dpPaidAmount: 0, sisaPembayaran: 35000000, dpDueDate: '2026-03-01', pelunasanDate: '2026-06-05', status: 'Quoted', reminderDays: 7, notes: 'Tema: Garden Rustic, include gerbang bunga' },
    { no: 5, vendorName: 'Glam by Mira MUA', category: 'MUA', contactPerson: 'Mira', phone: '08345678901', contractAmount: 6000000, dpAmount: 3000000, dpPaidAmount: 3000000, sisaPembayaran: 3000000, dpDueDate: '2026-01-10', pelunasanDate: '2026-06-14', status: 'DP Paid', reminderDays: 7, notes: 'Akad + resepsi, include trial' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. GUEST CONTRIBUTION (AMPLOP) — Detail Kolom Sheet
// ═══════════════════════════════════════════════════════════════════════════
export const GUEST_CONTRIBUTION_SHEET: TemplateSheet = {
  name: 'Guest Contribution',
  columns: [
    { key: 'no', label: 'No', type: 'number', width: 40, required: true, description: 'Nomor urut' },
    { key: 'guestName', label: 'Nama Tamu', type: 'text', width: 180, required: true, description: 'Nama pemberi amplop/transfer' },
    { key: 'relation', label: 'Relasi', type: 'text', width: 130, required: true, description: 'Keluarga Dekat, Teman Kantor, Kenalan Ortu, Teman Dekat, Lainnya' },
    { key: 'fromSide', label: 'Pihak', type: 'text', width: 100, required: false, description: 'Mempelai Pria / Mempelai Wanita' },
    { key: 'amount', label: 'Jumlah (Rp)', type: 'currency', width: 140, required: true, description: 'Nominal amplop/transfer' },
    { key: 'method', label: 'Metode', type: 'text', width: 100, required: true, description: 'Amplop Fisik / Transfer Bank / E-Wallet' },
    { key: 'bankRef', label: 'Ref. Transfer', type: 'text', width: 120, required: false, description: 'Nomor referensi transfer jika via bank' },
    { key: 'recordedAt', label: 'Waktu Input', type: 'date', width: 140, required: false, description: 'Timestamp pencatatan (otomatis)' },
    { key: 'recordedBy', label: 'Dicatat Oleh', type: 'text', width: 120, required: false, description: 'Siapa yang input data' },
    { key: 'notes', label: 'Catatan', type: 'text', width: 180, required: false, description: 'Ucapan, kartu, dll' },
  ],
  sampleRows: [
    { no: 1, guestName: 'Pak Heru & Bu Heru', relation: 'Keluarga Dekat', fromSide: 'Mempelai Pria', amount: 1000000, method: 'Amplop Fisik', bankRef: '', recordedAt: '2026-06-15 11:30', recordedBy: 'Adik Naufal', notes: 'Kartu ucapan + amplop gold' },
    { no: 2, guestName: 'Tim Marketing PT ABC', relation: 'Teman Kantor', fromSide: 'Mempelai Pria', amount: 500000, method: 'Transfer Bank', bankRef: 'BCA-20260615-001', recordedAt: '2026-06-14 09:00', recordedBy: 'Auto', notes: 'Transfer H-1' },
    { no: 3, guestName: 'Tante Sri + Om Joko', relation: 'Kenalan Ortu', fromSide: 'Mempelai Wanita', amount: 2000000, method: 'Amplop Fisik', bankRef: '', recordedAt: '2026-06-15 12:45', recordedBy: 'Kakak Bride', notes: '' },
    { no: 4, guestName: 'Rina & Dimas', relation: 'Teman Dekat', fromSide: 'Mempelai Wanita', amount: 300000, method: 'E-Wallet', bankRef: 'GoPay-xxx', recordedAt: '2026-06-15 13:00', recordedBy: 'Auto', notes: 'Via QR di meja registrasi' },
    { no: 5, guestName: 'Bapak Lurah + Ibu', relation: 'Kenalan Ortu', fromSide: 'Mempelai Pria', amount: 1500000, method: 'Amplop Fisik', bankRef: '', recordedAt: '2026-06-15 14:00', recordedBy: 'Adik Naufal', notes: '' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. HOUSEHOLD STARTER KIT — Detail Kolom Sheet
// ═══════════════════════════════════════════════════════════════════════════
export const HOUSEHOLD_SHEET: TemplateSheet = {
  name: 'Household Starter Kit',
  columns: [
    { key: 'no', label: 'No', type: 'number', width: 40, required: true, description: 'Nomor urut' },
    { key: 'itemName', label: 'Nama Barang', type: 'text', width: 180, required: true, description: 'Nama peralatan rumah tangga' },
    { key: 'category', label: 'Kategori', type: 'text', width: 120, required: true, description: 'Elektronik, Furniture, Dapur, Kamar Mandi, dll' },
    { key: 'priority', label: 'Prioritas', type: 'number', width: 70, required: true, description: '1 = paling penting, 8 = bisa ditunda' },
    { key: 'estimateMin', label: 'Estimasi Min (Rp)', type: 'currency', width: 140, required: true, description: 'Harga minimum estimasi' },
    { key: 'estimateMax', label: 'Estimasi Max (Rp)', type: 'currency', width: 140, required: true, description: 'Harga maksimum estimasi' },
    { key: 'actualPrice', label: 'Harga Beli (Rp)', type: 'currency', width: 140, required: false, description: 'Harga aktual saat beli' },
    { key: 'storeName', label: 'Toko / Marketplace', type: 'text', width: 140, required: false, description: 'Di mana beli' },
    { key: 'status', label: 'Status', type: 'status', width: 100, required: true, description: 'Belum Beli → Direncanakan → Sudah Beli' },
    { key: 'purchaseDate', label: 'Tanggal Beli', type: 'date', width: 120, required: false, description: 'Tanggal pembelian' },
    { key: 'warranty', label: 'Garansi s.d.', type: 'date', width: 100, required: false, description: 'Tanggal berakhirnya garansi' },
    { key: 'notes', label: 'Catatan', type: 'text', width: 180, required: false, description: 'Spesifikasi, warna, model, dll' },
  ],
  sampleRows: [
    { no: 1, itemName: 'Kasur Spring Bed 160×200 + Divan', category: 'Furniture', priority: 1, estimateMin: 4000000, estimateMax: 8000000, actualPrice: 0, storeName: '', status: 'Belum Beli', purchaseDate: '', warranty: '', notes: 'Cari diskon 6.6 / 7.7' },
    { no: 2, itemName: 'Kulkas 2 Pintu Samsung/LG', category: 'Elektronik', priority: 2, estimateMin: 3000000, estimateMax: 6000000, actualPrice: 0, storeName: '', status: 'Belum Beli', purchaseDate: '', warranty: '', notes: 'No Frost, min 250L' },
    { no: 3, itemName: 'Mesin Cuci Front Load 8kg', category: 'Elektronik', priority: 3, estimateMin: 2000000, estimateMax: 4000000, actualPrice: 0, storeName: '', status: 'Belum Beli', purchaseDate: '', warranty: '', notes: 'Hemat air + listrik' },
    { no: 4, itemName: 'AC 1 PK Inverter', category: 'Elektronik', priority: 4, estimateMin: 3000000, estimateMax: 5000000, actualPrice: 0, storeName: '', status: 'Direncanakan', purchaseDate: '', warranty: '', notes: 'Daikin/Panasonic, include pasang' },
    { no: 5, itemName: 'Kompor Tanam 2 Tungku + Gas 12kg', category: 'Dapur', priority: 5, estimateMin: 500000, estimateMax: 2000000, actualPrice: 0, storeName: '', status: 'Belum Beli', purchaseDate: '', warranty: '', notes: '' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. PRE-WEDDING BUDGET — Detail Kolom Sheet
// ═══════════════════════════════════════════════════════════════════════════
export const PRE_WEDDING_BUDGET_SHEET: TemplateSheet = {
  name: 'Pre-Wedding Budget',
  columns: [
    { key: 'no', label: 'No', type: 'number', width: 40, required: true, description: 'Nomor urut' },
    { key: 'category', label: 'Kategori', type: 'text', width: 150, required: true, description: 'Catering, Venue, WO, Dekorasi, dll' },
    { key: 'percentage', label: 'Alokasi (%)', type: 'percentage', width: 90, required: true, description: 'Persentase dari total budget' },
    { key: 'allocatedAmount', label: 'Alokasi (Rp)', type: 'currency', width: 140, required: false, description: '=Total Budget × Persentase (otomatis)' },
    { key: 'usedAmount', label: 'Terpakai (Rp)', type: 'currency', width: 140, required: false, description: 'Jumlah yang sudah dikeluarkan' },
    { key: 'remainingAmount', label: 'Sisa (Rp)', type: 'currency', width: 140, required: false, description: '=Alokasi - Terpakai (otomatis)' },
    { key: 'progress', label: 'Progress (%)', type: 'percentage', width: 90, required: false, description: '=Terpakai/Alokasi × 100 (otomatis)' },
    { key: 'status', label: 'Status', type: 'status', width: 100, required: false, description: 'Aman / Waspada / Over Budget' },
    { key: 'notes', label: 'Catatan', type: 'text', width: 200, required: false, description: 'Detail item dalam kategori' },
  ],
  sampleRows: [
    { no: 1, category: 'Catering', percentage: 35, allocatedAmount: 52500000, usedAmount: 0, remainingAmount: 52500000, progress: 0, status: 'Aman', notes: '500 pax' },
    { no: 2, category: 'Gedung / Venue', percentage: 25, allocatedAmount: 37500000, usedAmount: 25000000, remainingAmount: 12500000, progress: 67, status: 'Waspada', notes: 'Grand Ballroom, DP sudah bayar' },
    { no: 3, category: 'Wedding Organizer', percentage: 10, allocatedAmount: 15000000, usedAmount: 0, remainingAmount: 15000000, progress: 0, status: 'Aman', notes: 'Belum pilih WO' },
    { no: 4, category: 'Dekorasi', percentage: 9, allocatedAmount: 13500000, usedAmount: 0, remainingAmount: 13500000, progress: 0, status: 'Aman', notes: 'Tema: Garden Rustic' },
    { no: 5, category: 'Dokumentasi (Foto+Video)', percentage: 8, allocatedAmount: 12000000, usedAmount: 10000000, remainingAmount: 2000000, progress: 83, status: 'Waspada', notes: 'Luminous, DP sudah' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// ALL SHEETS — Export gabungan
// ═══════════════════════════════════════════════════════════════════════════
export const ALL_TEMPLATE_SHEETS: TemplateSheet[] = [
  VENDORS_SHEET,
  GUEST_CONTRIBUTION_SHEET,
  PRE_WEDDING_BUDGET_SHEET,
  HOUSEHOLD_SHEET,
]

/**
 * Generate contoh Google Apps Script untuk import template pernikahan
 * secara otomatis ke Google Sheets.
 */
export function generateAppsScriptCode(config: WeddingTemplateConfig): string {
  return `
/**
 * Budgetin Wedding — Auto Template Generator
 * Jalankan fungsi setupWeddingBudget() di Apps Script Editor
 * untuk membuat semua sheet template secara otomatis.
 *
 * Config:
 *   Couple: ${config.coupleName}
 *   Tanggal: ${config.weddingDate}
 *   Kota: ${config.city}
 *   Total Budget: Rp ${config.totalBudget.toLocaleString('id-ID')}
 *   Jumlah Tamu: ${config.guestCount}
 */

function setupWeddingBudget() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const CONFIG = {
    coupleName: "${config.coupleName}",
    weddingDate: "${config.weddingDate}",
    city: "${config.city}",
    totalBudget: ${config.totalBudget},
    guestCount: ${config.guestCount},
    includeHoneymoon: ${config.includeHoneymoon},
  };

  // 1. Buat sheet Vendors & Contracts
  createVendorsSheet_(ss, CONFIG);

  // 2. Buat sheet Guest Contribution
  createGuestContributionSheet_(ss, CONFIG);

  // 3. Buat sheet Pre-Wedding Budget
  createPreWeddingBudgetSheet_(ss, CONFIG);

  // 4. Buat sheet Post-Wedding Household
  createHouseholdSheet_(ss, CONFIG);

  // 5. Buat Dashboard summary
  createDashboardSheet_(ss, CONFIG);

  SpreadsheetApp.getUi().alert(
    'Template Pernikahan berhasil dibuat! 🎉\\n' +
    'Couple: ' + CONFIG.coupleName + '\\n' +
    'Total Budget: Rp ' + CONFIG.totalBudget.toLocaleString('id-ID')
  );
}

function createVendorsSheet_(ss, config) {
  let sheet = ss.getSheetByName('Vendors & Contracts');
  if (!sheet) sheet = ss.insertSheet('Vendors & Contracts');
  else sheet.clear();

  // Header
  const headers = [
    'No', 'Nama Vendor', 'Kategori', 'PIC/Kontak', 'No HP',
    'Nilai Kontrak', 'DP Disepakati', 'DP Terbayar', 'Sisa Pembayaran',
    'Jatuh Tempo DP', 'Jatuh Tempo Pelunasan', 'Status', 'Reminder (hari)', 'Catatan'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#6d28d9').setFontColor('#ffffff');

  // Sample data (3 baris contoh harga Jawa Timur 2026)
  const sampleData = [
    [1, 'Grand Ballroom Ciputra World', 'Venue', 'Pak Budi', '08123456789',
     75000000, 25000000, 25000000, '=F2-H2', '2026-01-15', '2026-06-01', 'DP Paid', 7, 'Include sound system'],
    [2, 'Sari Catering Premium', 'Catering', 'Ibu Sari', '08198765432',
     config.guestCount * 170000, config.guestCount * 170000 * 0.35, 0, '=F3-H3',
     '2026-02-01', '2026-06-10', 'Quoted', 7, config.guestCount + ' pax × Rp170.000'],
    [3, 'Luminous Photo & Video', 'Dokumentasi', 'Ryan', '08567891234',
     25000000, 10000000, 10000000, '=F4-H4', '2026-01-20', '2026-07-01', 'DP Paid', 14, '2 foto + 1 video + drone'],
  ];
  if (sampleData.length > 0) {
    sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  }

  // Format currency
  sheet.getRange('F:I').setNumberFormat('Rp #,##0');

  // Conditional formatting status
  const statusRange = sheet.getRange('L2:L100');
  const rules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Lunas').setBackground('#d1fae5').setFontColor('#065f46').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('DP Paid').setBackground('#dbeafe').setFontColor('#1e40af').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Quoted').setBackground('#fef3c7').setFontColor('#92400e').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Cancelled').setBackground('#fee2e2').setFontColor('#991b1b').setRanges([statusRange]).build(),
  ];
  sheet.setConditionalFormatRules(rules);

  // Auto-resize
  sheet.autoResizeColumns(1, headers.length);
}

function createGuestContributionSheet_(ss, config) {
  let sheet = ss.getSheetByName('Guest Contribution');
  if (!sheet) sheet = ss.insertSheet('Guest Contribution');
  else sheet.clear();

  const headers = [
    'No', 'Nama Tamu', 'Relasi', 'Pihak', 'Jumlah (Rp)',
    'Metode', 'Ref Transfer', 'Waktu Input', 'Dicatat Oleh', 'Catatan'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#be185d').setFontColor('#ffffff');

  const sampleData = [
    [1, 'Pak Heru & Bu Heru', 'Keluarga Dekat', 'Mempelai Pria', 1000000, 'Amplop Fisik', '', '', 'Adik', 'Amplop gold'],
    [2, 'Tim Marketing PT ABC', 'Teman Kantor', 'Mempelai Pria', 500000, 'Transfer Bank', 'BCA-xxx', '', 'Auto', ''],
    [3, 'Tante Sri + Om Joko', 'Kenalan Ortu', 'Mempelai Wanita', 2000000, 'Amplop Fisik', '', '', 'Kakak', ''],
  ];
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  sheet.getRange('E:E').setNumberFormat('Rp #,##0');

  // Summary row di bawah
  const lastRow = sampleData.length + 2;
  sheet.getRange(lastRow, 4).setValue('TOTAL:').setFontWeight('bold');
  sheet.getRange(lastRow, 5).setFormula('=SUM(E2:E' + (sampleData.length + 1) + ')').setFontWeight('bold');

  sheet.autoResizeColumns(1, headers.length);
}

function createPreWeddingBudgetSheet_(ss, config) {
  let sheet = ss.getSheetByName('Pre-Wedding Budget');
  if (!sheet) sheet = ss.insertSheet('Pre-Wedding Budget');
  else sheet.clear();

  const headers = [
    'No', 'Kategori', 'Alokasi (%)', 'Alokasi (Rp)',
    'Terpakai (Rp)', 'Sisa (Rp)', 'Progress (%)', 'Status', 'Catatan'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#7c3aed').setFontColor('#ffffff');

  // Total budget di cell terpisah
  sheet.getRange('K1').setValue('Total Budget:');
  sheet.getRange('L1').setValue(config.totalBudget).setNumberFormat('Rp #,##0').setFontWeight('bold');

  const categories = [
    [1, 'Catering', 35], [2, 'Gedung / Venue', 25], [3, 'Wedding Organizer', 10],
    [4, 'Dekorasi', 9], [5, 'Dokumentasi', 8], [6, 'Gaun & MUA', 6],
    [7, 'Undangan & Souvenir', 4], [8, 'Lain-lain (Buffer)', 3],
  ];

  const data = categories.map(([no, cat, pct]) => [
    no, cat, pct / 100,
    '=$L$1*C' + (Number(no) + 1),      // Alokasi Rp
    0,                                   // Terpakai
    '=D' + (Number(no) + 1) + '-E' + (Number(no) + 1),  // Sisa
    '=IF(D' + (Number(no) + 1) + '>0,E' + (Number(no) + 1) + '/D' + (Number(no) + 1) + ',0)',  // Progress
    '=IF(G' + (Number(no) + 1) + '>=0.9,"Over Budget",IF(G' + (Number(no) + 1) + '>=0.75,"Waspada","Aman"))',
    '',
  ]);
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  sheet.getRange('C2:C9').setNumberFormat('0%');
  sheet.getRange('D:F').setNumberFormat('Rp #,##0');
  sheet.getRange('G2:G9').setNumberFormat('0%');

  sheet.autoResizeColumns(1, headers.length);
}

function createHouseholdSheet_(ss, config) {
  let sheet = ss.getSheetByName('Household Starter Kit');
  if (!sheet) sheet = ss.insertSheet('Household Starter Kit');
  else sheet.clear();

  const headers = [
    'No', 'Nama Barang', 'Kategori', 'Prioritas',
    'Estimasi Min (Rp)', 'Estimasi Max (Rp)', 'Harga Beli (Rp)',
    'Toko', 'Status', 'Tanggal Beli', 'Garansi s.d.', 'Catatan'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#059669').setFontColor('#ffffff');

  const items = [
    [1, 'Kasur Spring Bed 160×200', 'Furniture', 1, 4000000, 8000000, '', '', 'Belum Beli', '', '', 'Cari diskon'],
    [2, 'Kulkas 2 Pintu Samsung/LG', 'Elektronik', 2, 3000000, 6000000, '', '', 'Belum Beli', '', '', 'No Frost, min 250L'],
    [3, 'Mesin Cuci Front Load 8kg', 'Elektronik', 3, 2000000, 4000000, '', '', 'Belum Beli', '', '', 'Hemat listrik'],
    [4, 'AC 1 PK Inverter', 'Elektronik', 4, 3000000, 5000000, '', '', 'Belum Beli', '', '', 'Include pasang'],
    [5, 'Kompor Tanam + Gas 12kg', 'Dapur', 5, 500000, 2000000, '', '', 'Belum Beli', '', '', ''],
    [6, 'Sofa + Meja Tamu', 'Furniture', 6, 2000000, 5000000, '', '', 'Belum Beli', '', '', ''],
    [7, 'Lemari Pakaian 3 Pintu', 'Furniture', 7, 1500000, 4000000, '', '', 'Belum Beli', '', '', ''],
    [8, 'TV LED 43" + Bracket', 'Elektronik', 8, 2000000, 6000000, '', '', 'Belum Beli', '', '', ''],
  ];
  sheet.getRange(2, 1, items.length, headers.length).setValues(items);
  sheet.getRange('E:G').setNumberFormat('Rp #,##0');

  sheet.autoResizeColumns(1, headers.length);
}

function createDashboardSheet_(ss, config) {
  let sheet = ss.getSheetByName('Dashboard');
  if (!sheet) sheet = ss.insertSheet('Dashboard', 0);
  else sheet.clear();

  sheet.getRange('A1').setValue('💍 Budgetin Wedding Dashboard').setFontSize(16).setFontWeight('bold');
  sheet.getRange('A2').setValue('Couple: ' + config.coupleName);
  sheet.getRange('A3').setValue('Tanggal: ' + config.weddingDate);
  sheet.getRange('A4').setValue('Kota: ' + config.city);
  sheet.getRange('A5').setValue('Tamu: ' + config.guestCount + ' undangan');

  sheet.getRange('A7').setValue('📊 Ringkasan Budget').setFontWeight('bold');
  sheet.getRange('A8').setValue('Total Budget:');
  sheet.getRange('B8').setValue(config.totalBudget).setNumberFormat('Rp #,##0');
  sheet.getRange('A9').setValue('Total Vendor:');
  sheet.getRange('B9').setFormula("=COUNTA('Vendors & Contracts'!B2:B100)");
  sheet.getRange('A10').setValue('Total Amplop:');
  sheet.getRange('B10').setFormula("=SUM('Guest Contribution'!E2:E1000)").setNumberFormat('Rp #,##0');

  sheet.autoResizeColumns(1, 2);
}

// ─── Trigger: Kirim reminder email H-7 sebelum jatuh tempo ────────────────
function setupReminders() {
  // Hapus trigger lama
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => { if (t.getHandlerFunction() === 'checkVendorDueDates') ScriptApp.deleteTrigger(t); });

  // Buat trigger harian
  ScriptApp.newTrigger('checkVendorDueDates')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
}

function checkVendorDueDates() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Vendors & Contracts');
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const today = new Date();
  const alerts = [];

  for (let i = 1; i < data.length; i++) {
    const vendorName = data[i][1];
    const dueDate = new Date(data[i][9]); // kolom J = Jatuh Tempo DP
    const reminderDays = data[i][12] || 7;
    const status = data[i][11];

    if (status === 'Lunas' || status === 'Cancelled') continue;

    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= reminderDays && daysLeft >= 0) {
      alerts.push(vendorName + ': Jatuh tempo ' + Utilities.formatDate(dueDate, 'Asia/Jakarta', 'dd MMM yyyy') + ' (' + daysLeft + ' hari lagi)');
    }
  }

  if (alerts.length > 0) {
    const email = Session.getActiveUser().getEmail();
    MailApp.sendEmail({
      to: email,
      subject: '⚠️ Reminder Pembayaran Vendor Pernikahan',
      body: 'Vendor yang mendekati jatuh tempo:\\n\\n' + alerts.join('\\n'),
    });
  }
}
`.trim()
}

/**
 * Generate semua template sheet sebagai JSON untuk preview di aplikasi
 */
export function generateWeddingTemplate(config: WeddingTemplateConfig): {
  sheets: TemplateSheet[]
  appsScript: string
  summary: { totalSheets: number; totalColumns: number; totalSampleRows: number }
} {
  const sheets = ALL_TEMPLATE_SHEETS
  const appsScript = generateAppsScriptCode(config)

  return {
    sheets,
    appsScript,
    summary: {
      totalSheets: sheets.length,
      totalColumns: sheets.reduce((a, s) => a + s.columns.length, 0),
      totalSampleRows: sheets.reduce((a, s) => a + s.sampleRows.length, 0),
    },
  }
}
