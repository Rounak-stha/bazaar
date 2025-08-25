import 'server-only'

import { notFound } from 'next/navigation'
import { FC, type ReactNode } from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { OneStepWithSummary } from './variants/OneStepWithSummary'
import { Shop } from '@/payload-types'
import { getEnabledProviders } from '@/payments'

type CheckoutProps = {
  shop: Shop
}

export const Checkout: FC<CheckoutProps> = async ({ shop }) => {
  try {
    const { checkout } = await getCachedGlobal('shopLayout', shop.id)()
    const paymentProvider = await getCachedGlobal('paymentProviders', shop.id)()
    const enabledPaymentProviders = getEnabledProviders(paymentProvider)

    let CheckoutComponent: ReactNode = null
    switch (checkout.type) {
      case 'OneStepWithSummary':
        CheckoutComponent = <OneStepWithSummary paymentProviders={enabledPaymentProviders} />
        break
    }

    if (!CheckoutComponent) {
      notFound()
    }

    return CheckoutComponent
  } catch (error) {
    console.log(error)
    notFound()
  }
}
