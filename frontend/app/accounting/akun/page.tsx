'use client'

import { useState, useMemo } from 'react'
import { useAkun } from '@/hooks/use-akun'
import { useKategoriAkun } from '@/hooks/use-kategori-akun'
import { Akun } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AkunTable } from '@/components/accounting/akun/akun-table'
import { AkunDialog } from '@/components/accounting/akun/akun-dialog'
import { Plus, Search } from 'lucide-react'

export default function AkunPage() {
  const {
    akunList,
    isLoaded: akunLoaded,
    addAkun,
    updateAkun,
    deleteAkun,
    searchAkun,
  } = useAkun()
  const { kategoriList, isLoaded: kategoriLoaded } = useKategoriAkun()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAkun, setEditingAkun] = useState<Akun | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAkun = useMemo(() => {
    if (!searchQuery) return akunList
    return searchAkun(searchQuery)
  }, [akunList, searchQuery, searchAkun])

  const handleCreateOrUpdate = async (data: Omit<Akun, 'id'>) => {
    if (editingAkun) {
      await updateAkun(editingAkun.id, data)
      setEditingAkun(undefined)
    } else {
      await addAkun(data)
    }
    setIsCreateOpen(false)
  }

  const handleOpenCreate = () => {
    setEditingAkun(undefined)
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (akun: Akun) => {
    setEditingAkun(akun)
    setIsCreateOpen(true)
  }

  if (!akunLoaded || !kategoriLoaded) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Akun</h1>
          <p className="mt-1 text-gray-600">Kelola akun akuntansi</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Akun
        </Button>
      </div>

      <div className="flex gap-2">
        <Search className="text-gray-400" />
        <Input
          placeholder="Cari akun..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <AkunTable
        akunList={filteredAkun}
        kategoriList={kategoriList}
        onEdit={handleOpenEdit}
        onDelete={deleteAkun}
      />

      <AkunDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        akun={editingAkun}
        kategoriList={kategoriList}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  )
}
