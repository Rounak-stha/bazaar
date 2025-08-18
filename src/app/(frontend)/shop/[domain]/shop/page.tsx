import { notFound } from 'next/navigation'
import { getPayload, type Sort } from 'payload'

import { ProductList } from '@/globals/ShopLayout/ProductList/Component'
import config from '@payload-config'
import { getCachedShopFilters } from '@/utilities/shop/getShopFilters'
import { ParsedShopFilters, ShopFilters } from '@/types/shop'

// export const dynamic = 'force-static'

type ShopPageProps = {
  params: Promise<{ domain: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function getSortQuery(searchParams: Awaited<ShopPageProps['searchParams']>) {
  const sortBy = searchParams.sortBy

  let sortQuery: Sort = 'bought'

  if (!sortBy) return sortQuery

  switch (sortBy) {
    case 'priceasc':
      sortQuery = ['variants.pricing[0].value', 'pricing.value']
      break
    case 'pricedesc':
      sortQuery = ['-variants.pricing[0].value', '-pricing.value']
      break
    case 'newest':
      sortQuery = ['-createdAt']
      break
    default: // most-popular
      sortQuery = '-bought'
      break
  }

  return sortQuery
}

function getQueryValueAsArray(searchParamValue: Awaited<ShopPageProps['searchParams']>[string]) {
  if (!searchParamValue) return []
  if (typeof searchParamValue == 'string') return [searchParamValue]
  return searchParamValue
}

function getFilterQuery(searchParams: Awaited<ShopPageProps['searchParams']>) {
  const { sortBy, ...filters } = searchParams
  const filterQuery: any[] = []

  console.log({ filters })
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return
      filterQuery.push({
        and: [
          { 'variants.options.name': { equals: key } },
          { 'variants.options.value': { in: getQueryValueAsArray(value) } },
        ],
      })
    })
  }

  return filterQuery
}

function parseShopFilters(
  searchParams: Awaited<ShopPageProps['searchParams']>,
  shopFilters: ShopFilters,
): ParsedShopFilters {
  const mappedEntries = Object.entries(shopFilters).map(([filterName, filterValue]) => {
    const mappedValues = filterValue.map((valueName) => {
      const paramValues =
        searchParams[filterName] != undefined
          ? typeof searchParams[filterName] == 'string'
            ? [searchParams[filterName]]
            : searchParams[filterName]
          : []
      const checked = paramValues.includes(valueName)
      return { name: valueName, checked }
    })
    return { name: filterName, values: mappedValues }
  })
  return mappedEntries
}

function getSoryBy(searchParams: Awaited<ShopPageProps['searchParams']>) {
  return searchParams.sortBy
    ? typeof searchParams.sortBy == 'string'
      ? searchParams.sortBy
      : searchParams.sortBy[0]
    : 'most-popular'
}

export default async function ShopPage({ searchParams, params }: ShopPageProps) {
  try {
    const { domain } = await params
    const awaitedSearchParams = await searchParams
    console.log({ awaitedSearchParams })
    const payload = await getPayload({ config })

    // cache this as well
    const paginatedShopData = await payload.find({
      collection: 'shops',
      where: {
        domain: {
          equals: domain,
        },
      },
      select: {
        domain: true,
      },
    })

    if (paginatedShopData.docs.length == 0) {
      throw new Error('Invalid Shop')
    }

    const sortBy = getSoryBy(awaitedSearchParams)
    let sortQuery: Sort = getSortQuery(awaitedSearchParams)
    const filterQuery = getFilterQuery(awaitedSearchParams)
    const shopFilters = await getCachedShopFilters(paginatedShopData.docs[0].id)()
    const parsedShopFilters = parseShopFilters(awaitedSearchParams, shopFilters)

    console.log({ sortBy, sortQuery, shopFilters, parsedShopFilters, filterQuery })

    const { docs: products } = await payload.find({
      collection: 'products',
      depth: 2,
      where: {
        ...(filterQuery.length > 0 ? { and: filterQuery } : {}),
        shop: {
          equals: paginatedShopData.docs[0].id,
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
