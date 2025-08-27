import { commonAddressFields } from '@/fields/address/fields'
import type { CollectionConfig } from 'payload'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  labels: {
    singular: 'Address',
    plural: 'Addresses',
  },
  admin: {
    hidden: true,
  },
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
