'use client'

import { useState, useMemo } from 'react'
import { usePeriode } from '@/hooks/use-periode'
import { Periode } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PeriodeTable } from '@/components/accounting/periode/periode-table'
import { PeriodeDialog } from '@/components/accounting/periode/periode-dialog'
import { Plus, Search } from 'lucide-react'

export default function PeriodePage() {
  const { periodes, isLoaded, addPeriode, updatePeriode, deletePeriode, searchPeriode } = usePeriode()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPeriode, setEditingPeriode] = useState<Periode | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPeriodes = useMemo(() => {
    if (!searchQuery) return periodes
    return searchPeriode(searchQuery)
  }, [periodes, searchQuery, searchPeriode])

  const handleCreateOrUpdate = async (data: Omit<Periode, 'id'>) => {
    if (editingPeriode) {
      await updatePeriode(editingPeriode.id, data)
      setEditingPeriode(undefined)
    } else {
      await addPeriode(data)
    }
    setIsCreateOpen(false)
  }

  const handleOpenCreate = () => {
    setEditingPeriode(undefined)
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (periode: Periode) => {
    setEditingPeriode(periode)
    setIsCreateOpen(true)
  }

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Periode</h1>
          <p className="mt-1 text-gray-600">Kelola periode akuntansi</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Periode
        </Button>
      </div>

      <div className="flex gap-2">
        <Search className="text-gray-400" />
        <Input
          placeholder="Cari periode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <PeriodeTable
        periodes={filteredPeriodes}
        onEdit={handleOpenEdit}
        onDelete={deletePeriode}
      />

      <PeriodeDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        periode={editingPeriode}
        onSubmit={handleCreateOrUpdate}
      />
    </div>
  )
}
