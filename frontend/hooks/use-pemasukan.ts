import { useState, useCallback } from 'react'
import { Pemasukan } from '@/lib/types'

const STORAGE_KEY = 'pemasukan_data'

export function usePemasukan() {
  const [pemasukan, setPemasukan] = useState<Pemasukan[]>(() => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  })

  const savePemasukan = useCallback((data: Pemasukan[]) => {
    setPemasukan(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [])

  const addPemasukan = useCallback((newPemasukan: Pemasukan) => {
    setPemasukan(prev => {
      const updated = [...prev, newPemasukan]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const updatePemasukan = useCallback((id: string, updates: Partial<Pemasukan>) => {
    setPemasukan(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const deletePemasukan = useCallback((id: string) => {
    setPemasukan(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    pemasukan,
    addPemasukan,
    updatePemasukan,
    deletePemasukan,
    savePemasukan
  }
}
