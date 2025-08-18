'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { ShippingAddressForm } from '@/components/ShippingAddressForm'
import { Form } from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { type ProductWithFilledVariants } from '@/globals/ShopLayout/Cart/variants/SlideOver'
import { Address, type Customer, type Media } from '@/payload-types'
import { type CheckoutFormData, useCheckoutFormSchema } from '@/schemas/checkoutForm.schema'
import { useCart } from '@/stores/CartStore'
import { type Cart } from '@/stores/CartStore/types'
import { useCurrency } from '@/stores/Currency'
import { type Currency } from '@/stores/Currency/types'

import { OrderSummary } from './OrderSummary'
import { useDebounce } from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'

export type FilledCourier = {
  slug: string
  title: string
  turnaround: string
  icon?: Media
  pricing:
    | {
        value: number
        currency: Currency
        id?: string | null
      }[]
    | undefined
}

type CheckoutFormProps = {
  user?: Customer
  addresses?: Address[]
}

export const CheckoutForm = ({ addresses }: CheckoutFormProps) => {
  const { CheckoutFormSchema } = useCheckoutFormSchema()

  const shippingAddresses = addresses && addresses.length > 0 ? addresses : null

  const defaultShippingAddress = shippingAddresses
    ? (shippingAddresses.find((address) => address.isDefault) ?? shippingAddresses[0])
    : null

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      shipping: {
        fullName: defaultShippingAddress?.fullName ?? '',
        province: defaultShippingAddress?.province ?? 'Bagmati',
        city: defaultShippingAddress?.city ?? '',
        street: defaultShippingAddress?.street ?? '',
        phone: defaultShippingAddress?.phone ?? '',
        email: defaultShippingAddress?.email ?? '',
      },
    },
  })

  const shipping = useWatch({ control: form.control, name: 'shipping' })

  const [checkoutProducts, setCheckoutProducts] = useState<ProductWithFilledVariants[]>()
  const [totalPrice, setTotalPrice] = useState<
    {
      currency: Currency
      value: number
    }[]
  >()

  const { cart, setCart } = useCart()
  const currency = useCurrency()

  /**
   * Fetches products from the cart, calculates the total price and available couriers with their prices. Basically, it's getting all checkout needed data.
   * @param cartToCalculate - Actual cart to calculate the total price and available couriers.
   * @param countryToCalculate - Country to get available couriers.
   */
  const fetchCartProducts = useCallback(
    async (cartToCalculate: Cart | null) => {
      try {
        const { data } = await axios.post<{
          status: number
          productsWithTotalAndCouriers: {
            filledProducts: ProductWithFilledVariants[]
            total: {
              currency: Currency
              value: number
            }[]
            totalQuantity: number
            couriers: FilledCourier[]
          }
        }>('/api/checkout', { cart: cartToCalculate })
        const { filledProducts, total } = data.productsWithTotalAndCouriers
        setCheckoutProducts(filledProducts)
        setTotalPrice(total)
      } catch (error) {
        console.error(error)
      }
    },
    [setCheckoutProducts, setTotalPrice],
  )

  const debouncedFetchCartProducts = useMemo(() => fetchCartProducts, [fetchCartProducts])

  useEffect(() => {
    void debouncedFetchCartProducts(cart)
  }, [cart, debouncedFetchCartProducts])

  const router = useRouter()

  const onSubmit = async (values: CheckoutFormData) => {
    try {
      const { data } = await axios.post<{ status: number; url?: string }>('/api/payment', {
        cart,
        checkoutData: values,
        currency: currency.currency,
      })
      if (data.status === 200 && data.url) {
        setCart(null)
        router.push(data.url)
      } else {
        form.setError('root', { message: 'Internal Server Error' })
      }
    } catch (error) {
      form.setError('root', { message: 'Internal Server Error' })
      console.log(error)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
        >
          <div>
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {shippingAddresses ? (
                  <div className="group ring-main-500 relative flex cursor-pointer rounded-lg border border-gray-300 border-transparent bg-white p-4 shadow-xs ring-2 focus:outline-hidden">
                    <span className="flex flex-1">
                      <span className="flex w-full flex-col">
                        <span className="block text-sm font-medium text-gray-900">
                          {shipping.fullName}
                        </span>
                        <span className="mt-1 flex items-center text-sm text-gray-500">
                          {shipping.province}
                        </span>
                        <span className="mt-1 text-sm font-medium text-gray-500">
                          {shipping.city}, {shipping.street}
                        </span>
                        <span className="mt-1 flex items-center text-sm text-gray-500">
                          {shipping.phone}
                        </span>
                        <span className="mt-1 flex items-center text-sm text-gray-500">
                          {shipping.email}
                        </span>
                      </span>
                    </span>
                  </div>
                ) : (
                  <ShippingAddressForm />
                )}
              </div>
            </div>
            {/*
            <div className="mt-10 border-t border-gray-200 pt-10">
              <fieldset>
                <legend className="text-lg font-medium text-gray-900">{t("delivery-method")}</legend>
                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-4 grid grid-cols-1 gap-y-3 sm:gap-x-4"
                    >
                      {deliveryMethods.map((deliveryMethod) => (
                        <Radio
                          key={deliveryMethod.slug}
                          value={deliveryMethod.slug}
                          aria-label={deliveryMethod.title}
                          aria-description={`${deliveryMethod.turnaround} for price`}
                          className="group data-focus:ring-main-500 relative flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white p-4 shadow-xs focus:outline-hidden data-checked:border-transparent data-focus:ring-2"
                        >
                          <span
                            aria-hidden="true"
                            className="group-data-checked:border-main-500 pointer-events-none absolute -inset-px rounded-lg border border-transparent group-data-focus:border"
                          />

                          <DeliveryMethod geowidgetToken={geowidgetToken} deliveryMethod={deliveryMethod} />
                        </Radio>
                      ))}
                      {deliveryMethods.length === 0 && <p>{t("no-shipping")}</p>}
                      <FormMessage />
                    </RadioGroup>
                  )}
                />
              </fieldset>
            </div> */}
          </div>
          <OrderSummary
            products={checkoutProducts}
            totalPrice={totalPrice}
            // shippingCost={deliveryMethods.find((method) => method.slug === selectedDelivery)?.pricing}
            errorMessage={form.formState.errors.root?.message}
          />
        </form>
      </Form>
    </>
  )
}
