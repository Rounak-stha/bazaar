import type { CollectionConfig } from 'payload'

import { updateAndDeleteAccess } from './access/updateAndDelete'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'

export const Shops: CollectionConfig = {
  slug: 'shops',
  labels: {
    singular: 'Shop',
    plural: 'Shops',
  },
  access: {
    create: () => true,
    delete: updateAndDeleteAccess,
    read: superAdminOrTenantAdminAccess,
    update: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Used for domain-based tenant handling',
      },
      index: true,
      unique: true,
      required: true,
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
    },
  ],
}
