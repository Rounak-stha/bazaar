import type { CollectionConfig } from 'payload'

import { getChartData } from '@/endpoints/adminDashboard/getChartData'
import { getOrderCount } from '@/endpoints/adminDashboard/getOrderCount'
import { getRevenue } from '@/endpoints/adminDashboard/getRevenue'

import { commonAddressFields } from '@/fields/address/fields'
import { anyone } from '@/access/anyone'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'
import { snapshotOrderItems } from './hooks/snapshotOrderItems'
import { pricingField } from '@/fields/pricing'

export const Order: CollectionConfig = {
  slug: 'orders',
  access: {
    create: anyone,
    // update: not sure what to do here as unauthenticated user can create an order
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  admin: {
    useAsTitle: 'id',
    hideAPIURL: true,
    defaultColumns: ['id', 'customer', 'shippingAddress.province'],
  },
  endpoints: [
    {
      path: '/revenue',
      method: 'post',
      handler: getRevenue,
    },
    {
      path: '/count',
      method: 'post',
      handler: getOrderCount,
    },
    {
      path: '/chart',
      method: 'get',
      handler: getChartData,
    },
  ],
  labels: {
    singular: 'Order',
    plural: 'Orders',
  },
  hooks: {
    beforeValidate: [snapshotOrderItems],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        // readOnly: true
      },
      required: true,
      fields: [
        // References
        { name: 'productId', type: 'text', required: true },
        { name: 'variantId', type: 'text', required: true },

        // Display
        { name: 'productTitle', type: 'text', required: true },
        { name: 'variantName', type: 'text', required: true },
        { name: 'sku', type: 'text', required: true },

        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'type', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },

        pricingField,

        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'quantity', type: 'number', min: 1, required: true },
      ],
    },

    {
      name: 'shippingAddress',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'address',
          type: 'relationship',
          relationTo: 'addresses',
        },
        ...commonAddressFields,
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      // admin: { readOnly: true },
    },
    {
      name: 'shippingCost',
      type: 'number',
      required: true,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      // admin: { readOnly: true },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: ['unpaid', 'paid', 'refunded', 'failed', 'cancelled'],
      defaultValue: 'unpaid',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
