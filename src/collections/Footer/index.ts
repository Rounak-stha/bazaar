import type { CollectionConfig } from 'payload'

import { link } from '@/fields/link'
import { FooterSlug } from '@/globals/constants'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: CollectionConfig = {
  slug: FooterSlug,
  labels: {
    singular: 'Footer',
    plural: 'Footer',
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
          RowLabel: '@/collections/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
