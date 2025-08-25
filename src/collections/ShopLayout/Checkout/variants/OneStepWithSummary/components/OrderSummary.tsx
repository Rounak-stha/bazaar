import { PriceClient } from '@/components/PriceClient'

import { type Currency } from '@/stores/Currency/types'
import { CartProductList } from '@/components/(storefront)/Cart/components/cartProductList'
import { Cart, CartToCheckout } from '@/stores/CartStore/types'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'
import { calculateCartCost } from '@/utilities/cart/syncCart'

/**
 * This function merges two arrays of objects with currency and value, summing up the values with the same currency.
 * @param arr1 - array of objects with currency and value
 * @param arr2 - array of objects with currency and value
 * @returns - merged array of objects with currency and value
 */
const mergeAmounts = (
  arr1: { currency: Currency; value: number }[] | undefined,
  arr2: { currency: Currency; value: number }[] | undefined,
) => {
  const merged = new Map<Currency, number>()

  arr1?.forEach((item) => {
    merged.set(item.currency, (merged.get(item.currency) ?? 0) + item.value)
  })

  arr2?.forEach((item) => {
    merged.set(item.currency, (merged.get(item.currency) ?? 0) + item.value)
  })

  return Array.from(merged).map(([currency, value]) => ({ currency, value }))
}

export const OrderSummary = ({ cart, errorMessage }: { cart: Cart; errorMessage?: string }) => {
  // const totalPriceWithShipping = mergeAmounts(cartToCheckout.total, shippingCost)
  const cartPrice = useMemo(() => calculateCartCost(cart), [cart])

  return (
    <div className="mt-10 lg:sticky lg:top-28 lg:mt-0 lg:h-fit">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
        <h3 className="sr-only">Items In Cart</h3>
        <CartProductList />
        <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">
              <PriceClient pricing={[{ currency: 'Rs', value: cartPrice }]} />
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm">Shipping</dt>
            <dd className="text-sm font-medium text-gray-900">
              <PriceClient pricing={[{ currency: 'Rs', value: 0 }]} />
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base font-medium">Total</dt>
            <dd className="text-base font-medium text-gray-900">
              <PriceClient pricing={[{ currency: 'Rs', value: cartPrice }]} />
            </dd>
          </div>
        </dl>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <Button type="submit" size="lg" className="w-full">
            Confirm Order
          </Button>
        </div>
      </div>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  )
}
