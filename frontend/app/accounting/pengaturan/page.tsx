import { BellRing, LockKeyhole, Sparkles, Users } from 'lucide-react'
import { PageHeader } from '@/components/accounting/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengaturan"
        title="Pengaturan Workspace"
        description="Atur preferensi notifikasi, approval, dan bantuan AI agar workflow jurnal sesuai peran tim nonprofit Anda."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {[
          {
            icon: Sparkles,
            title: 'AI Assistance',
            description: 'Aktifkan saran akun otomatis, klasifikasi transaksi, dan rekomendasi jurnal saat input berlangsung.',
            enabled: true,
          },
          {
            icon: LockKeyhole,
            title: 'Approval Posting',
            description: 'Wajibkan persetujuan bendahara sebelum jurnal draft berubah menjadi posted.',
            enabled: true,
          },
          {
            icon: BellRing,
            title: 'Pengingat Review',
            description: 'Kirim pengingat untuk jurnal yang belum seimbang atau menunggu bukti transaksi.',
            enabled: false,
          },
          {
            icon: Users,
            title: 'Akses Kolaborator',
            description: 'Atur hak akses admin program, operator, dan bendahara pada modul pemasukan serta pengeluaran.',
            enabled: true,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold text-slate-900">{item.title}</CardTitle>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Status fitur</p>
                <Switch defaultChecked={item.enabled} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
