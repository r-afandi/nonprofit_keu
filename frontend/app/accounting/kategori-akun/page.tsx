'use client'

import { useState, useMemo } from 'react'
import { useKategoriAkun } from '@/hooks/use-kategori-akun'
import { KategoriAkun } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KategoriTable } from '@/components/accounting/kategori-akun/kategori-table'
import { KategoriDialog } from '@/components/accounting/kategori-akun/kategori-dialog'
import { Plus, Search } from 'lucide-react'

export default function KategoriAkunPage() {
  const {
    kategoriList,
    isLoaded,
    addKategori,
    updateKategori,
    deleteKategori,
    searchKategori,
  } = useKategoriAkun()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingKategori, setEditingKategori] = useState<KategoriAkun | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredKategori = useMemo(() => {
    if (!searchQuery) return kategoriList
    return searchKategori(searchQuery)
  }, [kategoriList, searchQuery, searchKategori])

  const handleCreateOrUpdate = async (data: Omit<KategoriAkun, 'id'>) => {
    if (editingKategori) {
      await updateKategori(editingKategori.id, data)
      setEditingKategori(undefined)
    } else {
      await addKategori(data)
    }
    setIsCreateOpen(false)
  }

  const handleOpenCreate = () => {
    setEditingKategori(undefined)
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (kategori: KategoriAkun) => {
    setEditingKategori(kategori)
    setIsCreateOpen(true)
  }

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategori Akun</h1>
          <p className="mt-1 text-gray-600">Kelola kategori akun akuntansi</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <div className="flex gap-2">
        <Search className="text-gray-400" />
        <Input
          placeholder="Cari kategori..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <KategoriTable
        kategoriList={filteredKategori}
        onEdit={handleOpenEdit}
        onDelete={deleteKategori}
      />

      <KategoriDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        kategori={editingKategori}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  )
}
