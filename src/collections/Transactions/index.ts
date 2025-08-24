import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'
import { CollectionConfig } from 'payload'
import { updateRelatedRecordOnSuccess } from './hooks/updateRelatedRecordOnSuccess'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  access: {
    read: superAdminOrTenantAdminAccess,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'tenant', 'provider', 'amount', 'currency', 'status'],
  },
  hooks: {
    afterChange: [updateRelatedRecordOnSuccess],
  },
  fields: [
    {
      // Transaction records are not manualy created
      // Payment Providers are abstracted by the Payment Providers collection and its implementation
      // provider is automatically set
      name: 'provider',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'currency',
          type: 'text',
          required: true,
          maxLength: 3, // ISO 4217 (USD, NPR, etc.)
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Expired', value: 'expired' },
        { label: 'Failed', value: 'failed' },
        { label: 'User Cancelled', value: 'user_cancelled' },
      ],
      index: true,
    },
    {
      name: 'providerTransactionId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Raw provider response for debugging or reconciliation.',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      index: true,
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      index: true,
    },
  ],
  timestamps: true,
}
