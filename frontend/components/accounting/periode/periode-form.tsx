'use client'

import { useState } from 'react'
import { Periode } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PeriodeFormProps {
  periode?: Periode
  onSubmit: (data: Omit<Periode, 'id'>) => void
  isLoading?: boolean
}

export function PeriodeForm({
  periode,
  onSubmit,
  isLoading = false,
}: PeriodeFormProps) {
  const [formData, setFormData] = useState<Omit<Periode, 'id'>>({
    nama: periode?.nama || '',
    mulai: periode?.mulai || '',
    akhir: periode?.akhir || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama periode harus diisi'
    }
    if (!formData.mulai) {
      newErrors.mulai = 'Tanggal mulai harus diisi'
    }
    if (!formData.akhir) {
      newErrors.akhir = 'Tanggal akhir harus diisi'
    }
    if (formData.mulai && formData.akhir && formData.mulai > formData.akhir) {
      newErrors.akhir = 'Tanggal akhir harus lebih besar dari tanggal mulai'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nama">Nama Periode</Label>
        <Input
          id="nama"
          value={formData.nama}
          onChange={(e) =>
            setFormData({ ...formData, nama: e.target.value })
          }
          placeholder="Contoh: Periode 2024"
          className={errors.nama ? 'border-red-500' : ''}
        />
        {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
      </div>

      <div>
        <Label htmlFor="mulai">Tanggal Mulai</Label>
        <Input
          id="mulai"
          type="date"
          value={formData.mulai}
          onChange={(e) =>
            setFormData({ ...formData, mulai: e.target.value })
          }
          className={errors.mulai ? 'border-red-500' : ''}
        />
        {errors.mulai && <p className="mt-1 text-sm text-red-500">{errors.mulai}</p>}
      </div>

      <div>
        <Label htmlFor="akhir">Tanggal Akhir</Label>
        <Input
          id="akhir"
          type="date"
          value={formData.akhir}
          onChange={(e) =>
            setFormData({ ...formData, akhir: e.target.value })
          }
          className={errors.akhir ? 'border-red-500' : ''}
        />
        {errors.akhir && <p className="mt-1 text-sm text-red-500">{errors.akhir}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Menyimpan...' : periode ? 'Update Periode' : 'Tambah Periode'}
      </Button>
    </form>
  )
}
