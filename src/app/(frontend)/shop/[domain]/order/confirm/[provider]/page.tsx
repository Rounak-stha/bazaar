import { type OrderConfirmPageProps, validateOrderConfirmPage } from '@/lib/pages/order/confirm'
import { OrderConfirmation } from './components/confirmation'
import { PaymentFailure } from './components/paymentFailure'
import { PaymentPending } from './components/paymentPending'

export default async function OrderConfirmedPage({ params, searchParams }: OrderConfirmPageProps) {
  const awaitedParams = await params
  const awaitedSearchParams = await searchParams

  const { status, order } = await validateOrderConfirmPage(awaitedParams, awaitedSearchParams)

  if (status == 'success') return <OrderConfirmation order={order} />
  if (status == 'pending') return <PaymentPending order={order} />
  if (status == 'failed' || status == 'expired' || status == 'user_cancelled')
    return <PaymentFailure order={order} failure={status} />
  return null
}
