'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Journal } from '@/lib/types'

export function useJournal() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadJournals = useCallback(async () => {
    try {
      const data = await apiRequest<Journal[]>('/api/journals/')
      setJournals(data)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    void loadJournals()
  }, [loadJournals])

  return {
    journals,
    isLoaded,
    reloadJournals: loadJournals,
  }
}
