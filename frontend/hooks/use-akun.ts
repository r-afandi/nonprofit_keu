'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Akun } from '@/lib/types'

export function useAkun() {
  const [akunList, setAkunList] = useState<Akun[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadAkun = useCallback(async () => {
    try {
      const data = await apiRequest<Akun[]>('/api/accounts/')
      setAkunList(data)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    void loadAkun()
  }, [loadAkun])

  const addAkun = useCallback(async (akun: Omit<Akun, 'id'>) => {
    const created = await apiRequest<Akun>('/api/accounts/', {
      method: 'POST',
      body: akun,
    })
    setAkunList((prev) => [...prev, created])
    return created
  }, [])

  const updateAkun = useCallback(async (id: string, akun: Omit<Akun, 'id'>) => {
    const updated = await apiRequest<Akun>(`/api/accounts/${id}/`, {
      method: 'PUT',
      body: akun,
    })
    setAkunList((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }, [])

  const deleteAkun = useCallback(async (id: string) => {
    await apiRequest<null>(`/api/accounts/${id}/`, {
      method: 'DELETE',
    })
    setAkunList((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const searchAkun = useCallback(
    (query: string) =>
      akunList.filter(
        (akun) =>
          akun.nama.toLowerCase().includes(query.toLowerCase()) ||
          akun.kode.toLowerCase().includes(query.toLowerCase()) ||
          akun.deskripsi.toLowerCase().includes(query.toLowerCase()),
      ),
    [akunList],
  )

  return {
    akunList,
    isLoaded,
    addAkun,
    updateAkun,
    deleteAkun,
    searchAkun,
    reloadAkun: loadAkun,
  }
}
