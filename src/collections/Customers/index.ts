import { revalidateTag } from 'next/cache'
import { type CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  access: {
    create: () => true,
  },
  labels: {
    singular: 'Customer',
    plural: 'Customers list',
  },
  admin: {
    group: 'Clients',
    defaultColumns: ['fullName', 'email', 'createdAt', 'updatedAt'],
    useAsTitle: 'fullName',
  },
  auth: {
    maxLoginAttempts: 30,
    lockTime: 30 * 1000,
    verify: true,
  },
  hooks: {
    // afterOperation: [createTokenAndSendEmail],
    afterLogin: [
      async () => {
        revalidateTag('user-auth')
      },
    ],
    beforeChange: [
      async ({ data }) => {
        return { ...data, fullName: `${data.firstName} ${data.lastName}` }
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
        },
      ],
    },
    {
      name: 'cart',
      type: 'json',
      label: {
        en: 'Cart',
        pl: 'Koszyk',
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'wishlist',
      type: 'json',
      label: {
        en: 'Wishlist',
        pl: 'Lista życzeń',
      },
      admin: {
        hidden: true,
      },
    },
  ],
}
