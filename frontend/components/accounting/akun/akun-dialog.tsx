'use client'

import { useState } from 'react'
import { Akun, KategoriAkun } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AkunForm } from './akun-form'

interface AkunDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  akun?: Akun
  kategoriList: KategoriAkun[]
  onSubmit: (data: Omit<Akun, 'id'>) => Promise<void>
}

export function AkunDialog({
  open,
  onOpenChange,
  akun,
  kategoriList,
  onSubmit,
}: AkunDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Omit<Akun, 'id'>) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {akun ? 'Edit Akun' : 'Tambah Akun Baru'}
          </DialogTitle>
          <DialogDescription>
            {akun
              ? 'Ubah informasi akun akuntansi'
              : 'Tambahkan akun akuntansi baru ke sistem'}
          </DialogDescription>
        </DialogHeader>
        <AkunForm
          akun={akun}
          kategoriList={kategoriList}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
