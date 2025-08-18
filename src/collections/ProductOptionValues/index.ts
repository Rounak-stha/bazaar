import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'
import { anyone } from '@/access/anyone'

export const ProductOptionValues: CollectionConfig = {
  slug: 'productOptionValues',
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: anyone,
    update: superAdminOrTenantAdminAccess,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        // delete all values referencing this option
        await req.payload.delete({
          collection: 'productOptionValues',
          where: {
            option: {
              equals: id,
            },
          },
        })
      },
    ],
  },
  fields: [
    {
      name: 'productOptionType',
      type: 'relationship',
      admin: { readOnly: true },
      relationTo: 'productOptions',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
