import { Badge } from '@/components/ui/badge'

const statusStyles = {
  Draft: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  Posted: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  Revised: 'bg-rose-100 text-rose-700 hover:bg-rose-100',
} as const

export function StatusBadge({
  status,
}: {
  status: keyof typeof statusStyles
}) {
  return <Badge className={statusStyles[status]}>{status}</Badge>
}

