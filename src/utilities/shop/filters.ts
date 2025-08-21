import { SearchParams } from '@/types/next'
import { ParsedShopFilters, ShopFilters } from '@/types/shop'
import { Sort } from 'payload'

export function getSortQuery(searchParams: SearchParams) {
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

export function getQueryValueAsArray(searchParamValue: SearchParams[string]) {
  if (!searchParamValue) return []
  if (typeof searchParamValue == 'string') return [searchParamValue]
  return searchParamValue
}

export function getFilterQuery(searchParams: SearchParams) {
  const { sortBy, ...filters } = searchParams
  const filterQuery: any[] = []

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return
      filterQuery.push({
        and: [
          { 'options.type': { equals: key } },
          { 'options.values': { in: getQueryValueAsArray(value) } },
        ],
      })
    })
  }

  return filterQuery
}

export function parseShopFilters(
  searchParams: SearchParams,
  shopFilters: ShopFilters,
): ParsedShopFilters {
  const mappedEntries = Object.entries(shopFilters).map(([filterName, filterValue]) => {
    const mappedValues = filterValue.map((value) => {
      const paramValues =
        searchParams[filterName] != undefined
          ? typeof searchParams[filterName] == 'string'
            ? searchParams[filterName].split(',')
            : searchParams[filterName]
          : []
      const checked = paramValues.includes(value.id)
      return { ...value, checked }
    })
    return { name: filterName, values: mappedValues }
  })
  return mappedEntries
}

export function getSoryBy(searchParams: SearchParams) {
  return searchParams.sortBy
    ? typeof searchParams.sortBy == 'string'
      ? searchParams.sortBy
      : searchParams.sortBy[0]
    : 'most-popular'
}
