import type { CollectionConfig } from 'payload'

import { link } from '@/fields/link'
import { HeaderSlug } from '@/globals/constants'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: CollectionConfig = {
  slug: HeaderSlug,
  labels: {
    singular: 'Header',
    plural: 'Header',
  },
  admin: {
    group: 'Shop Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/collections/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
