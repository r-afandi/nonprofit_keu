'use client'

import { Periode } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit2, Trash2 } from 'lucide-react'

interface PeriodeTableProps {
  periodes: Periode[]
  onEdit: (periode: Periode) => void
  onDelete: (id: string) => void
}

export function PeriodeTable({
  periodes,
  onEdit,
  onDelete,
}: PeriodeTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (periodes.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
        <p className="text-gray-500">Tidak ada data periode</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">No</TableHead>
            <TableHead className="font-semibold">Periode</TableHead>
            <TableHead className="font-semibold">Rentang</TableHead>
            <TableHead className="text-right font-semibold">Opsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {periodes.map((periode, index) => (
            <TableRow key={periode.id} className="hover:bg-gray-50">
              <TableCell className="text-gray-600">{index + 1}</TableCell>
              <TableCell className="font-medium">{periode.nama}</TableCell>
              <TableCell className="text-gray-600">
                {formatDate(periode.mulai)} - {formatDate(periode.akhir)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(periode)}
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
                          'Apakah Anda yakin ingin menghapus periode ini?'
                        )
                      ) {
                        onDelete(periode.id)
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
