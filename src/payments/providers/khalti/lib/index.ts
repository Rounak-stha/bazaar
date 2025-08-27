import { isDevelopment } from '@/lib/isdevelopment'
import { getShopUrl, Paths } from '@/lib/url'
import {
  CheckoutSessionCreateData,
  KhaltiSessionArgs,
  ProviderHandler,
  KhaltiLookupArgs,
  LookupArgsCreateData,
  KhaltiLookupStatus,
} from '@/payments/types'
import { KHALTI_DEV_ENDPOINT, KHALTI_PROD_ENDPOINT } from '../constants'
import { PAYMENT_INITIATE_API_PATH, PAYMENT_LOOKUP_API_PATH } from '@/payments/lib/constants'
import { parseCallbackParams, parseKhaltiLookupStatus } from '../utils'
import { parseSearchParamsValueAsString } from '@/utilities/searchParams'

export function createKhaltiSessionArgs(args: CheckoutSessionCreateData): KhaltiSessionArgs {
  const { shop, paymentDoc, order, transaction } = args
  const shopUrl = getShopUrl(shop.domain)

  const liveSecretKey = args.paymentDoc.khalti.config?.liveSecretKey

  if (!liveSecretKey) throw new Error('Khalti Payment not configured')

  return {
    name: 'khalti',
    config: {
      liveSecretKey: liveSecretKey,
      livePublicKey: paymentDoc.khalti.config?.livePublicKey,
    },
    data: {
      amount: transaction.amount * 100, // In Paisa
      purchase_order_id: transaction.id,
      purchase_order_name: order.id,
      return_url: shopUrl + Paths.orderConfirm('khalti'),
      website_url: shopUrl,
    },
  }
}

export function createKhaltiLookupArgs(args: LookupArgsCreateData): KhaltiLookupArgs {
  // ToDO: Validate the params
  const parsedParams = parseCallbackParams(parseSearchParamsValueAsString(args.params))

  const liveSecretKey = args.paymentDoc.khalti.config?.liveSecretKey

  if (!liveSecretKey) throw new Error('Khalti Payment not configured')

  return {
    name: 'khalti',
    config: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- The element is guaranteed to exist.
      liveSecretKey: liveSecretKey,
      livePublicKey: args.paymentDoc.khalti.config?.livePublicKey,
    },
    data: parsedParams,
  }
}

/**
 * Khalti implementation (KPG-2 Web Checkout)
 */
export const khaltiHandler: ProviderHandler = {
  async createCheckoutSession(args: KhaltiSessionArgs) {
    const fetcher = fetch
    const base = isDevelopment ? KHALTI_DEV_ENDPOINT : KHALTI_PROD_ENDPOINT
    const url = `${base}${PAYMENT_INITIATE_API_PATH}`

    const config = args.config
    const data = args.data

    if (data.amount < 1000) throw new Error('Amount should be >= 1000 paisa (Rs 10)')

    const resp = await fetcher(url, {
      method: 'POST',
      headers: { Authorization: `Key ${config.liveSecretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!resp.ok)
      throw new Error(`Khalti initiate failed: ${resp.status} ${await resp.text().catch(() => '')}`)
    const json = await resp.json()
    return { redirectUrl: json.payment_url, reference: json.pidx, raw: json }
  },

  async lookup(args: KhaltiLookupArgs) {
    const fetcher = fetch
    const base = isDevelopment ? KHALTI_DEV_ENDPOINT : KHALTI_PROD_ENDPOINT
    const url = `${base}${PAYMENT_LOOKUP_API_PATH}`

    const config = args.config
    const { pidx } = args.data

    const resp = await fetcher(url, {
      method: 'POST',
      headers: { Authorization: `Key ${config.liveSecretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pidx }),
    })

    if (!resp.ok)
      throw new Error(`Khalti lookup failed: ${resp.status} ${await resp.text().catch(() => '')}`)
    const lookupResponse = await resp.json()

    const status = parseKhaltiLookupStatus(lookupResponse.status as KhaltiLookupStatus)
    return { status, raw: lookupResponse.json }
  },
}
