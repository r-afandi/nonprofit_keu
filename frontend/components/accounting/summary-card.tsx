import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SummaryCardProps = {
  title: string
  value: string
  subtitle: string
  icon: ReactNode
  tone?: 'blue' | 'green' | 'orange' | 'red'
}

const tones = {
  blue: 'from-blue-500/15 via-blue-500/10 to-transparent text-blue-700',
  green: 'from-emerald-500/15 via-emerald-500/10 to-transparent text-emerald-700',
  orange: 'from-amber-500/20 via-amber-500/10 to-transparent text-amber-700',
  red: 'from-rose-500/15 via-rose-500/10 to-transparent text-rose-700',
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'blue',
}: SummaryCardProps) {
  return (
    <Card className="overflow-hidden border-white/60 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur">
      <CardContent className="relative p-5">
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-24 bg-gradient-to-br',
            tones[tone].split(' ').slice(0, 3).join(' '),
          )}
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
          <div className={cn('rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm', tones[tone].split(' ')[3])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

