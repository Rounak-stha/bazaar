import { commonAddressFields } from '@/fields/address/fields'
import type { CollectionConfig } from 'payload'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'customers',
      required: false,
    },
    {
      name: 'isDefault',
      label: 'Is Default',
      type: 'checkbox',
    },
    ...commonAddressFields,
  ],
}
