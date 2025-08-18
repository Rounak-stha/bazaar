import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'
import { anyone } from '@/access/anyone'
import { deleteChildOptionValues } from './hooks/deleteChildOptionValues'

export const ProductOptions: CollectionConfig = {
  slug: 'productOptions',
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: anyone,
    update: superAdminOrTenantAdminAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeDelete: [deleteChildOptionValues],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name', // ex: Color, Size
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Generic', value: 'generic' },
            { label: 'Color', value: 'color' },
            { label: 'Fabric', value: 'fabric' },
          ],
          defaultValue: 'generic',
          required: true,
        },
      ],
    },
    {
      name: 'values',
      type: 'join',
      collection: 'productOptionValues',
      on: 'productOptionType',
      orderable: true,
    },
  ],
}
