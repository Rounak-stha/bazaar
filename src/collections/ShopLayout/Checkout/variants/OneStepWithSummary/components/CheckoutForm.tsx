'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'

import { ShippingAddressForm } from '@/components/(storefront)/checkout/ShippingAddressForm'
import { Form } from '@/components/ui/form'

import { type CheckoutFormData, useCheckoutFormSchema } from '@/schemas/checkoutForm.schema'
import { useCart } from '@/stores/CartStore'

import { OrderSummary } from './OrderSummary'
import { CheckoutData, CheckoutPageVariantProps } from '@/types/checkout'
import { SelectPaymentProvider } from '@/components/(storefront)/checkout/PaymentProvider'
import { FC } from 'react'

export const CheckoutForm: FC<CheckoutPageVariantProps> = ({ paymentProviders }) => {
  const { CheckoutFormSchema } = useCheckoutFormSchema()

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutFormSchema),
  })

  const { cart, setCart } = useCart()

  const onSubmit = async (values: CheckoutFormData) => {
    try {
      const { data, status } = await axios.post<{ redirectUrl: string }>('/api/checkout/payment', {
        cart,
        paymentProvider: values.paymentProvider,
        address: values.shipping,
      } as CheckoutData)
      if (status === 200 && data.redirectUrl) {
        setCart([])
        window.location.href = data.redirectUrl
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
            <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <ShippingAddressForm />
            </div>
            <div className="mt-10 border-t border-gray-200 pt-10">
              <SelectPaymentProvider paymentProviders={paymentProviders} />
            </div>
          </div>
          <OrderSummary cart={cart} errorMessage={form.formState.errors.root?.message} />
        </form>
      </Form>
    </>
  )
}
