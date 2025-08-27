import type { ProductCategory } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { createProductCategoryCacheTag } from '@/lib/cacheTags'

async function getCategory(slug: string, shopId: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const paginatedCategoryData = await payload.find({
    collection: 'productCategories',
    where: {
      shop: {
        equals: shopId,
      },
      slug: {
        equals: slug,
      },
    },
    select: {
      slug: true,
    },
    limit: 1,
    depth,
  })

  if (paginatedCategoryData.totalDocs == 0) return null
  return paginatedCategoryData.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedCategory = (
  slug: string,
  shopId: string,
  depth = 0,
): (() => Promise<ProductCategory>) =>
  unstable_cache(
    async (): Promise<ProductCategory> =>
      (await getCategory(slug, shopId, depth)) as ProductCategory,
    [slug, shopId],
    {
      tags: [createProductCategoryCacheTag(slug, shopId)],
    },
  )
