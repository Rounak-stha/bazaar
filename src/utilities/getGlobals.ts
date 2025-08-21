import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { createGlobalCacheTag } from '@/lib/cacheTags'

import type { DataFromGlobalSlug, GlobalSlug } from '@/globals/types'

async function getGlobal(slug: GlobalSlug, shopId: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const paginatedGlobalData = await payload.find({
    collection: slug,
    where: {
      shop: {
        equals: shopId,
      },
    },
    depth,
  })

  if (paginatedGlobalData.totalDocs == 0) return null

  return paginatedGlobalData.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends GlobalSlug>(
  slug: T,
  shopId: string,
  depth = 0,
): (() => Promise<DataFromGlobalSlug<T>>) =>
  unstable_cache(
    async (): Promise<DataFromGlobalSlug<T>> =>
      (await getGlobal(slug, shopId, depth)) as DataFromGlobalSlug<T>,
    [slug],
    {
      tags: [createGlobalCacheTag(slug, shopId)],
    },
  )
