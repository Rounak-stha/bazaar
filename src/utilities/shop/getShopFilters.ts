import { unstable_cache } from 'next/cache'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { ShopFilters } from '@/types/shop'

async function getShopFilters(shopId: string): Promise<ShopFilters> {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'productOptions',
    depth: 1,
    where: {
      shop: { equals: shopId },
    },
    limit: 1000,
  })

  const filterMap: ShopFilters = {}

  for (const option of docs) {
    if (!option.values) continue
    const values = option.values?.docs || []
    if (!filterMap[option.name]) filterMap[option.name] = []
    for (const value of values) {
      if (typeof value == 'string') continue
      else filterMap[option.name].push({ id: value.id, name: value.name })
    }
  }

  return filterMap
}

/**
 * Returns a cached function that resolves filters for a given shop.
 * Uses a cache tag `filters_${shop}` so you can invalidate later.
 */
export const getCachedShopFilters = (shop: string) =>
  unstable_cache(async () => await getShopFilters(shop), [shop], {
    tags: [`filters_${shop}`],
  })
