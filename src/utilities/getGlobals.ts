import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(
  slug: T,
  depth = 0,
): (() => Promise<DataFromGlobalSlug<T>>) =>
  unstable_cache(
    async (): Promise<DataFromGlobalSlug<T>> =>
      (await getGlobal(slug, depth)) as DataFromGlobalSlug<T>,
    [slug],
    {
      tags: [`global_${slug}`],
    },
  )
