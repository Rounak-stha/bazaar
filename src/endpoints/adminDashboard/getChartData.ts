import { format, startOfYear, endOfYear } from 'date-fns'
import { type PayloadRequest, type Where } from 'payload'

import { type Order } from '@/payload-types'

export type ChartData = {
  name: string
  orders: number
  revenue: number
}

export const getChartData = async (req: PayloadRequest) => {
  try {
    const payload = req.payload

    if (req.method !== 'GET') {
      return Response.json({ message: 'Method not allowed' }, { status: 405 })
    }

    if (req.user?.collection !== 'users') {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const currentYear = new Date().getFullYear()
    const startDate = startOfYear(new Date(currentYear, 0)).toISOString()
    const endDate = endOfYear(new Date(currentYear, 0)).toISOString()

    const whereQuery: Where = {
      createdAt: {
        greater_than_equal: startDate,
        less_than_equal: endDate,
      },
    }

    const { docs } = await payload.find({
      collection: 'orders',
      depth: 1,
      pagination: false,
      select: {
        orderDetails: {
          total: true,
          currency: true,
        },
        createdAt: true,
      },
      where: whereQuery,
    })

    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      name: format(new Date(currentYear, index), 'MMM').toLowerCase(),
      orders: 0,
      revenue: 0,
    }))

    docs.forEach((doc: Order) => {
      const orderDate = new Date(doc.createdAt)
      const monthIndex = orderDate.getMonth()
      const revenue = doc.total

      monthlyData[monthIndex].orders++
      monthlyData[monthIndex].revenue += revenue
    })

    monthlyData.forEach((month) => {
      month.revenue = Number(month.revenue.toFixed(2))
    })

    return Response.json(monthlyData, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
