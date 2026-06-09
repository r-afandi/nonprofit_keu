'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useJournal } from '@/hooks/use-journal'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function JurnalPage() {
  const { journals, isLoaded } = useJournal()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredJournals = useMemo(() => {
    if (!searchQuery) return journals
    const query = searchQuery.toLowerCase()
    return journals.filter(
      (journal) =>
        journal.code.toLowerCase().includes(query) ||
        journal.name.toLowerCase().includes(query) ||
        journal.periodName.toLowerCase().includes(query) ||
        journal.status.toLowerCase().includes(query),
    )
  }, [journals, searchQuery])

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Jurnal</h1>
        <p className="mt-1 text-gray-600">Pantau jurnal header dan total detail jurnal dari backend Django.</p>
      </div>

      <div className="flex gap-2">
        <Search className="text-gray-400" />
        <Input
          placeholder="Cari kode, nama, periode, atau status..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="flex-1"
        />
      </div>

      <div className="rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Kode</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Baris Detail</TableHead>
              <TableHead className="text-right">Total Debit</TableHead>
              <TableHead className="text-right">Total Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJournals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-gray-500">
                  Belum ada jurnal yang tersimpan.
                </TableCell>
              </TableRow>
            ) : (
              filteredJournals.map((journal) => {
                const totalDebit = journal.details.reduce((sum, detail) => sum + Number(detail.debit), 0)
                const totalCredit = journal.details.reduce((sum, detail) => sum + Number(detail.credit), 0)

                return (
                  <TableRow key={journal.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm font-medium">{journal.code}</TableCell>
                    <TableCell>{journal.date}</TableCell>
                    <TableCell className="font-medium">{journal.name}</TableCell>
                    <TableCell>{journal.periodName}</TableCell>
                    <TableCell>
                      <Badge className={journal.status === 'posted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                        {journal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{journal.details.length}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalDebit)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalCredit)}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
