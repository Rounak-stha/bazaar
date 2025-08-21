import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { Header } from '@/payload-types'
import { createGlobalCacheTag } from '@/lib/cacheTags'
import { HeaderSlug } from '@/globals/constants'

export const revalidateHeader: CollectionAfterChangeHook<Header> = ({
  doc,
  req: { payload, context },
}) => {
  const shopId = typeof doc.shop == 'string' ? doc.shop : doc.shop?.id
  if (!context.disableRevalidate && shopId) {
    payload.logger.info(`Revalidating header`)

    revalidateTag(createGlobalCacheTag(HeaderSlug, shopId))
  }

  return doc
}
