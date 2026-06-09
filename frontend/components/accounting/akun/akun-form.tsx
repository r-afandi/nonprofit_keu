'use client'

import { useState } from 'react'
import { Akun, KategoriAkun } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AkunFormProps {
  akun?: Akun
  kategoriList: KategoriAkun[]
  onSubmit: (data: Omit<Akun, 'id'>) => void
  isLoading?: boolean
}

export function AkunForm({
  akun,
  kategoriList,
  onSubmit,
  isLoading = false,
}: AkunFormProps) {
  const [formData, setFormData] = useState<Omit<Akun, 'id'>>({
    kode: akun?.kode || '',
    kategoriId: akun?.kategoriId || undefined,
    nama: akun?.nama || '',
    deskripsi: akun?.deskripsi || '',
    isKasBank: akun?.isKasBank || false,
    isRestrict: akun?.isRestrict || false,
    isActive: akun?.isActive ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.kode.trim()) {
      newErrors.kode = 'Kode harus diisi'
    }
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama akun harus diisi'
    }
    if (formData.isRestrict && !formData.kategoriId) {
      newErrors.kategoriId = 'Akun restrict harus punya kategori'
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
        <Label htmlFor="kode">Kode</Label>
        <Input
          id="kode"
          value={formData.kode}
          onChange={(e) =>
            setFormData({ ...formData, kode: e.target.value })
          }
          placeholder="Contoh: KAS-001"
          className={errors.kode ? 'border-red-500' : ''}
        />
        {errors.kode && <p className="mt-1 text-sm text-red-500">{errors.kode}</p>}
      </div>

      <div>
        <Label htmlFor="kategori">Kategori Akun</Label>
        <Select
          value={formData.kategoriId ?? '__none__'}
          onValueChange={(value) =>
            setFormData({ ...formData, kategoriId: value === '__none__' ? undefined : value })
          }
        >
          <SelectTrigger
            id="kategori"
            className={errors.kategoriId ? 'border-red-500' : ''}
          >
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Tanpa kategori</SelectItem>
            {kategoriList.map((kategori) => (
              <SelectItem key={kategori.id} value={kategori.id}>
                {kategori.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.kategoriId && (
          <p className="mt-1 text-sm text-red-500">{errors.kategoriId}</p>
        )}
      </div>

      <div>
        <Label htmlFor="nama">Nama Akun</Label>
        <Input
          id="nama"
          value={formData.nama}
          onChange={(e) =>
            setFormData({ ...formData, nama: e.target.value })
          }
          placeholder="Contoh: Kas Kecil"
          className={errors.nama ? 'border-red-500' : ''}
        />
        {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
      </div>

      <div>
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea
          id="deskripsi"
          value={formData.deskripsi}
          onChange={(e) =>
            setFormData({ ...formData, deskripsi: e.target.value })
          }
          placeholder="Contoh: Rekening bank utama operasional"
          className="min-h-24"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isKasBank"
            checked={formData.isKasBank}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isKasBank: checked as boolean })
            }
          />
          <Label htmlFor="isKasBank" className="cursor-pointer">
            Adalah Kas/Bank
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isRestrict"
            checked={formData.isRestrict}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isRestrict: checked as boolean })
            }
          />
            <Label htmlFor="isRestrict" className="cursor-pointer">
              Dibatasi (Restrict)
            </Label>
          </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked as boolean })
            }
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Aktif
          </Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? 'Menyimpan...'
          : akun
            ? 'Update Akun'
            : 'Tambah Akun'}
      </Button>
    </form>
  )
}
