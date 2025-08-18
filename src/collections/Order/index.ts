import type { CollectionConfig } from 'payload'

import { getChartData } from '@/endpoints/adminDashboard/getChartData'
import { getOrderCount } from '@/endpoints/adminDashboard/getOrderCount'
import { getRevenue } from '@/endpoints/adminDashboard/getRevenue'
import { currencyField } from '@/fields/currencyField'

import { generateID } from './hooks/generateID'
import { commonAddressFields } from '@/fields/address/fields'
import { anyone } from '@/access/anyone'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'

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
    beforeValidate: [generateID],
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      admin: {
        hidden: true,
      },
      required: true,
      unique: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'variantSlug',
          type: 'text',
          required: false, // required only if variants are used
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        currencyField,
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          // admin: { readOnly: true },
        },
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
          required: true,
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
      options: ['unpaid', 'paid', 'refunded'],
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
