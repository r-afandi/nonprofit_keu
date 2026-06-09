import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, type TransactionRecord } from '@/lib/accounting-data'
import { StatusBadge } from '@/components/accounting/status-badge'

export function HistoryTable({
  title,
  description,
  rows,
}: {
  title: string
  description: string
  rows: TransactionRecord[]
}) {
  return (
    <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_220px]">
          <Input placeholder="Cari transaksi, akun, atau ID jurnal" className="border-slate-200 bg-white" />
          <Input type="text" placeholder="01/05/2026 - 31/05/2026" className="border-slate-200 bg-white" />
          <Select defaultValue="all">
            <SelectTrigger className="border-slate-200 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="revised">Revised</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-slate-700">{row.date}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{row.description}</p>
                      <p className="text-xs text-slate-500">{row.id} • {row.account}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{formatCurrency(row.amount)}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">Print</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

