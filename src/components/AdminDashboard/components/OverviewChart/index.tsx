'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type CustomTooltipProps,
} from '@/components/ui/chart'

type ChartData = {
  name: string
  orders: number
  revenue: number
}

export const OverviewChart = () => {
  const [ChartData, setChartData] = useState<ChartData[] | undefined>()

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axios.get<ChartData[]>('/api/orders/chart', {
          withCredentials: true,
        })
        setChartData(data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchChartData()
  }, [])

  const chartConfig = {
    revenue: {
      label: 'Revenue',
    },
    orders: {
      label: 'Orders',
    },
  } satisfies ChartConfig
  return (
    <Card className="lg:col-span-4 bg-transparent">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="mt-6">
        <ResponsiveContainer width="100%" height={500}>
          <ChartContainer config={chartConfig}>
            <BarChart data={ChartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => value.slice(0, 3)}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={(props: CustomTooltipProps) => (
                  <ChartTooltipContent {...props} className="text-sm" />
                )}
              />
              <Bar dataKey="revenue" fill="var(--chart-3)" stackId="a" />
              <Bar dataKey="orders" fill="var(--chart-3)" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
