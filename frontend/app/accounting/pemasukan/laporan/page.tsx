import { BarChart3, Download, FileSpreadsheet, HandCoins, Landmark, ReceiptText } from 'lucide-react'
import { DashboardCharts } from '@/components/accounting/dashboard-charts'
import { PageHeader } from '@/components/accounting/page-header'
import { SummaryCard } from '@/components/accounting/summary-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, incomeHistory } from '@/lib/accounting-data'

export default function LaporanPemasukanPage() {
  const total = incomeHistory.reduce((sum, item) => sum + item.amount, 0)
  const largest = Math.max(...incomeHistory.map((item) => item.amount))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pemasukan"
        title="Laporan Pemasukan"
        description="Dashboard ringkas untuk memonitor performa penerimaan dana, sumber kontribusi, dan detail transaksi siap ekspor."
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
        <SummaryCard title="Total Pemasukan" value={formatCurrency(total)} subtitle="Akumulasi bulan berjalan" icon={<Landmark className="h-5 w-5" />} tone="blue" />
        <SummaryCard title="Pemasukan Bulan Ini" value={formatCurrency(12950000)} subtitle="Target bulan tercapai 78%" icon={<HandCoins className="h-5 w-5" />} tone="green" />
        <SummaryCard title="Pemasukan Terbesar" value={formatCurrency(largest)} subtitle="Donasi terbesar bulan ini" icon={<BarChart3 className="h-5 w-5" />} tone="orange" />
        <SummaryCard title="Jumlah Transaksi" value={`${incomeHistory.length} transaksi`} subtitle="Termasuk draft dan revisi" icon={<ReceiptText className="h-5 w-5" />} tone="red" />
      </section>

      <DashboardCharts />

      <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Detail Laporan Pemasukan</h2>
              <p className="text-sm text-slate-500">Rekap transaksi dengan akun dan nominal untuk kebutuhan verifikasi.</p>
            </div>
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
                {incomeHistory.map((row) => (
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

