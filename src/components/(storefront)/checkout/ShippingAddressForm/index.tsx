'use client'
import { useFormContext } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type CheckoutFormData } from '@/schemas/checkoutForm.schema'

export const ShippingAddressForm = () => {
  const form = useFormContext<CheckoutFormData>()
  return (
    <>
      <FormField
        control={form.control}
        name="shipping.fullName"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Fullname</FormLabel>
            <FormControl>
              <Input placeholder="fullname" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shipping.email"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shipping.phone"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="Phone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shipping.province"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Province</FormLabel>
            <FormControl>
              <Input placeholder="Province" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shipping.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input placeholder="City" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shipping.street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street</FormLabel>
            <FormControl>
              <Input placeholder="Street" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
