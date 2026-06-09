import { PageHeader } from '@/components/accounting/page-header'
import { DashboardCharts } from '@/components/accounting/dashboard-charts'
import { Card, CardContent } from '@/components/ui/card'

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Laporan"
        title="Pusat Laporan Keuangan"
        description="Satu tempat untuk melihat tren pemasukan, pengeluaran, dan insight visual sebelum mengekspor laporan bulanan."
      />
      <DashboardCharts />
      <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
        <CardContent className="p-6 text-sm leading-7 text-slate-600">
          Area ini bisa menjadi landasan untuk pengembangan laporan neraca, arus kas, aktivitas, atau konsolidasi program berikutnya.
          Untuk saat ini, frontend sudah menyiapkan visual hierarchy dan komponen yang konsisten agar mudah diperluas ke modul laporan lain.
        </CardContent>
      </Card>
    </div>
  )
}

