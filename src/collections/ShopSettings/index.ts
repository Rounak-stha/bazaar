import type { CollectionConfig } from 'payload'

import { ShopSettingsSlug } from '@/globals/constants'
import { revalidateShopSettings } from './hooks/revalidateShopSettings'

export const ShopSettings: CollectionConfig = {
  slug: ShopSettingsSlug,
  labels: {
    singular: 'General',
    plural: 'General',
  },
  access: {
    read: () => true,
  },
  admin: {
    hideAPIURL: true,
    group: 'Shop settings',
  },
  fields: [
    {
      name: 'availableCurrencies',
      type: 'select',
      label: 'Available currencies',

      options: [{ value: 'NPR', label: 'NPR' }],
      admin: {
        description: 'Supported currencies by your shop',
      },
      defaultValue: 'NPR',
      hasMany: true,
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateShopSettings],
  },
}
