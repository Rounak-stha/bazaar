import { ProductOptionValue } from '@/payload-types'

/**
 * Key: Option Name for each variants
 * Value: Array of options for the name
 */
export type ShopFilters = Record<string, Pick<ProductOptionValue, 'id' | 'name'>[]>

type ParsedShopFilter = { name: string; values: { id: string; name: string; checked: boolean }[] }

export type ParsedShopFilters = ParsedShopFilter[]
