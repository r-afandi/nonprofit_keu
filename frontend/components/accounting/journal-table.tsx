'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, type GeneratedJournalPreview, type JournalRow } from '@/lib/accounting-data'
import { cn } from '@/lib/utils'

type JournalTableProps = {
  title: string
  description: string
  rows: JournalRow[]
  accountOptions?: string[]
  preview?: GeneratedJournalPreview | null
  onRowsChange?: (rows: JournalRow[]) => void
  onPreviewChange?: (preview: GeneratedJournalPreview) => void
  accent?: 'blue' | 'orange'
}

export function JournalTable({
  title,
  description,
  rows,
  accountOptions = [],
  preview,
  onRowsChange,
  onPreviewChange,
  accent = 'blue',
}: JournalTableProps) {
  const [entries, setEntries] = useState(rows)

  useEffect(() => {
    setEntries(rows);
  }, [rows]);

  // Propagate internal entry changes to parent via onRowsChange
  useEffect(() => {
    onRowsChange?.(entries);
  }, [entries]);

  const totals = useMemo(() => {
    const totalDebit = entries.reduce((sum, row) => sum + row.debit, 0)
    const totalCredit = entries.reduce((sum, row) => sum + row.credit, 0)
    return {
      totalDebit,
      totalCredit,
      isBalanced: totalDebit === totalCredit && totalDebit > 0,
    }
  }, [entries])

  function updateRow(id: string, key: 'account' | 'debit' | 'credit', value: string) {
    setEntries((current) => {
      const nextEntries = current.map((row) =>
        row.id === id
          ? {
              ...row,
              [key]: key === 'account' ? value : Number(value || 0),
            }
          : row,
      );
      return nextEntries;
    });
  }

  function addRow() {
    setEntries((current) => {
      const nextEntries = [
        ...current,
        {
          id: `row-${current.length + 1}`,
          account: accountOptions[0] ?? '',
          debit: 0,
          credit: 0,
        },
      ];
      return nextEntries;
    });
  }

  function removeRow(id: string) {
    setEntries((current) => {
      const nextEntries = current.filter((row) => row.id !== id);
      return nextEntries;
    });
  }

  return (
    <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium',
              totals.isBalanced
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700',
            )}
          >
            {totals.isBalanced ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {totals.isBalanced ? 'Jurnal seimbang' : 'Selisih jurnal terdeteksi'}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={addRow}
            className={cn(
              'border-dashed',
              accent === 'blue' ? 'border-blue-300 text-blue-700' : 'border-orange-300 text-orange-700',
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Baris
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {preview ? (
          <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-2">
            {preview.actorName ? (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Nama</Label>
                <Input
                  value={preview.actorName}
                  onChange={(event) =>
                    onPreviewChange?.({
                      ...preview,
                      actorName: event.target.value,
                    })
                  }
                  className="border-slate-200 bg-white"
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tanggal</Label>
              <Input
                type="date"
                value={preview.date}
                onChange={(event) =>
                  onPreviewChange?.({
                    ...preview,
                    date: event.target.value,
                  })
                }
                className="border-slate-200 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Jenis Anggaran</Label>
              <Input
                value={preview.budgetType}
                onChange={(event) =>
                  onPreviewChange?.({
                    ...preview,
                    budgetType: event.target.value,
                  })
                }
                className="border-slate-200 bg-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Keterangan</Label>
              <Textarea
                value={preview.description}
                onChange={(event) =>
                  onPreviewChange?.({
                    ...preview,
                    description: event.target.value,
                  })
                }
                className="min-h-24 border-slate-200 bg-white"
              />
            </div>
          </div>
        ) : null}
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[38%]">Account</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((row) => {
                const invalid = row.debit > 0 && row.credit > 0
                return (
                  <TableRow key={row.id} className={invalid ? 'bg-rose-50/70' : ''}>
                    <TableCell>
                      <Select value={row.account} onValueChange={(value) => updateRow(row.id, 'account', value)}>
                        <SelectTrigger className="border-slate-200 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {accountOptions.map((account) => (
                            <SelectItem key={account} value={account}>{account}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.debit}
                        onChange={(event) => updateRow(row.id, 'debit', event.target.value)}
                        className="border-slate-200 bg-white"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={row.credit}
                        onChange={(event) => updateRow(row.id, 'credit', event.target.value)}
                        className="border-slate-200 bg-white"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)} aria-label="Hapus baris">
                        <Trash2 className="h-4 w-4 text-slate-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter className="sticky bottom-0 bg-slate-950 text-white">
              <TableRow>
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell>{formatCurrency(totals.totalDebit)}</TableCell>
                <TableCell>{formatCurrency(totals.totalCredit)}</TableCell>
                <TableCell className="text-right text-xs text-slate-300">
                  {totals.isBalanced ? 'Balanced' : 'Needs review'}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
