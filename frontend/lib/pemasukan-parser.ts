import type { GeneratedJournalPreview, JournalRow } from '@/lib/accounting-data'

type ParseInput = {
  date: string
  prompt: string
  budgetType: string
  explicitAmount?: number
  proofFileName?: string
  availableAccounts: string[]
}

const ACTION_WORDS = [
  'menyumbang',
  'menyumbangkan',
  'memberi',
  'memberikan',
  'transfer',
  'membayar',
  'bayar',
  'donasi',
  'sumbang',
  'setor',
  'menyetor',
]

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function parseAmount(prompt: string, explicitAmount?: number) {
  if (typeof explicitAmount === 'number' && explicitAmount > 0) {
    return explicitAmount
  }

  const amountMatch = prompt.match(/(\d[\d.,]*)/)
  if (!amountMatch) {
    return 0
  }

  const normalized = amountMatch[1]
    .replace(/[.,](?=\d{3}\b)/g, '')
    .replace(',', '.')

  return Number(normalized) || 0
}

export function extractMentions(prompt: string) {
  const mentions: string[] = []
  const separators = [',', ';', '.', '!', '?', '\n']

  for (let index = 0; index < prompt.length; index += 1) {
    if (prompt[index] !== '@') continue

    let end = prompt.length
    for (const separator of separators) {
      const separatorIndex = prompt.indexOf(separator, index + 1)
      if (separatorIndex !== -1 && separatorIndex < end) {
        end = separatorIndex
      }
    }

    const nextAt = prompt.indexOf('@', index + 1)
    if (nextAt !== -1 && nextAt < end) {
      end = nextAt
    }

    const rawMention = normalizeSpaces(prompt.slice(index + 1, end))
    if (rawMention) {
      mentions.push(rawMention)
    }
  }

  return mentions
}

function normalizeAccountName(raw: string, availableAccounts: string[]) {
  const normalized = normalizeSpaces(raw).toLowerCase()
  const matchedAccount = availableAccounts.find(
    (account) => normalizeSpaces(account).toLowerCase() === normalized,
  )

  if (!matchedAccount) {
    throw new Error(`Akun "${normalizeSpaces(raw)}" tidak ditemukan di apps_account.`)
  }

  return matchedAccount
}

function removeAmount(text: string) {
  return normalizeSpaces(text.replace(/(\d[\d.,]*)/g, ''))
}

function extractActorAndDescription(prompt: string) {
  const narrative = normalizeSpaces(prompt.split('@')[0] ?? '')
  const withoutAmount = removeAmount(narrative)

  const actorMatch = withoutAmount.match(
    new RegExp(`^(.*?)\\s+(?:${ACTION_WORDS.join('|')})\\b`, 'i'),
  )

  if (actorMatch?.[1]) {
    const actorName = titleCase(actorMatch[1])
    const description = normalizeSpaces(withoutAmount.slice(actorMatch[1].length))

    return {
      actorName,
      description: description ? titleCase(description) : titleCase(withoutAmount),
    }
  }

  const words = withoutAmount.split(' ').filter(Boolean)
  const actorName = words.length >= 2 ? titleCase(words.slice(0, 2).join(' ')) : ''
  const description = actorName
    ? normalizeSpaces(withoutAmount.slice(actorName.length)).trim()
    : withoutAmount

  return {
    actorName,
    description: description ? titleCase(description) : 'Pemasukan',
  }
}

export function buildPemasukanPreview({
  date,
  prompt,
  budgetType,
  explicitAmount,
  proofFileName,
  availableAccounts,
}: ParseInput): GeneratedJournalPreview {
  const trimmedPrompt = normalizeSpaces(prompt)
  const mentions = extractMentions(trimmedPrompt)
  const amount = parseAmount(trimmedPrompt, explicitAmount)

  if (mentions.length < 2) {
    throw new Error('Gunakan minimal 2 akun dengan format @Akun Kredit, lalu @Akun Debit.')
  }

  if (amount <= 0) {
    throw new Error('Nominal belum terbaca. Isi nominal atau tulis angka pada prompt.')
  }

  const creditAccount = normalizeAccountName(mentions[0], availableAccounts)
  const debitAccount = normalizeAccountName(mentions[1], availableAccounts)
  const { actorName, description } = extractActorAndDescription(trimmedPrompt)

  const rows: JournalRow[] = [
    {
      id: 'inc-debit',
      account: debitAccount,
      debit: amount,
      credit: 0,
    },
    {
      id: 'inc-credit',
      account: creditAccount,
      debit: 0,
      credit: amount,
    },
  ]

  return {
    date,
    description,
    actorName,
    budgetType,
    amount,
    prompt: trimmedPrompt,
    proofFileName,
    rows,
  }
}

export function extractMentionQuery(value: string, cursorPosition: number) {
  const textBeforeCursor = value.slice(0, cursorPosition)
  const match = textBeforeCursor.match(/@([^@\s,;.]*)$/)
  return match?.[1] ?? null
}

export function insertAccountMention(value: string, cursorPosition: number, accountName: string) {
  const textBeforeCursor = value.slice(0, cursorPosition)
  const textAfterCursor = value.slice(cursorPosition)
  const updatedBefore = textBeforeCursor.replace(/@([^@\s,;.]*)$/, `@${accountName}`)
  const suffix = textAfterCursor.startsWith(' ') ? '' : ' '
  return `${updatedBefore}${suffix}${textAfterCursor}`
}
