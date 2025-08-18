import { unstable_cache } from 'next/cache'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { ShopFilters } from '@/types/shop'

async function getShopFilters(shopId: string): Promise<ShopFilters> {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      shop: { equals: shopId },
      _status: { not_equals: 'draft' },
    },
    select: {
      variants: {
        options: true,
      },
    },
    limit: 1000,
  })

  const filterMap: Record<string, Set<string>> = {}

  for (const product of docs) {
    for (const variant of product.variants ?? []) {
      for (const opt of variant.options ?? []) {
        if (!filterMap[opt.name]) filterMap[opt.name] = new Set()
        filterMap[opt.name].add(opt.value)
      }
    }
  }

  return Object.fromEntries(Object.entries(filterMap).map(([key, value]) => [key, [...value]]))
}

/**
 * Returns a cached function that resolves filters for a given shop.
 * Uses a cache tag `filters_${shop}` so you can invalidate later.
 */
export const getCachedShopFilters = (shop: string) =>
  unstable_cache(async () => await getShopFilters(shop), [shop], {
    tags: [`filters_${shop}`],
  })
