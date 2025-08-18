import { type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const OverviewCard = ({
  label,
  value,
  percentage,
  icon,
}: {
  label: string
  value: string | number
  percentage: number
  icon: ReactNode
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-medium">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="mt-1 text-sm opacity-75">+{percentage}% from last month</p>
      </CardContent>
    </Card>
  )
}
