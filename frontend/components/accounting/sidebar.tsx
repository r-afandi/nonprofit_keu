'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, CalendarRange, Landmark, LayoutDashboard, Menu, PieChart, ScrollText, Settings, TrendingDown, TrendingUp } from 'lucide-react'
import { useAccountingPeriod } from '@/components/accounting/period-provider'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/accounting/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Pemasukan',
    href: '/accounting/pemasukan',
    icon: TrendingUp,
    submenu: [
      { label: 'Input', href: '/accounting/pemasukan' },
      { label: 'Riwayat', href: '/accounting/pemasukan/riwayat' },
      { label: 'Laporan', href: '/accounting/pemasukan/laporan' },
    ],
  },
  {
    label: 'Pengeluaran',
    href: '/accounting/pengeluaran',
    icon: TrendingDown,
    submenu: [
      { label: 'Input', href: '/accounting/pengeluaran' },
      { label: 'Riwayat', href: '/accounting/pengeluaran/riwayat' },
      { label: 'Laporan', href: '/accounting/pengeluaran/laporan' },
    ],
  },
  {
    label: 'Kas & Bank',
    href: '/accounting/kas-bank',
    icon: Landmark,
    submenu: [
      { label: 'Input', href: '/accounting/kas-bank' },
      { label: 'Riwayat', href: '/accounting/kas-bank/riwayat' },
      { label: 'Laporan', href: '/accounting/kas-bank/laporan' },
    ],
  },
  {
    label: 'Jurnal',
    href: '/accounting/jurnal',
    icon: ScrollText,
  },
  {
    label: 'Kategori Akun',
    href: '/accounting/kategori-akun',
    icon: PieChart,
  },
  {
    label: 'Akun',
    href: '/accounting/akun',
    icon: BarChart3,
  },
  {
    label: 'Period',
    href: '/accounting/periode',
    icon: CalendarRange,
  },
  {
    label: 'Anggaran',
    href: '/accounting/anggaran',
    icon: PieChart,
  },
  {
    label: 'Laporan',
    href: '/accounting/laporan',
    icon: BarChart3,
  },
  {
    label: 'Pengaturan',
    href: '/accounting/pengaturan',
    icon: Settings,
  },
]

function SidebarNav() {
  const pathname = usePathname()
  const { periodes, selectedPeriod, selectedPeriodId, setSelectedPeriodId, isLoaded } = useAccountingPeriod()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_34%),linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)]">
      <div className="border-b border-slate-200/80 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Nonprofit Keu</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Accounting Workspace</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">UI akuntansi nonprofit yang ramah pengguna non-akuntan dan siap dikembangkan ke workflow AI.</p>
        <div className="mt-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Periode Aktif</p>
          <Select
            value={selectedPeriodId}
            onValueChange={setSelectedPeriodId}
            disabled={!isLoaded || periodes.length === 0}
          >
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white/90 text-left text-slate-900 shadow-sm">
              <SelectValue placeholder={isLoaded ? 'Pilih periode' : 'Memuat periode...'} />
            </SelectTrigger>
            <SelectContent>
              {periodes.map((periode) => (
                <SelectItem key={periode.id} value={periode.id}>
                  {periode.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPeriod ? (
            <p className="text-xs leading-5 text-slate-500">
              Dipakai saat Anda berpindah menu hingga periode diganti lagi.
            </p>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <div key={item.href} className="space-y-1.5">
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  active
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                    : 'text-slate-600 hover:bg-white hover:text-slate-950',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
              {item.submenu && active ? (
                <div className="space-y-1 pl-4">
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        'block rounded-xl px-4 py-2.5 text-sm transition',
                        pathname === sub.href
                          ? 'bg-blue-50 font-medium text-blue-700'
                          : 'text-slate-500 hover:bg-white hover:text-slate-900',
                      )}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-4">
        <div className="rounded-2xl bg-slate-950 p-4 text-white shadow-xl">
          <p className="text-sm font-medium">AI Journal Assistant</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">Siapkan deskripsi transaksi dengan bahasa sehari-hari, lalu tinjau jurnal hasil AI sebelum posting.</p>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <>
      <aside className="hidden w-[310px] shrink-0 border-r border-slate-200/70 xl:block">
        <SidebarNav />
      </aside>
      <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur xl:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Nonprofit Keu</p>
          <p className="text-sm font-semibold text-slate-900">Accounting Workspace</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[310px] p-0">
            <SidebarNav />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
