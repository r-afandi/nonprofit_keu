export type JournalRow = {
  id: string
  account: string
  debit: number
  credit: number
}

export type GeneratedJournalPreview = {
  date: string
  description: string
  actorName?: string
  budgetType: string
  amount: number
  prompt: string
  proofFileName?: string
  rows: JournalRow[]
}

export type TransactionRecord = {
  id: string
  date: string
  description: string
  amount: number
  status: 'Draft' | 'Posted' | 'Revised'
  account: string
}

export const accountOptions = [
  'Kas Operasional',
  'Bank BCA',
  'Dana Donasi',
  'Pendapatan Program',
  'Beban Listrik',
  'Beban Konsumsi',
  'Beban Operasional',
  'Piutang Donatur',
  'Dana Terikat',
]

export const pemasukanJournalTemplate: JournalRow[] = [
  { id: 'inc-1', account: 'Bank BCA', debit: 5000000, credit: 0 },
  { id: 'inc-2', account: 'Dana Donasi', debit: 0, credit: 5000000 },
]

export const pengeluaranJournalTemplate: JournalRow[] = [
  { id: 'exp-1', account: 'Beban Listrik', debit: 700000, credit: 0 },
  { id: 'exp-2', account: 'Bank BCA', debit: 0, credit: 700000 },
]

export const incomeHistory: TransactionRecord[] = [
  {
    id: 'TRX-001',
    date: '2026-05-24',
    description: 'Dana pembangunan masjid dari Pak Ahmad via transfer BCA',
    amount: 5000000,
    status: 'Posted',
    account: 'Dana Donasi',
  },
  {
    id: 'TRX-002',
    date: '2026-05-22',
    description: 'Donasi Jumat untuk program pendidikan santri',
    amount: 3250000,
    status: 'Draft',
    account: 'Pendapatan Program',
  },
  {
    id: 'TRX-003',
    date: '2026-05-19',
    description: 'Pelunasan janji donasi komunitas alumni',
    amount: 8500000,
    status: 'Revised',
    account: 'Piutang Donatur',
  },
  {
    id: 'TRX-004',
    date: '2026-05-14',
    description: 'Dana operasional kegiatan bakti sosial',
    amount: 2150000,
    status: 'Posted',
    account: 'Dana Terikat',
  },
]

export const expenseHistory: TransactionRecord[] = [
  {
    id: 'OUT-001',
    date: '2026-05-23',
    description: 'Bayar listrik kantor bulan Mei dari Bank BCA',
    amount: 700000,
    status: 'Posted',
    account: 'Beban Listrik',
  },
  {
    id: 'OUT-002',
    date: '2026-05-21',
    description: 'Pembelian alat tulis dan keperluan admin',
    amount: 450000,
    status: 'Draft',
    account: 'Beban Operasional',
  },
  {
    id: 'OUT-003',
    date: '2026-05-18',
    description: 'Konsumsi rapat evaluasi program bulanan',
    amount: 975000,
    status: 'Revised',
    account: 'Beban Konsumsi',
  },
  {
    id: 'OUT-004',
    date: '2026-05-11',
    description: 'Transport relawan untuk distribusi bantuan',
    amount: 1200000,
    status: 'Posted',
    account: 'Beban Operasional',
  },
]

export const cashBankHistory: TransactionRecord[] = [
  {
    id: 'CB-001',
    date: '2026-05-25',
    description: 'Setor tunai dari kegiatan Jumat Berkah ke Bank BCA',
    amount: 2500000,
    status: 'Posted',
    account: 'Bank BCA',
  },
  {
    id: 'CB-002',
    date: '2026-05-24',
    description: 'Penarikan dana operasional dari kas umum',
    amount: 1200000,
    status: 'Draft',
    account: 'Kas Operasional',
  },
  {
    id: 'CB-003',
    date: '2026-05-22',
    description: 'Transfer antar rekening untuk pengadaan program',
    amount: 3750000,
    status: 'Posted',
    account: 'Bank BRI',
  },
  {
    id: 'CB-004',
    date: '2026-05-20',
    description: 'Setoran donasi tunai dari relawan lapangan',
    amount: 1850000,
    status: 'Revised',
    account: 'Kas Operasional',
  },
]

export const cashBankReportRows = [
  { name: 'Kas Operasional', balance: 8425000, movement: 4 },
  { name: 'Bank BCA', balance: 18500000, movement: 7 },
  { name: 'Bank BRI', balance: 11325000, movement: 3 },
]

export const monthlyIncomeData = [
  { month: 'Jan', total: 12000000 },
  { month: 'Feb', total: 16500000 },
  { month: 'Mar', total: 14800000 },
  { month: 'Apr', total: 19600000 },
  { month: 'Mei', total: 24300000 },
]

export const monthlyExpenseData = [
  { month: 'Jan', total: 6200000 },
  { month: 'Feb', total: 7400000 },
  { month: 'Mar', total: 6850000 },
  { month: 'Apr', total: 8200000 },
  { month: 'Mei', total: 9100000 },
]

export const incomeCategoryData = [
  { name: 'Donasi', value: 58, fill: '#2563eb' },
  { name: 'Program', value: 24, fill: '#0f766e' },
  { name: 'Kemitraan', value: 18, fill: '#f59e0b' },
]

export const expenseCategoryData = [
  { name: 'Operasional', value: 46, fill: '#ea580c' },
  { name: 'Utilitas', value: 27, fill: '#dc2626' },
  { name: 'Program', value: 27, fill: '#2563eb' },
]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}
