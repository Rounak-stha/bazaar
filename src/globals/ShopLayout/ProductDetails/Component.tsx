import { notFound } from 'next/navigation'
import { type ReactNode } from 'react'

import { type Product } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { WithImageGalleryExpandableDetails } from './variants/WithImageGalleryExpandableDetails'

import { ProductBreadcrumbs } from '@/components/(storefront)/ProductBreadcrumbs'

export const ProductDetails = async ({
  variant,
  product,
}: {
  variant?: string
  product: Product
}) => {
  try {
    const { productDetails } = await getCachedGlobal('shopLayout', 1)()

    let ProductDetailsComponent: ReactNode = null
    switch (productDetails.type) {
      case 'WithImageGalleryExpandableDetails':
        ProductDetailsComponent = (
          <WithImageGalleryExpandableDetails
            variant={variant}
            productSettings={productDetails}
            product={product}
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
