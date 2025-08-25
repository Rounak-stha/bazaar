import { FormField, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PaymentProviderName } from '@/payments/types'
import { CheckoutFormData } from '@/schemas/checkoutForm.schema'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'

type SelectPaymentProviderProps = {
  paymentProviders: PaymentProviderName[]
}

export function SelectPaymentProvider({ paymentProviders }: SelectPaymentProviderProps) {
  const form = useFormContext<CheckoutFormData>()
  return (
    <>
      <fieldset>
        <legend className="text-lg font-medium text-gray-900">Payment Provider</legend>
        <FormField
          control={form.control}
          name="paymentProvider"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onChange={field.onChange}
              className="mt-4 flex gap-2 flex-wrap"
            >
              {paymentProviders.map((provider) => (
                <>
                  <RadioGroupItem
                    key={provider}
                    id={`payment-provider-${provider}`}
                    value={provider}
                    aria-label={provider}
                    aria-description={`Payment Provider ${provider}`}
                    className="peer hidden"
                  />
                  <Label
                    htmlFor={`payment-provider-${provider}`}
                    className="p-1 border peer-data-[state=checked]:border-primary rounded-lg"
                  >
                    <PaymentProvider provider={paymentProviders} />
                  </Label>
                </>
              ))}
              {paymentProviders.length === 0 && <p>No Payment Provider Configured for Shop</p>}
              <FormMessage />
            </RadioGroup>
          )}
        />
      </fieldset>
    </>
  )
}

function PaymentProvider({}: { provider: PaymentProviderName[] }) {
  return <Image src="/assets/Khalti-Logo.png" alt="Khalti Logo" height={80} width={80} />
}
