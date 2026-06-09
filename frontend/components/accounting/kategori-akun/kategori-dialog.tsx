'use client'

import { useState } from 'react'
import { KategoriAkun } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { KategoriForm } from './kategori-form'

interface KategoriDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kategori?: KategoriAkun
  onSubmit: (data: Omit<KategoriAkun, 'id'>) => Promise<void>
}

export function KategoriDialog({
  open,
  onOpenChange,
  kategori,
  onSubmit,
}: KategoriDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Omit<KategoriAkun, 'id'>) => {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {kategori ? 'Edit Kategori Akun' : 'Tambah Kategori Akun Baru'}
          </DialogTitle>
          <DialogDescription>
            {kategori
              ? 'Ubah informasi kategori akun'
              : 'Tambahkan kategori akun baru ke sistem'}
          </DialogDescription>
        </DialogHeader>
        <KategoriForm
          kategori={kategori}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
