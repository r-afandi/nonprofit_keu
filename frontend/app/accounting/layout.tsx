import { AccountingPeriodProvider } from '@/components/accounting/period-provider'
import { Sidebar } from '@/components/accounting/sidebar'

export default function AccountingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccountingPeriodProvider>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#f3f6fb_100%)] xl:flex">
        <Sidebar />
        <main className="flex-1">
          <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </AccountingPeriodProvider>
  )
}
