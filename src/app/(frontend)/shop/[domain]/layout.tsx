import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/collections/Footer/Component'
import { Header } from '@/collections/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import { getServerSideURL } from '@/utilities/getURL'
import { Cart } from '@/components/(storefront)/Cart/Component'
import { WishList } from '@/components/WishList/Component'
import { getCachedShopByDomain } from '@/utilities/shop/getShop'
import { ShopProvider } from '@/components/(storefront)/context/shop'

type RootLayoutProps = {
  params: Promise<{ domain: string }>
  children: React.ReactNode
}

export default async function RootLayout({ params, children }: RootLayoutProps) {
  const { domain } = await params
  const { isEnabled } = await draftMode()
  const shop = await getCachedShopByDomain(domain)()

  if (!shop) return notFound()

  return (
    <Providers>
      <ShopProvider shop={shop}>
        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />

        <Header shop={shop} />
        <Cart />
        <WishList />
        {children}
        <Footer shop={shop} />
      </ShopProvider>
    </Providers>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@bazaar',
  },
}
