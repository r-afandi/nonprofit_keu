import { Download, FileSpreadsheet, Landmark, WalletCards, ReceiptText } from 'lucide-react'
import { PageHeader } from '@/components/accounting/page-header'
import { SummaryCard } from '@/components/accounting/summary-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cashBankHistory, cashBankReportRows, formatCurrency } from '@/lib/accounting-data'

export default function KasBankLaporanPage() {
  const totalMovement = cashBankHistory.reduce((sum, item) => sum + item.amount, 0)
  const highestBalance = Math.max(...cashBankReportRows.map((item) => item.balance))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kas & Bank"
        title="Laporan Kas/Bank"
        description="Pantau saldo, pergerakan kas, dan mutasi bank untuk memastikan likuiditas tetap terkendali."
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
        <SummaryCard
          title="Total Mutasi"
          value={formatCurrency(totalMovement)}
          subtitle="Akumulasi mutasi bulan berjalan"
          icon={<ReceiptText className="h-5 w-5" />}
          tone="blue"
        />
        <SummaryCard
          title="Saldo Kas/Bank"
          value={formatCurrency(cashBankReportRows.reduce((sum, item) => sum + item.balance, 0))}
          subtitle="Gabungan seluruh rekening aktif"
          icon={<Landmark className="h-5 w-5" />}
          tone="green"
        />
        <SummaryCard
          title="Saldo Tertinggi"
          value={formatCurrency(highestBalance)}
          subtitle="Rekening dengan saldo terbesar"
          icon={<WalletCards className="h-5 w-5" />}
          tone="orange"
        />
        <SummaryCard
          title="Jumlah Rekening"
          value={`${cashBankReportRows.length} rekening`}
          subtitle="Kas dan bank yang dipantau"
          icon={<Landmark className="h-5 w-5" />}
          tone="red"
        />
      </section>

      <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">Saldo Rekening</h2>
            <p className="text-sm text-slate-500">Ringkasan saldo kas dan bank yang sering dipakai untuk mutasi harian.</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Rekening</TableHead>
                  <TableHead>Jumlah Mutasi</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashBankReportRows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium text-slate-900">{row.name}</TableCell>
                    <TableCell>{row.movement} transaksi</TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {formatCurrency(row.balance)}
                    </TableCell>
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
