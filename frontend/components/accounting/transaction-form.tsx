'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { FileUp, RefreshCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { GeneratedJournalPreview } from '@/lib/accounting-data'
import { extractMentionQuery, extractMentions, insertAccountMention } from '@/lib/pemasukan-parser'
import { cn } from '@/lib/utils'

type GenerateInput = {
  date: string
  prompt: string
  budgetType: string
  explicitAmount?: number
  proofFileName?: string
}

type AccountSuggestion = {
  name: string
  code?: string
  categoryLabel?: string
}

type SuggestionPosition = {
  top: number
  left: number
}

type TransactionFormProps = {
  title: string
  description: string
  placeholder: string
  accountOptions: Array<string | AccountSuggestion>
  defaultDate: string
  onGenerate?: (input: GenerateInput) => Promise<GeneratedJournalPreview>
  accent?: 'blue' | 'orange'
  generateButtonLabel?: string
}

const budgetOptions = ['Operasional', 'Program', 'Investasi', 'Pembiayaan', 'Dana Terikat']

export function TransactionForm({
  title,
  description,
  placeholder,
  accountOptions,
  defaultDate,
  onGenerate,
  accent = 'blue',
  generateButtonLabel = 'Generate AI Journal',
}: TransactionFormProps) {
  const [message, setMessage] = useState('Tuliskan transaksi dengan pola narasi nominal @Akun Kredit, lalu @Akun Debit agar draft jurnal cepat terbentuk.')
  const [tanggal, setTanggal] = useState(defaultDate)
  const [prompt, setPrompt] = useState('')
  const [nominal, setNominal] = useState('')
  const [budgetType, setBudgetType] = useState('Operasional')
  const [proofFileName, setProofFileName] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPromptFocused, setIsPromptFocused] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [suggestionPosition, setSuggestionPosition] = useState<SuggestionPosition>({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const promptAreaRef = useRef<HTMLDivElement | null>(null)
  const mirrorRef = useRef<HTMLDivElement | null>(null)
  const suggestionPanelRef = useRef<HTMLDivElement | null>(null)

  const mentionQuery = useMemo(
    () => extractMentionQuery(prompt, cursorPosition),
    [cursorPosition, prompt],
  )

  const isMentionActive = isPromptFocused && mentionQuery !== null
  const normalizedAccountOptions = useMemo(
    () =>
      accountOptions.map((account) =>
        typeof account === 'string'
          ? { name: account }
          : account,
      ),
    [accountOptions],
  )

  const mentionSuggestions = useMemo(() => {
    if (mentionQuery === null) return []

    const query = mentionQuery.trim().toLowerCase()

    return normalizedAccountOptions
      .filter((account) => {
        if (!query) return true

        return [account.name, account.code, account.categoryLabel]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query))
      })
      .slice(0, 6)
  }, [mentionQuery, normalizedAccountOptions])

  const selectedAccounts = useMemo(() => {
    if (!prompt.trim()) return []

    const seen = new Set<string>()

    return extractMentions(prompt)
      .map((mention) =>
        normalizedAccountOptions.find(
          (account) => account.name.trim().toLowerCase() === mention.trim().toLowerCase(),
        ),
      )
      .filter((account): account is AccountSuggestion => Boolean(account))
      .filter((account) => {
        const key = account.name.trim().toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
  }, [prompt, normalizedAccountOptions])

  useLayoutEffect(() => {
    if (!isMentionActive || mentionSuggestions.length === 0) return

    const textarea = textareaRef.current
    const wrapper = promptAreaRef.current
    const mirror = mirrorRef.current

    if (!textarea || !wrapper || !mirror) return

    const styles = window.getComputedStyle(textarea)
    const beforeCursor = prompt.slice(0, cursorPosition)

    mirror.replaceChildren()
    mirror.style.position = 'absolute'
    mirror.style.left = '0'
    mirror.style.top = '0'
    mirror.style.visibility = 'hidden'
    mirror.style.pointerEvents = 'none'
    mirror.style.boxSizing = styles.boxSizing
    mirror.style.width = `${textarea.offsetWidth}px`
    mirror.style.padding = styles.padding
    mirror.style.border = styles.border
    mirror.style.borderRadius = styles.borderRadius
    mirror.style.fontFamily = styles.fontFamily
    mirror.style.fontSize = styles.fontSize
    mirror.style.fontWeight = styles.fontWeight
    mirror.style.fontStyle = styles.fontStyle
    mirror.style.letterSpacing = styles.letterSpacing
    mirror.style.lineHeight = styles.lineHeight
    mirror.style.textAlign = styles.textAlign
    mirror.style.textIndent = styles.textIndent
    mirror.style.textTransform = styles.textTransform
    mirror.style.whiteSpace = 'pre-wrap'
    mirror.style.wordBreak = 'break-word'
    mirror.style.overflowWrap = 'anywhere'
    mirror.style.overflow = 'hidden'
    mirror.style.height = 'auto'
    mirror.style.minHeight = styles.minHeight
    mirror.style.maxHeight = 'none'
    mirror.style.tabSize = styles.tabSize
    mirror.style.direction = styles.direction
    mirror.style.resize = 'none'

    const content = document.createTextNode(beforeCursor)
    const caret = document.createElement('span')
    caret.setAttribute('aria-hidden', 'true')
    caret.style.display = 'inline-block'
    caret.style.width = '1px'
    caret.style.height = '1em'
    caret.style.verticalAlign = 'baseline'

    mirror.append(content, caret)

    const caretRect = caret.getBoundingClientRect()
    const wrapperRect = wrapper.getBoundingClientRect()
    const panelWidth = suggestionPanelRef.current?.offsetWidth ?? 320
    const panelHeight = suggestionPanelRef.current?.offsetHeight ?? 0
    const padding = 12
    const maxLeft = Math.max(padding, wrapper.clientWidth - panelWidth - padding)
    const nextLeft = Math.min(
      Math.max(caretRect.left - wrapperRect.left, padding),
      maxLeft,
    )

    let nextTop = caretRect.bottom - wrapperRect.top + 10
    if (panelHeight > 0) {
      const spaceBelow = wrapper.clientHeight - nextTop - padding
      const spaceAbove = caretRect.top - wrapperRect.top - panelHeight - 10
      if (spaceBelow < panelHeight && spaceAbove >= padding) {
        nextTop = spaceAbove
      }
    }

    setSuggestionPosition((current) =>
      current.top === nextTop && current.left === nextLeft ? current : { top: nextTop, left: nextLeft },
    )
  }, [cursorPosition, isMentionActive, mentionSuggestions.length, prompt])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!promptAreaRef.current?.contains(event.target as Node)) {
        setIsPromptFocused(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  useEffect(() => {
    setActiveSuggestionIndex(0)
  }, [mentionQuery])

  function handleReset() {
    setTanggal(defaultDate)
    setPrompt('')
    setNominal('')
    setBudgetType('Operasional')
    setProofFileName('')
    setErrorMessage('')
    setMessage('Form direset. Tulis ulang transaksi dengan format @akun untuk membuat draft jurnal baru.')
  }

  function handleSelectMention(accountName: string) {
    const textarea = textareaRef.current
    if (!textarea) return

    const nextValue = insertAccountMention(prompt, cursorPosition, accountName)
    setPrompt(nextValue)
    setErrorMessage('')

    requestAnimationFrame(() => {
      const nextCursor = nextValue.length
      textarea.focus()
      textarea.setSelectionRange(nextCursor, nextCursor)
      setCursorPosition(nextCursor)
    })
  }

  function handlePromptKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!isMentionActive || mentionSuggestions.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveSuggestionIndex((current) => (current + 1) % mentionSuggestions.length)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveSuggestionIndex((current) =>
        current === 0 ? mentionSuggestions.length - 1 : current - 1,
      )
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const selectedAccount = mentionSuggestions[activeSuggestionIndex] ?? mentionSuggestions[0]
      if (selectedAccount) {
        handleSelectMention(selectedAccount.name)
        setIsPromptFocused(true)
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsPromptFocused(false)
    }
  }

  async function handleGenerate() {
    setIsGenerating(true)
    setErrorMessage('')
    try {
      if (!onGenerate) {
        setMessage('Generate draft jurnal belum diaktifkan pada form ini.')
        return
      }

      const preview = await onGenerate({
        date: tanggal,
        prompt,
        budgetType,
        explicitAmount: nominal ? Number(nominal) : undefined,
        proofFileName: proofFileName || undefined,
      })
      setMessage(`Draft jurnal berhasil dibuat untuk ${preview.actorName || preview.description}. Silakan cek pasangan debit dan credit sebelum disimpan.`)
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : 'Draft jurnal belum bisa dibuat.'
      setErrorMessage(nextMessage)
      setMessage(nextMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-white/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
        <p className="text-sm text-slate-500">{description}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor={`${title}-date`}>Tanggal</Label>
            <Input
              id={`${title}-date`}
              type="date"
              value={tanggal}
              onChange={(event) => setTanggal(event.target.value)}
              className="border-slate-200 bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${title}-description`}>Prompt transaksi</Label>
            <div ref={promptAreaRef} className="relative">
              <Textarea
                ref={textareaRef}
                id={`${title}-description`}
                value={prompt}
                onChange={(event) => {
                  setPrompt(event.target.value)
                  setCursorPosition(event.target.selectionStart ?? 0)
                  setErrorMessage('')
                }}
                onFocus={() => setIsPromptFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setIsPromptFocused(false), 150)
                }}
                onKeyDown={handlePromptKeyDown}
                onClick={(event) => setCursorPosition(event.currentTarget.selectionStart ?? 0)}
                onKeyUp={(event) => setCursorPosition(event.currentTarget.selectionStart ?? 0)}
                onSelect={(event) => setCursorPosition(event.currentTarget.selectionStart ?? 0)}
                placeholder={placeholder}
                className="min-h-36 resize-none border-slate-200 bg-white"
              />
              <div
                ref={mirrorRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 -z-10 overflow-hidden"
              />
              {mentionSuggestions.length > 0 && isMentionActive ? (
                <div
                  ref={suggestionPanelRef}
                  className="absolute z-30 w-[320px] max-w-[calc(100%-1rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                  style={{ top: suggestionPosition.top, left: suggestionPosition.left }}
                >
                  <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Saran akun
                  </p>
                  <div className="max-h-56 overflow-auto">
                    {mentionSuggestions.map((account, index) => (
                      <button
                        key={`${account.name}-${account.code ?? index}`}
                        type="button"
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-800 transition',
                          index === activeSuggestionIndex ? 'bg-slate-100' : 'hover:bg-slate-100',
                        )}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelectMention(account.name)}
                      >
                        <span className="inline-flex shrink-0 items-center rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                          {account.categoryLabel ?? 'Akun'}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{account.name}</span>
                        {account.code ? (
                          <span className="shrink-0 text-xs font-semibold text-slate-500">
                            {account.code}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <p className="text-xs text-slate-500">
              Contoh: <span className="font-medium text-slate-700">Pak Bambang menyumbang uang sebesar 100.000 @Infaq, dimasukan ke @Kas Umum</span>
            </p>
            {selectedAccounts.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Akun terpilih
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAccounts.map((account) => (
                    <span
                      key={`${account.name}-${account.code ?? 'no-code'}`}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-900"
                    >
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                        {account.code ? `No. ${account.code}` : 'No. —'}
                      </span>
                      <span className="truncate">{account.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${title}-budget`}>Jenis anggaran</Label>
              <Select value={budgetType} onValueChange={setBudgetType}>
                <SelectTrigger id={`${title}-budget`} className="border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${title}-amount`}>Nominal</Label>
              <Input
                id={`${title}-amount`}
                type="number"
                value={nominal}
                onChange={(event) => setNominal(event.target.value)}
                placeholder="Opsional jika sudah ditulis pada prompt"
                className="border-slate-200 bg-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${title}-proof`}>Upload bukti transaksi</Label>
            <label
              htmlFor={`${title}-proof`}
              className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-100"
            >
              <FileUp className="h-4 w-4" />
              {proofFileName || 'Pilih file pendukung'}
            </label>
            <input
              id={`${title}-proof`}
              type="file"
              className="hidden"
              onChange={(event) => setProofFileName(event.target.files?.[0]?.name ?? '')}
            />
          </div>
        </div>

        <div
          className={cn(
            'rounded-2xl border p-4 text-sm',
            errorMessage
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : accent === 'blue'
                ? 'border-blue-100 bg-blue-50/80 text-blue-900'
                : 'border-orange-100 bg-orange-50/80 text-orange-900',
          )}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{message}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-slate-300"
            onClick={handleReset}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          {onGenerate ? (
            <Button
              type="button"
              className={cn(
                'text-white shadow-lg',
                accent === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600',
              )}
              onClick={() => void handleGenerate()}
              disabled={isGenerating}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : generateButtonLabel}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
