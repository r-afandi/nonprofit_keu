import { BadgeDollarSign, Download, FileSpreadsheet, ReceiptText, TrendingDown, WalletCards } from 'lucide-react'
import { DashboardCharts } from '@/components/accounting/dashboard-charts'
import { PageHeader } from '@/components/accounting/page-header'
import { SummaryCard } from '@/components/accounting/summary-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { expenseHistory, formatCurrency } from '@/lib/accounting-data'

export default function LaporanPengeluaranPage() {
  const total = expenseHistory.reduce((sum, item) => sum + item.amount, 0)
  const largest = Math.max(...expenseHistory.map((item) => item.amount))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengeluaran"
        title="Laporan Pengeluaran"
        description="Lihat tekanan biaya, kategori pengeluaran utama, dan daftar transaksi yang mempengaruhi cash flow organisasi."
        actions={
          <>
            <Button variant="outline" className="border-slate-300 bg-white">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Pengeluaran" value={formatCurrency(total)} subtitle="Akumulasi bulan berjalan" icon={<TrendingDown className="h-5 w-5" />} tone="orange" />
        <SummaryCard title="Biaya Bulan Ini" value={formatCurrency(3325000)} subtitle="Terkontrol pada pagu 84%" icon={<WalletCards className="h-5 w-5" />} tone="green" />
        <SummaryCard title="Pengeluaran Terbesar" value={formatCurrency(largest)} subtitle="Item tertinggi bulan ini" icon={<BadgeDollarSign className="h-5 w-5" />} tone="red" />
        <SummaryCard title="Jumlah Transaksi" value={`${expenseHistory.length} transaksi`} subtitle="Termasuk revisi jurnal" icon={<ReceiptText className="h-5 w-5" />} tone="blue" />
      </section>

      <DashboardCharts />

      <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">Detail Laporan Pengeluaran</h2>
            <p className="text-sm text-slate-500">Gunakan tabel ini untuk menelusuri akun biaya dan nominal sebelum finalisasi laporan.</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Akun</TableHead>
                  <TableHead>Nominal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseHistory.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.account}</TableCell>
                    <TableCell className="font-medium text-slate-900">{formatCurrency(row.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

