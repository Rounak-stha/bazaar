import { Button } from '@/components/ui/button'
import { type EntityToGroup, EntityType, groupNavItems } from '@payloadcms/ui/shared'
import { getAccessResults, type PayloadRequest } from 'payload'

import { AdminDatePicker } from './components/AdminDatePicker'
import { AdminViews } from './components/views'
import Link from 'next/link'

export const AdminDashboard = async (req: PayloadRequest) => {
  const payload = req.payload
  return (
    <main className="gutter--left gutter--right dashboard__wrap">
      <section className="flex flex-wrap items-center gap-4">
        <h1 className="mr-auto">Dashboard</h1>
        <Button size="sm" asChild>
          <Link href="/admin/collections/products/create" prefetch={false}>
            Add Product
          </Link>
        </Button>
      </section>
      <section className="twp my-6 flex flex-col justify-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <AdminDatePicker />
      </section>
      <AdminViews />
    </main>
  )
}
