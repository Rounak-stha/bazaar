import { FC } from 'react'
import { CheckoutForm } from './components/CheckoutForm'
import { CheckoutPageVariantProps } from '@/types/checkout'

export const OneStepWithSummary: FC<CheckoutPageVariantProps> = async ({ paymentProviders }) => {
  return (
    <div className="container">
      <div className="pt-4 pb-24">
        <h2 className="sr-only">Checkout</h2>
        <CheckoutForm paymentProviders={paymentProviders} />
      </div>
    </div>
  )
}
