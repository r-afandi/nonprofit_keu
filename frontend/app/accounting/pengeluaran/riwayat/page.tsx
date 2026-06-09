import { HistoryTable } from '@/components/accounting/history-table'
import { PageHeader } from '@/components/accounting/page-header'
import { Button } from '@/components/ui/button'
import { expenseHistory } from '@/lib/accounting-data'

export default function PengeluaranRiwayatPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengeluaran"
        title="Riwayat Pengeluaran"
        description="Tinjau semua pengeluaran yang sudah dicatat, lengkap dengan status jurnal dan aksi cepat untuk kebutuhan review."
        actions={<Button className="bg-slate-950 text-white hover:bg-slate-800">Tambah Pengeluaran</Button>}
      />
      <HistoryTable
        title="Daftar Transaksi Pengeluaran"
        description="Filter dirancang untuk mempercepat pengecekan bukti dan status posting tim keuangan."
        rows={expenseHistory}
      />
    </div>
  )
}

