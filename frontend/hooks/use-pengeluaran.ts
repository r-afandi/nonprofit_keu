import { useState, useCallback } from 'react'
import { Pengeluaran } from '@/lib/types'

const STORAGE_KEY = 'pengeluaran_data'

export function usePengeluaran() {
  const [pengeluaran, setPengeluaran] = useState<Pengeluaran[]>(() => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  })

  const savePengeluaran = useCallback((data: Pengeluaran[]) => {
    setPengeluaran(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [])

  const addPengeluaran = useCallback((newPengeluaran: Pengeluaran) => {
    setPengeluaran(prev => {
      const updated = [...prev, newPengeluaran]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const updatePengeluaran = useCallback((id: string, updates: Partial<Pengeluaran>) => {
    setPengeluaran(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const deletePengeluaran = useCallback((id: string) => {
    setPengeluaran(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    pengeluaran,
    addPengeluaran,
    updatePengeluaran,
    deletePengeluaran,
    savePengeluaran
  }
}
