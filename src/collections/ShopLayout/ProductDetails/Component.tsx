import { notFound } from 'next/navigation'
import { type ReactNode } from 'react'

import { Shop, type Product } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { WithImageGalleryExpandableDetails } from './variants/WithImageGalleryExpandableDetails'

import { ProductBreadcrumbs } from '@/components/(storefront)/ProductBreadcrumbs'

type ProductDetailsProps = { shop: Shop; product: Product; selectedVariantId?: string }

export const ProductDetails = async ({ shop, product, selectedVariantId }: ProductDetailsProps) => {
  try {
    const { productDetails } = await getCachedGlobal('shopLayout', shop.id)()

    let ProductDetailsComponent: ReactNode = null
    switch (productDetails.type) {
      case 'WithImageGalleryExpandableDetails':
        ProductDetailsComponent = (
          <WithImageGalleryExpandableDetails
            productSettings={productDetails}
            product={product}
            selectedVariantId={selectedVariantId}
          />
        )
        break
    }

    if (!ProductDetailsComponent) {
      notFound()
    }

    return (
      <>
        <ProductBreadcrumbs product={product} />
        {ProductDetailsComponent}
      </>
    )
  } catch (error) {
    console.log(error)
    notFound()
  }
}
