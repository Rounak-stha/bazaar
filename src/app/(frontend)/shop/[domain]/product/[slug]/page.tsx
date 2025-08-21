import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { ProductDetails } from '@/collections/ShopLayout/ProductDetails/Component'
import config from '@payload-config'
import { getCachedShopByDomain } from '@/utilities/shop/getShop'
import { SearchParams } from '@/types/next'

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string; slug: string }>
  searchParams: Promise<SearchParams>
}) => {
  try {
    const payload = await getPayload({ config })
    const { domain, slug } = await params
    const shop = await getCachedShopByDomain(domain)()

    if (!shop) notFound()

    const { docs } = await payload.find({
      collection: 'products',
      depth: 2,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
    const { variant } = await searchParams

    if (docs.length === 0) {
      notFound()
    }

    return <ProductDetails shop={shop} product={docs[0]} selectedVariantId={variant as string} />
  } catch {
    notFound()
  }
}

export default ProductPage
