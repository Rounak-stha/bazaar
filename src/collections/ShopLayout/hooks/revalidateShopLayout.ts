import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { Footer } from '@/payload-types'
import { createGlobalCacheTag } from '@/lib/cacheTags'
import { ShopLayoutSlug } from '@/globals/constants'

export const revalidateShopayout: CollectionAfterChangeHook<Footer> = ({
  doc,
  req: { payload, context },
}) => {
  const shopId = typeof doc.shop == 'string' ? doc.shop : doc.shop?.id
  if (!context.disableRevalidate && shopId) {
    payload.logger.info(`Revalidating Shop Layout`)

    revalidateTag(createGlobalCacheTag(ShopLayoutSlug, shopId))
  }

  return doc
}
