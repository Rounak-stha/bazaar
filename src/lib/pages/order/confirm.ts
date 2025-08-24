import { getPayload } from 'payload'

import config from '@payload-config'

import { createLookupArgs, getHandlerForProvider, isProviderEnabled } from '@/payments'
import { PaymentProviderName } from '@/payments/types'
import { SearchParams } from '@/types/next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedShopByDomain } from '@/utilities/shop/getShop'
import { Transaction } from '@/payload-types'

type OrderConfirmPageParams = { domain: string; provider: PaymentProviderName }

export type OrderConfirmPageProps = {
  params: Promise<OrderConfirmPageParams>
  searchParams: Promise<SearchParams>
}

async function getTransaction(transactionId: string, pidx: string) {
  const payload = await getPayload({ config })

  const paginatedTransactionData = await payload.find({
    collection: 'transactions',
    where: {
      and: [
        {
          id: {
            equals: transactionId,
          },
        },
        {
          providerTransactionId: {
            equals: pidx,
          },
        },
      ],
    },
    select: {
      id: true,
      status: true,
      order: true,
    },
    limit: 1,
  })

  if (paginatedTransactionData.totalDocs == 0) return null
  return paginatedTransactionData.docs[0]
}

async function updateTransactionStatus(transactionId: string, status: Transaction['status']) {
  const payload = await getPayload({ config })
  await payload.update({
    collection: 'transactions',
    id: transactionId,
    data: {
      status,
    },
  })
}

async function getOrder(orderId: string) {
  const payload = await getPayload({ config })
  const paginatedOrderData = await payload.find({
    collection: 'orders',
    where: {
      id: {
        equals: orderId,
      },
    },
  })

  if (paginatedOrderData.totalDocs == 0) return null
  return paginatedOrderData.docs[0]
}

export async function validateOrderConfirmPage(
  params: OrderConfirmPageParams,
  searchParams: SearchParams,
) {
  const { provider, domain } = params

  const shop = await getCachedShopByDomain(domain)()

  if (!shop) throw new Error('Invalid Page')

  const paymentProviderDoc = await getCachedGlobal('paymentProviders', shop.id)()

  if (!paymentProviderDoc) throw new Error('Invalid Page')
  if (!isProviderEnabled(provider, paymentProviderDoc)) throw new Error('Invalid Page')

  const handler = getHandlerForProvider(provider)

  if (!handler) throw new Error('Invalid Page')

  const lookupArgs = createLookupArgs({
    paymentProvider: provider,
    params: searchParams,
    paymentDoc: paymentProviderDoc,
  })

  const transaction = await getTransaction(lookupArgs.data.purchase_order_id, lookupArgs.data.pidx)

  if (!transaction) throw new Error('Invalid Page')

  const { status } = await handler.lookup(lookupArgs)

  await updateTransactionStatus(transaction.id, status)

  const order = await getOrder(
    typeof transaction.order == 'string' ? transaction.order : transaction.order.id,
  )

  return {
    status,
    order,
  }
}
