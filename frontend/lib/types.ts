export interface Periode {
  id: string;
  nama: string;
  mulai: string;
  akhir: string;
  isActive?: boolean;
  isClosed?: boolean;
}

export interface KategoriAkun {
  id: string;
  nama: string;
  deskripsi: string;
}

export interface Akun {
  id: string;
  kode: string;
  kategoriId?: string;
  kategoriNama?: string;
  nama: string;
  deskripsi: string;
  isKasBank: boolean;
  isRestrict: boolean;
  isActive: boolean;
}

export interface JournalEntry {
  id: string;
  akun: string;
  debit: number;
  credit: number;
}

export interface Pemasukan {
  id: string;
  tanggal: string;
  deskripsi: string;
  nominal: number;
  buktiTransaksi?: string;
  status: 'draft' | 'posted' | 'revised';
  journalEntries: JournalEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalDetailItem {
  id: string;
  accountId: string;
  accountName: string;
  debit: string;
  credit: string;
}

export interface Journal {
  id: string;
  periodId: string;
  periodName: string;
  code: string;
  date: string;
  name: string;
  description: string;
  status: 'draft' | 'posted';
  user: string;
  published: boolean;
  details: JournalDetailItem[];
}

export interface Pengeluaran {
  id: string;
  tanggal: string;
  deskripsi: string;
  nominal: number;
  buktiTransaksi?: string;
  status: 'draft' | 'posted' | 'revised';
  journalEntries: JournalEntry[];
  createdAt: string;
  updatedAt: string;
}
