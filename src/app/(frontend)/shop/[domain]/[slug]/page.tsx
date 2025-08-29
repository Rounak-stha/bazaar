import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

export const revalidate = false

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

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

  const page = await queryPageBySlug({
    slug,
    domain,
  })

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
  const page = await queryPageBySlug({
    slug,
    domain,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, domain }: { slug: string; domain: string }) => {
  const payload = await getPayload({ config: configPromise })

  const paginatedShopData = await payload.find({
    collection: 'shops',
    where: {
      domain: {
        equals: domain,
      },
    },
  })

  if (paginatedShopData.docs.length == 0) return null

  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          shop: {
            equals: paginatedShopData.docs[0].id,
          },
        },
      ],
    },
  })

  return result.docs?.[0] || null
})
