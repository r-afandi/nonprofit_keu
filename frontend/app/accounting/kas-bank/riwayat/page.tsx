import { HistoryTable } from '@/components/accounting/history-table'
import { PageHeader } from '@/components/accounting/page-header'
import { Button } from '@/components/ui/button'
import { cashBankHistory } from '@/lib/accounting-data'

export default function KasBankRiwayatPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kas & Bank"
        title="Riwayat Kas/Bank"
        description="Telusuri mutasi kas dan bank untuk memeriksa arus dana, status jurnal, dan kebutuhan audit internal."
        actions={<Button className="bg-slate-950 text-white hover:bg-slate-800">Tambah Mutasi</Button>}
      />
      <HistoryTable
        title="Daftar Mutasi Kas/Bank"
        description="Tabel ini menampilkan perpindahan dana antar rekening dan pencatatan kas operasional."
        rows={cashBankHistory}
      />
    </div>
  )
}
