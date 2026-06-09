'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Periode } from '@/lib/types'

export function usePeriode() {
  const [periodes, setPeriodes] = useState<Periode[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadPeriode = useCallback(async () => {
    try {
      const data = await apiRequest<Periode[]>('/api/periods/')
      setPeriodes(data)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    void loadPeriode()
  }, [loadPeriode])

  const addPeriode = useCallback(async (periode: Omit<Periode, 'id'>) => {
    const created = await apiRequest<Periode>('/api/periods/', {
      method: 'POST',
      body: periode,
    })
    setPeriodes((prev) => [...prev, created])
    return created
  }, [])

  const updatePeriode = useCallback(async (id: string, periode: Omit<Periode, 'id'>) => {
    const updated = await apiRequest<Periode>(`/api/periods/${id}/`, {
      method: 'PUT',
      body: periode,
    })
    setPeriodes((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }, [])

  const deletePeriode = useCallback(async (id: string) => {
    await apiRequest<null>(`/api/periods/${id}/`, {
      method: 'DELETE',
    })
    setPeriodes((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const searchPeriode = useCallback(
    (query: string) =>
      periodes.filter(
        (periode) =>
          periode.nama.toLowerCase().includes(query.toLowerCase()) ||
          periode.mulai.includes(query) ||
          periode.akhir.includes(query),
      ),
    [periodes],
  )

  return {
    periodes,
    isLoaded,
    addPeriode,
    updatePeriode,
    deletePeriode,
    searchPeriode,
    reloadPeriode: loadPeriode,
  }
}
