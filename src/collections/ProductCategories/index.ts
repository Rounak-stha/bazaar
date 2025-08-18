import { type CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { slugField } from '@/fields/slug'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'

export const ProductCategories: CollectionConfig = {
  slug: 'productCategories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: superAdminOrTenantAdminAccess,
    read: anyone,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'title',
      label: 'Category name',
      type: 'text',
      required: true,
      localized: true,
    },
    ...slugField(),
    {
      name: 'products',
      label: 'Products in this category',
      type: 'join',
      collection: 'products',
      on: 'categories.category',
    },
  ],
}
