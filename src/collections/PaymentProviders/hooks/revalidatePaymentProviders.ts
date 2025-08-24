import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { PaymentProvider } from '@/payload-types'
import { createGlobalCacheTag } from '@/lib/cacheTags'
import { PaymentProviderSlug, ShopLayoutSlug } from '@/globals/constants'

export const revalidatePaymentProviders: CollectionAfterChangeHook<PaymentProvider> = ({
  doc,
  req: { payload, context },
}) => {
  const shopId = typeof doc.shop == 'string' ? doc.shop : doc.shop?.id
  if (!context.disableRevalidate && shopId) {
    payload.logger.info(`Revalidating Payment Provider`)

    revalidateTag(createGlobalCacheTag(PaymentProviderSlug, shopId))
  }

  return doc
}
