import { CollectionConfig } from 'payload'
import { PaymentProviderSlug } from '@/globals/constants'
import { revalidatePaymentProviders } from './hooks/revalidatePaymentProviders'
import { Payment_Provider_Khalti } from '@/payments/lib/constants'

export const PaymentProviders: CollectionConfig = {
  slug: PaymentProviderSlug,
  labels: {
    singular: 'Payment Provider',
    plural: 'Payment Providers',
  },
  admin: {
    useAsTitle: 'id',
    hideAPIURL: true,
    group: 'Shop Settings',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidatePaymentProviders],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Khalti',
          name: Payment_Provider_Khalti,
          fields: [
            { name: 'enabled', type: 'checkbox', required: true, defaultValue: false },
            {
              name: 'config',
              type: 'group',
              admin: { condition: (_data, siblingData) => Boolean(siblingData?.enabled) },
              fields: [
                {
                  name: 'liveSecretKey',
                  label: 'Live Secret Key',
                  type: 'text',
                  required: true,
                  admin: { description: 'Get the `Live Secret Key` from Khalti merchant settings' },
                },
                {
                  name: 'livePublicKey',
                  label: 'Live Public Key',
                  type: 'text',
                  admin: { description: 'Get the `Live Public Key` from Khalti merchant settings' },
                },
              ],
            },
          ],
        },

        // Add more providers as parallel groups here in the future.
      ],
    },
  ],
}
