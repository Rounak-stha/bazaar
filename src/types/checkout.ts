import { Address } from '@/payload-types'
import { PaymentProviderName } from '@/payments/types'
import { Cart } from '@/stores/CartStore/types'

export type CheckoutData = {
  cart: Cart
  paymentProvider: PaymentProviderName
  address: Address
  cost: {
    subTotal: number
    total: number
    currency: string
  }
}
