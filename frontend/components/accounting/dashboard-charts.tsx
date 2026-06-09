'use client'

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from 'recharts'
import { ChartCard } from '@/components/accounting/chart-card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { expenseCategoryData, incomeCategoryData, monthlyExpenseData, monthlyIncomeData } from '@/lib/accounting-data'

const incomeConfig = {
  total: {
    label: 'Pemasukan',
    color: '#2563eb',
  },
}

const expenseConfig = {
  total: {
    label: 'Pengeluaran',
    color: '#ea580c',
  },
}

const categoryConfig = {
  Donasi: { label: 'Donasi', color: '#2563eb' },
  Program: { label: 'Program', color: '#0f766e' },
  Kemitraan: { label: 'Kemitraan', color: '#f59e0b' },
  Operasional: { label: 'Operasional', color: '#ea580c' },
  Utilitas: { label: 'Utilitas', color: '#dc2626' },
} as const

export function DashboardCharts() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard
        title="Arus Bulanan"
        description="Bandingkan tren pemasukan dan pengeluaran lima bulan terakhir."
      >
        <ChartContainer config={incomeConfig} className="h-72 w-full">
          <BarChart data={monthlyIncomeData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" radius={[10, 10, 0, 0]} fill="var(--color-total)" />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title="Biaya Operasional"
        description="Grafik biaya bulanan untuk memantau tekanan kas operasional."
      >
        <ChartContainer config={expenseConfig} className="h-72 w-full">
          <BarChart data={monthlyExpenseData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" radius={[10, 10, 0, 0]} fill="var(--color-total)" />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title="Komposisi Pemasukan"
        description="Distribusi sumber dana yang masuk sepanjang bulan berjalan."
      >
        <ChartContainer config={categoryConfig} className="h-72 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={incomeCategoryData} dataKey="value" nameKey="name" innerRadius={62} strokeWidth={0}>
              {incomeCategoryData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title="Komposisi Pengeluaran"
        description="Area biaya yang paling banyak menyerap kas organisasi."
      >
        <ChartContainer config={categoryConfig} className="h-72 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={expenseCategoryData} dataKey="value" nameKey="name" innerRadius={62} strokeWidth={0}>
              {expenseCategoryData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </ChartCard>
    </div>
  )
}

