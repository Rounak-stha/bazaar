import { revalidateGlobal } from '@/hooks/revalidateGlobal'

import type { GlobalConfig } from 'payload'

export const ImageSettings: GlobalConfig = {
  slug: 'imageSettings',
  label: 'Image Settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Shop settings',
  },
  fields: [
    {
      name: 'productAspectRatio',
      type: 'select',
      label: 'Product Aspect Ratio',
      admin: {
        description:
          'The aspect ratio select will affect how the uploaded images will be processed and displayed in the UI',
      },
      options: [
        { label: '1:1 (Square)', value: '1:1' },
        { label: '3:2', value: '3:2' },
        { label: '4:3', value: '4:3' },
        { label: '16:9', value: '16:9' },
      ],
      defaultValue: '1:1',
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
