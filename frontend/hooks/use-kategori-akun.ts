'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { KategoriAkun } from '@/lib/types'

export function useKategoriAkun() {
  const [kategoriList, setKategoriList] = useState<KategoriAkun[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadKategori = useCallback(async () => {
    try {
      const data = await apiRequest<KategoriAkun[]>('/api/categories/')
      setKategoriList(data)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    void loadKategori()
  }, [loadKategori])

  const addKategori = useCallback(async (kategori: Omit<KategoriAkun, 'id'>) => {
    const created = await apiRequest<KategoriAkun>('/api/categories/', {
      method: 'POST',
      body: kategori,
    })
    setKategoriList((prev) => [...prev, created])
    return created
  }, [])

  const updateKategori = useCallback(async (id: string, kategori: Omit<KategoriAkun, 'id'>) => {
    const updated = await apiRequest<KategoriAkun>(`/api/categories/${id}/`, {
      method: 'PUT',
      body: kategori,
    })
    setKategoriList((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }, [])

  const deleteKategori = useCallback(async (id: string) => {
    await apiRequest<null>(`/api/categories/${id}/`, {
      method: 'DELETE',
    })
    setKategoriList((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const searchKategori = useCallback(
    (query: string) =>
      kategoriList.filter(
        (kategori) =>
          kategori.nama.toLowerCase().includes(query.toLowerCase()) ||
          kategori.deskripsi.toLowerCase().includes(query.toLowerCase()),
      ),
    [kategoriList],
  )

  return {
    kategoriList,
    isLoaded,
    addKategori,
    updateKategori,
    deleteKategori,
    searchKategori,
    reloadKategori: loadKategori,
  }
}
