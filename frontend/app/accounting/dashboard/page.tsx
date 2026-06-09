import { ArrowUpRight, BanknoteArrowDown, BanknoteArrowUp, Files, Wallet } from 'lucide-react'
import { DashboardCharts } from '@/components/accounting/dashboard-charts'
import { PageHeader } from '@/components/accounting/page-header'
import { SummaryCard } from '@/components/accounting/summary-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, incomeHistory, expenseHistory } from '@/lib/accounting-data'

export default function DashboardPage() {
  const totalIncome = incomeHistory.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = expenseHistory.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard Keuangan Nonprofit"
        description="Pantau kesehatan kas, pergerakan pemasukan dan pengeluaran, serta status jurnal AI dalam satu workspace yang ringkas."
        actions={
          <>
            <Button variant="outline" className="border-slate-300 bg-white">Export Ringkasan</Button>
            <Button className="bg-slate-950 text-white hover:bg-slate-800">Buka Pusat Laporan</Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Pemasukan"
          value={formatCurrency(totalIncome)}
          subtitle="Naik 12% dari bulan lalu"
          icon={<BanknoteArrowUp className="h-5 w-5" />}
          tone="blue"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={formatCurrency(totalExpense)}
          subtitle="Masih dalam batas anggaran"
          icon={<BanknoteArrowDown className="h-5 w-5" />}
          tone="orange"
        />
        <SummaryCard
          title="Saldo Bersih"
          value={formatCurrency(totalIncome - totalExpense)}
          subtitle="Kas likuid siap untuk program"
          icon={<Wallet className="h-5 w-5" />}
          tone="green"
        />
        <SummaryCard
          title="Jurnal Perlu Review"
          value="06 item"
          subtitle="Menunggu validasi bendahara"
          icon={<Files className="h-5 w-5" />}
          tone="red"
        />
      </section>

      <DashboardCharts />

      <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Insight</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Alur kerja input ke jurnal dibuat supaya staf non-keuangan tetap nyaman.</h2>
            <p className="text-sm leading-7 text-slate-600">
              Halaman pemasukan dan pengeluaran disusun dengan form naratif di kiri dan preview jurnal editable di kanan.
              Ini membantu tim operasional menjelaskan transaksi dengan bahasa sehari-hari, sementara sistem akuntansi tetap menjaga struktur double-entry di belakang layar.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Input transaksi dengan bahasa natural',
              'Preview jurnal real-time dan seimbang',
              'Riwayat status draft, posted, revised',
              'Laporan siap ekspor PDF atau Excel',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-medium text-slate-700">
                <div className="flex items-start gap-3">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 text-blue-600" />
                  <p>{item}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
