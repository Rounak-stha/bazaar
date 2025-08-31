import type { Shop } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { createShopCacheTag } from '@/lib/cacheTags'

async function getShopByDomain(domain: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const paginatedShopData = await payload.find({
    collection: 'shops',
    where: {
      domain: {
        equals: domain,
      },
    },
    limit: 1,
    depth,
  })

  if (paginatedShopData.totalDocs == 0) return null
  return paginatedShopData.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedShopByDomain = (domain: string, depth = 0): (() => Promise<Shop>) =>
  unstable_cache(
    async (): Promise<Shop> => (await getShopByDomain(domain, depth)) as Shop,
    [domain],
    {
      tags: [createShopCacheTag(domain)],
    },
  )

async function getShopById(id: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const paginatedShopData = await payload.find({
    collection: 'shops',
    where: {
      id: {
        equals: id,
      },
    },
    limit: 1,
    depth,
  })

  if (paginatedShopData.totalDocs == 0) return null
  return paginatedShopData.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedShopById = (id: string, depth = 0): (() => Promise<Shop>) =>
  unstable_cache(async (): Promise<Shop> => (await getShopById(id, depth)) as Shop, [id], {
    tags: [createShopCacheTag(id)],
  })
