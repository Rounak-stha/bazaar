'use client'

import { PaymentFailure } from './components/paymentFailure'

export default function Error() {
  return <PaymentFailure failure="failed" />
}
