'use client'

import { Akun, KategoriAkun } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2 } from 'lucide-react'

interface AkunTableProps {
  akunList: Akun[]
  kategoriList: KategoriAkun[]
  onEdit: (akun: Akun) => void
  onDelete: (id: string) => void
}

export function AkunTable({
  akunList,
  kategoriList,
  onEdit,
  onDelete,
}: AkunTableProps) {
  const getKategoriName = (kategoriId?: string) => {
    if (!kategoriId) return '-'
    return kategoriList.find((k) => k.id === kategoriId)?.nama || '-'
  }

  if (akunList.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
        <p className="text-gray-500">Tidak ada data akun</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Kode</TableHead>
            <TableHead className="font-semibold">Akun</TableHead>
            <TableHead className="font-semibold">Kategori</TableHead>
            <TableHead className="font-semibold">Kas/Bank</TableHead>
            <TableHead className="font-semibold">Restrict</TableHead>
            <TableHead className="font-semibold">Aktif</TableHead>
            <TableHead className="text-right font-semibold">Opsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {akunList.map((akun) => (
            <TableRow key={akun.id} className="hover:bg-gray-50">
              <TableCell className="font-mono text-sm font-medium">
                {akun.kode}
              </TableCell>
              <TableCell className="font-medium">{akun.nama}</TableCell>
              <TableCell className="text-gray-600">
                {getKategoriName(akun.kategoriId)}
              </TableCell>
              <TableCell>
                <Badge className={akun.isKasBank ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                  {akun.isKasBank ? 'Ya' : 'Tidak'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={akun.isRestrict ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}>
                  {akun.isRestrict ? 'Ya' : 'Tidak'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={akun.isActive ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}>
                  {akun.isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(akun)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm(
                          'Apakah Anda yakin ingin menghapus akun ini?'
                        )
                      ) {
                        onDelete(akun.id)
                      }
                    }}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
