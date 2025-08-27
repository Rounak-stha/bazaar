import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'
import { ensureSingleShop } from './hooks/ensureSingleShop'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: superAdminOrTenantAdminAccess,
    read: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  hooks: {
    beforeChange: [ensureSingleShop],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['shop-admin'],
      hasMany: true,
      options: ['super-admin', 'shop-admin'],
      access: {
        update: ({ req }) => {
          return req.user?.collection == 'users' && isSuperAdmin(req.user)
        },
      },
    },
  ],
  timestamps: true,
}
