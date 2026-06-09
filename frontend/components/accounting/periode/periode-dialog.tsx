'use client'

import { useState } from 'react'
import { Periode } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PeriodeForm } from './periode-form'

interface PeriodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  periode?: Periode
  onSubmit: (data: Omit<Periode, 'id'>) => Promise<void>
}

export function PeriodeDialog({
  open,
  onOpenChange,
  periode,
  onSubmit,
}: PeriodeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Omit<Periode, 'id'>) => {
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
            {periode ? 'Edit Periode' : 'Tambah Periode Baru'}
          </DialogTitle>
          <DialogDescription>
            {periode
              ? 'Ubah informasi periode akuntansi'
              : 'Tambahkan periode akuntansi baru ke sistem'}
          </DialogDescription>
        </DialogHeader>
        <PeriodeForm
          periode={periode}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
