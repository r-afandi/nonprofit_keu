'use client'

import { useState } from 'react'
import { KategoriAkun } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface KategoriFormProps {
  kategori?: KategoriAkun
  onSubmit: (data: Omit<KategoriAkun, 'id'>) => void
  isLoading?: boolean
}

export function KategoriForm({
  kategori,
  onSubmit,
  isLoading = false,
}: KategoriFormProps) {
  const [formData, setFormData] = useState<Omit<KategoriAkun, 'id'>>({
    nama: kategori?.nama || '',
    deskripsi: kategori?.deskripsi || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi'
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
        <Label htmlFor="nama">Nama</Label>
        <Input
          id="nama"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          placeholder="Contoh: Kas"
          className={errors.nama ? 'border-red-500' : ''}
        />
        {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
      </div>

      <div>
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea
          id="deskripsi"
          value={formData.deskripsi}
          onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
          placeholder="Contoh: Kelompok akun kas dan setara kas"
          className="min-h-24"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? 'Menyimpan...'
          : kategori
            ? 'Update Kategori'
            : 'Tambah Kategori'}
      </Button>
    </form>
  )
}
