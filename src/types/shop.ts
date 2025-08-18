/**
 * Key: Option Name for each variants
 * Value: Array of options for the name
 */
export type ShopFilters = Record<string, string[]>

type ParsedShopFilter = { name: string; values: { name: string; checked: boolean }[] }

export type ParsedShopFilters = ParsedShopFilter[]
