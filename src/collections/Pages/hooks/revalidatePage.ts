import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'
import { getCachedShopById } from '@/utilities/shop/getShop'
import { getPagepathForSlug } from '@/lib/url'
import { createPageCacheTag } from '@/lib/cacheTags'

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc.shop && doc.slug) {
    const shop = typeof doc.shop == 'object' ? doc.shop : await getCachedShopById(doc.shop)()

    if (doc._status === 'published') {
      const path = getPagepathForSlug(shop.domain, doc.slug === 'home' ? '' : `/${doc.slug}`)

      payload.logger.info(`Revalidating page at path: ${path}`)
      payload.logger.info(`Revalidating Tag: ${createPageCacheTag(doc.slug, shop.id)}`)

      revalidatePath(path)
      revalidateTag(createPageCacheTag(doc.slug, shop.id))

      revalidateTag('pages-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = getPagepathForSlug(
        shop.domain,
        previousDoc.slug === 'home' ? '' : `/${previousDoc.slug}`,
      )

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)
      payload.logger.info(`Revalidating Tag: ${createPageCacheTag(doc.slug, shop.id)}`)

      revalidatePath(oldPath)
      revalidateTag(createPageCacheTag(doc.slug, shop.id))

      revalidateTag('pages-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('pages-sitemap')
  }

  return doc
}
