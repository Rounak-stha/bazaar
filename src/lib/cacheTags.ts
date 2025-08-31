export function createGlobalCacheTag(slug: string, shopId: string) {
  return `global_${slug}_shop_${shopId}`
}

export function createShopCacheTag(domain: string) {
  return `shop_${domain}`
}

export function createProductCategoryCacheTag(slug: string, shopId: string) {
  return `shop_${shopId}_category_${slug}`
}

export function createPageCacheTag(slug: string, shopId: string) {
  return `shop_${shopId}_page_${slug}`
}
