'use client'

import { useMemo, useState } from 'react'
import { Save, Send } from 'lucide-react'
import { useAccountingPeriod } from '@/components/accounting/period-provider'
import { JournalTable } from '@/components/accounting/journal-table'
import { PageHeader } from '@/components/accounting/page-header'
import { TransactionForm } from '@/components/accounting/transaction-form'
import { Button } from '@/components/ui/button'
import { useAkun } from '@/hooks/use-akun'
import { apiRequest } from '@/lib/api'
import { type GeneratedJournalPreview, type JournalRow } from '@/lib/accounting-data'

function buildJournalCode(date: string) {
  const dateToken = date.replaceAll('-', '')
  const randomToken = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CB-${dateToken}-${randomToken}`
}

function buildJournalPayload(
  preview: GeneratedJournalPreview,
  rows: JournalRow[],
  periodId: string,
  status: 'draft' | 'posted',
) {
  return {
    periodId,
    code: buildJournalCode(preview.date),
    date: preview.date,
    name: preview.actorName || preview.description,
    description: `${preview.description}${preview.actorName ? ` - ${preview.actorName}` : ''} | Jenis anggaran: ${preview.budgetType}${preview.proofFileName ? ` | Bukti: ${preview.proofFileName}` : ''}`,
    status,
    user: 'accounting-ui',
    published: status === 'posted',
    details: rows.map((row) => ({
      accountId: row.account,
      debit: row.debit,
      credit: row.credit,
    })),
  }
}

export default function KasBankPage() {
  const { akunList, isLoaded: akunLoaded } = useAkun()
  const { selectedPeriod, selectedPeriodId, isLoaded: periodLoaded } = useAccountingPeriod()
  const [generatedPreview, setGeneratedPreview] = useState<GeneratedJournalPreview | null>(null)
  const [rows, setRows] = useState<JournalRow[]>([])
  const [saveMessage, setSaveMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeAccounts = useMemo(
    () => akunList.filter((account) => account.isActive),
    [akunList],
  )

  const accountOptions = useMemo(
    () =>
      activeAccounts.map((account) => ({
        name: account.nama,
        code: account.kode,
        categoryLabel: account.kategoriNama || (account.isKasBank ? 'Kas/Bank' : 'Akun'),
      })),
    [activeAccounts],
  )

  const accountNames = useMemo(
    () => activeAccounts.map((account) => account.nama),
    [activeAccounts],
  )

  const accountIdByName = useMemo(
    () =>
      new Map(
        activeAccounts.map((account) => [account.nama.trim().toLowerCase(), account.id]),
      ),
    [activeAccounts],
  )

  const defaultDate = new Date().toISOString().slice(0, 10)

  async function persistJournal(status: 'draft' | 'posted') {
    if (!generatedPreview) {
      setSaveMessage('Generate jurnal dulu sebelum disimpan.')
      return
    }

    if (!selectedPeriodId) {
      setSaveMessage('Pilih period aktif di sidebar sebelum menyimpan jurnal.')
      return
    }

    const mappedRows = rows.map((row) => {
      const accountId = accountIdByName.get(row.account.trim().toLowerCase())
      if (!accountId) {
        throw new Error(`Akun "${row.account}" belum ditemukan di apps_account.`)
      }

      return {
        ...row,
        account: accountId,
      }
    })

    setIsSubmitting(true)
    try {
      const payload = buildJournalPayload(
        {
          ...generatedPreview,
          rows: mappedRows,
        },
        mappedRows,
        selectedPeriodId,
        status,
      )

      await apiRequest('/api/journals/', {
        method: 'POST',
        body: payload,
      })

      setSaveMessage(status === 'draft' ? 'Draft jurnal kas/bank berhasil disimpan.' : 'Jurnal kas/bank berhasil diposting.')
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Jurnal belum berhasil disimpan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kas & Bank"
        title="Input Mutasi Kas/Bank"
        description={`Catat mutasi kas dan bank dengan prompt @akun. ${selectedPeriod ? `Period terpilih: ${selectedPeriod.nama}.` : ''}`}
        actions={
          <>
            <Button
              variant="outline"
              className="border-slate-300 bg-white"
              onClick={() => void persistJournal('draft')}
              disabled={isSubmitting || !generatedPreview}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => void persistJournal('posted')}
              disabled={isSubmitting || !generatedPreview}
            >
              <Send className="mr-2 h-4 w-4" />
              Post Journal
            </Button>
          </>
        }
      />

      {saveMessage ? (
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
          {saveMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <TransactionForm
          title="Form Kas & Bank"
          description="Gunakan prompt untuk mencatat setoran, penarikan, transfer antar rekening, dan mutasi internal kas/bank."
          placeholder="Setor tunai ke Bank BCA 2.500.000 dari @Kas Operasional, lalu @Bank BCA"
          accountOptions={accountOptions}
          defaultDate={defaultDate}
          accent="blue"
          generateButtonLabel="Generate Mutasi"
          onGenerate={async (input) => {
            const preview = await apiRequest<GeneratedJournalPreview>('/api/pemasukan/preview/', {
              method: 'POST',
              body: input,
            })
            setGeneratedPreview(preview)
            setRows(preview.rows)
            setSaveMessage('')
            return preview
          }}
        />
        <JournalTable
          title="Preview Mutasi Kas/Bank"
          description="Preview jurnal ini bisa diedit sebelum disimpan ke backend."
          rows={rows}
          preview={generatedPreview}
          accountOptions={accountNames}
          onRowsChange={setRows}
          accent="blue"
        />
      </div>

      {!akunLoaded || !periodLoaded ? (
        <p className="text-sm text-slate-500">Memuat akun aktif dan period terpilih...</p>
      ) : null}
    </div>
  )
}
