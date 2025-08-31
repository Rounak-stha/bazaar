import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getCachedShopByDomain } from '@/utilities/shop/getShop'
import type { Page } from '@/payload-types'
import { getCachedPage } from '@/utilities/shop/getPage'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const params: { domain: string; slug: string }[] = []

  const paginatedShopData = await payload.find({
    collection: 'shops',
    select: {
      domain: true,
    },
    limit: 1000,
  })

  if (paginatedShopData.totalDocs == 0) return params

  for (const shop of paginatedShopData.docs) {
    const paginatedShopPages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 10,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    if (paginatedShopPages.totalDocs > 0) {
      paginatedShopPages.docs.forEach(
        (p) => p.slug && params.push({ domain: shop.domain, slug: p.slug }),
      )
    }
  }

  return params
}

type Args = {
  params: Promise<{
    slug?: string
    domain: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { domain, slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: Page | null = null

  const shop = await getCachedShopByDomain(domain)()

  if (shop) {
    page = await getCachedPage(slug, shop.id)()
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article id={slug == 'home' ? 'landing-page' : 'no'} className="pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {/*draft && <LivePreviewListener /> */}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home', domain } = await paramsPromise

  let page: Page | null = null

  const shop = await getCachedShopByDomain(domain)()

  if (shop) {
    page = await getCachedPage(slug, shop.id)()
  }

  return generateMeta({ doc: page })
}
