'use client'

import { useCurrency } from '@/stores/Currency'
import { formatPrice } from '@/utilities/formatPrices'

export const PriceClient = ({
  pricing,
}: {
  pricing: {
    value: number
    currency: string
  }
}) => {
  const { currency } = useCurrency()
  const price = pricing.value

  return <>{formatPrice(price, currency)}</>
}
