import { type ReactNode } from 'react'

import { PriceClient } from '@/components/(storefront)/PriceClient'
import { Media } from '@/components/Media'
import { type Product } from '@/payload-types'
import { getPriceRange } from '@/utilities/getPriceRange'
import Link from 'next/link'

export const WithInlinePrice = ({ products }: { products: Product[] }) => {
  return (
    <>
      {products.map((product) => {
        if (typeof product.images[0] !== 'number') {
          const priceRange = getPriceRange(product.variants)

          let pricingComponent: ReactNode

          if (priceRange?.length === 2) {
            pricingComponent = (
              <>
                <PriceClient pricing={priceRange[0]} />
                <span className="mx-1">-</span>
                <PriceClient pricing={priceRange[1]} />
              </>
            )
          } else if (priceRange?.length === 1) {
            pricingComponent = <PriceClient pricing={priceRange[0]} />
          }

          return (
            <div key={product.id} className="group relative">
              <Media
                resource={product.images[0]}
                className="aspect-square w-full overflow-clip rounded-md object-cover group-hover:opacity-75 lg:max-h-80"
              />
              <div className="mt-4 flex justify-between">
                <div className="w-3/5">
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/product/${product.slug}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </Link>
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {product.variants.length} {product.variants.length > 1 ? 'variants' : 'variant'}
                  </p>
                </div>
                <p className="flex w-2/5 flex-wrap justify-end text-sm font-medium text-gray-900">
                  {pricingComponent}
                </p>
              </div>
            </div>
          )
        }
      })}
    </>
  )
}
