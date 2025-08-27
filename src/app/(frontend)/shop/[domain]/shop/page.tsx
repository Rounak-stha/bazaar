import { notFound } from 'next/navigation'
import { getPayload, type Sort } from 'payload'

import { ProductList } from '@/collections/ShopLayout/ProductList/Component'
import config from '@payload-config'
import { getCachedShopFilters } from '@/utilities/shop/getShopFilters'
import { getCachedShopByDomain } from '@/utilities/shop/getShop'
import { SearchParams } from '@/types/next'
import { getFilterQuery, getSortQuery, getSoryBy, parseShopFilters } from '@/utilities/shop/filters'

// export const dynamic = 'force-static'

type ShopPageProps = {
  params: Promise<{ domain: string }>
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams, params }: ShopPageProps) {
  try {
    const { domain } = await params
    const awaitedSearchParams = await searchParams
    const payload = await getPayload({ config })

    const shop = await getCachedShopByDomain(domain)()

    if (!shop) {
      throw new Error('Invalid Shop')
    }

    const sortBy = getSoryBy(awaitedSearchParams)
    const sortQuery: Sort = getSortQuery(awaitedSearchParams)
    const filterQuery = getFilterQuery(awaitedSearchParams)
    const shopFilters = await getCachedShopFilters(shop.id)()
    const parsedShopFilters = parseShopFilters(awaitedSearchParams, shopFilters)

    const { docs: products } = await payload.find({
      collection: 'products',
      depth: 2,
      where: {
        ...(filterQuery.length > 0 ? { and: filterQuery } : {}),
        shop: {
          equals: shop.id,
        },
        _status: {
          not_equals: 'draft',
        },
      },
      sort: sortQuery,
    })

    return (
      <ProductList
        filteredProducts={products}
        shop={shop}
        title="Shop"
        shopFilters={parsedShopFilters}
        sortBy={sortBy}
      />
    )
  } catch (error) {
    console.log(error)
    notFound()
  }
}
