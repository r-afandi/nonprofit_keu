import { HistoryTable } from '@/components/accounting/history-table'
import { PageHeader } from '@/components/accounting/page-header'
import { Button } from '@/components/ui/button'
import { incomeHistory } from '@/lib/accounting-data'

export default function PemasukanRiwayatPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pemasukan"
        title="Riwayat Pemasukan"
        description="Lacak transaksi yang masih draft, sudah posted, atau perlu revisi dengan filter cepat untuk kebutuhan audit internal."
        actions={<Button className="bg-slate-950 text-white hover:bg-slate-800">Tambah Pemasukan</Button>}
      />
      <HistoryTable
        title="Daftar Transaksi Pemasukan"
        description="Tabel ini dirancang ringkas untuk bendahara dan admin program saat memeriksa status jurnal."
        rows={incomeHistory}
      />
    </div>
  )
}

