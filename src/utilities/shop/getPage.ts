import type { Page } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { createPageCacheTag } from '@/lib/cacheTags'

async function getPage(slug: string, shopId: string, depth: number) {
  const payload = await getPayload({ config: configPromise })

  const paginatedPageData = await payload.find({
    collection: 'pages',
    where: {
      shop: {
        equals: shopId,
      },
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth,
  })

  if (paginatedPageData.totalDocs == 0) return null
  return paginatedPageData.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedPage = (slug: string, shopId: string, depth = 1): (() => Promise<Page>) =>
  unstable_cache(
    async (): Promise<Page> => (await getPage(slug, shopId, depth)) as Page,
    [slug, shopId],
    {
      tags: [createPageCacheTag(slug, shopId)],
    },
  )
