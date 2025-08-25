import { Address } from '@/payload-types'
import { PaymentProviderName } from '@/payments/types'
import { z, type ZodType } from 'zod'

const provinces: Address['province'][] = [
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudhurpaschim',
]

const paymentProviders: PaymentProviderName[] = ['khalti']

export const CheckoutFormSchema = z.object({
  shipping: z.object({
    fullName: z.string(),
    province: z.enum(provinces),
    city: z.string(),
    street: z.string(),
    email: z.email().optional(),
    phone: z.string(),
  }),
  paymentProvider: z.enum(paymentProviders),
})

export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>

export const useCheckoutFormSchema = () => {
  const RefinedCheckoutFormSchema = CheckoutFormSchema.check()

  const CheckoutFormSchemaResolver: ZodType<CheckoutFormData> = RefinedCheckoutFormSchema

  const ShippingSchema = z.object({
    shipping: CheckoutFormSchema.shape.shipping,
  })

  return {
    CheckoutFormSchema,
    CheckoutFormSchemaResolver,
    ShippingFormSchemaResolver: ShippingSchema,
  }
}
