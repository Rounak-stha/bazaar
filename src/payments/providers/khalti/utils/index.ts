import { PaymentProvider, Transaction, TransactionsSelect } from '@/payload-types'
import { KhaltiCallbackData, KhaltiLookupStatus } from '@/payments/types'
import { StringToString } from '@/types/utilities'

/**
 * Runtime helpers: safe typed access to an enabled provider config
 */
export function isKhaltiEnabled(doc: PaymentProvider): boolean {
  return Boolean(doc.khalti.enabled)
}

export function parseCallbackParams(params: StringToString): KhaltiCallbackData {
  return {
    pidx: params.pidx,
    purchase_order_id: params.purchase_order_id,
    status: params.status as KhaltiCallbackData['status'],
    transaction_id: params.transaction_id,
  }
}

export function parseKhaltiLookupStatus(status: KhaltiLookupStatus): Transaction['status'] {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'Pending':
    case 'Initiated':
    case 'Refunded':
    case 'Expired':
    case 'User canceled':
    case 'Pending':
    case 'Initiated':
      return 'pending'
    case 'Refunded':
      return 'refunded'
    case 'Expired':
      return 'expired'
    case 'User canceled':
      return 'user_cancelled'
  }
}
