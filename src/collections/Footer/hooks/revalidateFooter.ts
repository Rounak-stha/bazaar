import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

import { Footer } from '@/payload-types'

import { FooterSlug } from '@/globals/constants'
import { createGlobalCacheTag } from '@/lib/cacheTags'

export const revalidateFooter: CollectionAfterChangeHook<Footer> = ({
  doc,
  req: { payload, context },
}) => {
  const shopId = typeof doc.shop == 'string' ? doc.shop : doc.shop?.id
  if (!context.disableRevalidate && shopId) {
    payload.logger.info(`Revalidating footer`)

    revalidateTag(createGlobalCacheTag(FooterSlug, shopId))
  }

  return doc
}
