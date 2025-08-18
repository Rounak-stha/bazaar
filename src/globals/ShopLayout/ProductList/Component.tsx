import { notFound } from 'next/navigation'

import { ListingBreadcrumbs } from '@/components/ListingBreadcrumbs'
import { type Product, type ProductCategory } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { ParsedShopFilters } from '@/types/shop'

import { None } from './variants/filters/None'
import { WithSidebar } from './variants/filters/WithSidebar/WithSidebar'
import { WithInlinePrice } from './variants/listings/WithInlinePrice'

export const ProductList = async ({
  filteredProducts,
  title,
  category,
  shopFilters,
  sortBy,
}: {
  filteredProducts: Product[]
  title: string
  category?: ProductCategory
  shopFilters: ParsedShopFilters
  sortBy: string
}) => {
  try {
    const { productList } = await getCachedGlobal('shopLayout', 1)()

    let ProductDetailsComponent: typeof WithSidebar | typeof None = None
    switch (productList.filters) {
      case 'withSidebar':
        ProductDetailsComponent = WithSidebar
        break
      default:
        ProductDetailsComponent = None
    }

    return (
      <div>
        {category && <ListingBreadcrumbs category={category} />}
        <ProductDetailsComponent title={title} shopFilters={shopFilters} sortBy={sortBy}>
          <WithInlinePrice products={filteredProducts} />
        </ProductDetailsComponent>
      </div>
    )
  } catch (error) {
    console.log(error)
    return notFound()
  }
}
