import { CircleDollarSign, Gauge, Goal, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/accounting/page-header'
import { SummaryCard } from '@/components/accounting/summary-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function AnggaranPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Anggaran"
        title="Kontrol Anggaran Program"
        description="Pantau alokasi, serapan, dan ruang belanja per program agar keputusan operasional tetap terkendali."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Anggaran" value="Rp 85.000.000" subtitle="Seluruh program aktif" icon={<CircleDollarSign className="h-5 w-5" />} tone="blue" />
        <SummaryCard title="Terserap" value="Rp 49.300.000" subtitle="58% dari pagu tahunan" icon={<Gauge className="h-5 w-5" />} tone="orange" />
        <SummaryCard title="Sisa Anggaran" value="Rp 35.700.000" subtitle="Masih tersedia untuk program" icon={<Goal className="h-5 w-5" />} tone="green" />
        <SummaryCard title="Program Terkendali" value="04 dari 05" subtitle="Tidak ada over budget kritis" icon={<ShieldCheck className="h-5 w-5" />} tone="red" />
      </section>

      <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">Serapan Per Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {[
            { name: 'Pendidikan Santri', used: 76 },
            { name: 'Pembangunan Masjid', used: 61 },
            { name: 'Bakti Sosial', used: 42 },
            { name: 'Operasional Kantor', used: 68 },
          ].map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{item.name}</span>
                <span className="text-slate-500">{item.used}% terserap</span>
              </div>
              <Progress value={item.used} className="h-3" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

