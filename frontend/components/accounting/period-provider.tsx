'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Periode } from '@/lib/types'

const STORAGE_KEY = 'accounting_selected_period_id'

type PeriodContextValue = {
  periodes: Periode[]
  selectedPeriodId: string
  selectedPeriod?: Periode
  setSelectedPeriodId: (periodId: string) => void
  isLoaded: boolean
}

const PeriodContext = createContext<PeriodContextValue | undefined>(undefined)

export function AccountingPeriodProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [periodes, setPeriodes] = useState<Periode[]>([])
  const [selectedPeriodId, setSelectedPeriodIdState] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadPeriods() {
      try {
        const data = await apiRequest<Periode[]>('/api/periods/')
        if (!isMounted) return

        setPeriodes(data)

        const savedPeriodId =
          typeof window !== 'undefined'
            ? window.localStorage.getItem(STORAGE_KEY)
            : null

        const savedPeriod = data.find((period) => period.id === savedPeriodId)
        const activePeriod = data.find((period) => period.isActive)
        const fallbackPeriod = savedPeriod ?? activePeriod ?? data[0]

        if (fallbackPeriod) {
          setSelectedPeriodIdState(fallbackPeriod.id)
          window.localStorage.setItem(STORAGE_KEY, fallbackPeriod.id)
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true)
        }
      }
    }

    void loadPeriods()

    return () => {
      isMounted = false
    }
  }, [])

  const setSelectedPeriodId = (periodId: string) => {
    setSelectedPeriodIdState(periodId)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, periodId)
    }
  }

  const value = useMemo(() => {
    const selectedPeriod = periodes.find((period) => period.id === selectedPeriodId)

    return {
      periodes,
      selectedPeriodId,
      selectedPeriod,
      setSelectedPeriodId,
      isLoaded,
    }
  }, [isLoaded, periodes, selectedPeriodId])

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
}

export function useAccountingPeriod() {
  const context = useContext(PeriodContext)

  if (!context) {
    throw new Error('useAccountingPeriod must be used within AccountingPeriodProvider.')
  }

  return context
}
