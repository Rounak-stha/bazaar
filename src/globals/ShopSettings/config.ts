import { revalidateGlobal } from '@/hooks/revalidateGlobal'

import type { GlobalConfig } from 'payload'

export const ShopSettings: GlobalConfig = {
  slug: 'shopSettings',
  label: 'General',
  access: {
    read: () => true,
  },
  admin: {
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
      hasMany: true,
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
