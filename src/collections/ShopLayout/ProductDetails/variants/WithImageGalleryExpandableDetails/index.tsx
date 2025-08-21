import { Disclosure, DisclosureButton, DisclosurePanel, Tab, TabPanel } from '@headlessui/react'
import { MinusIcon, PlusIcon, StarIcon } from 'lucide-react'

import { PriceClient } from '@/components/(storefront)/PriceClient'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { type Product, type ShopLayout, type Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'

import { ProductForm } from './components/ProductForm'
import { ProductGallery } from './components/ProductGallery'
import { useMemo } from 'react'

export const WithImageGalleryExpandableDetails = ({
  product,
  productSettings,
  selectedVariantId,
}: {
  product: Product
  productSettings: ShopLayout['productDetails']
  selectedVariantId?: string
}) => {
  // Find the selected variant, or fallback to first available
  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants.find((v) => v.stock > 0) ??
    product.variants[0]

  const maxQuantity = selectedVariant?.stock ?? 999
  const minQuantity = 1

  // Merge product images + variant image
  const galleryImages: MediaType[] = useMemo(() => {
    return [
      ...product.images.filter((img): img is MediaType => typeof img !== 'string'),
      ...(product.variants
        .map((v) => v.image)
        .filter((image): image is MediaType => Boolean(image) && typeof image != 'string') || []),
    ]
  }, [selectedVariant, product])

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 pt-8 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* ---------- IMAGE GALLERY ---------- */}
          <ProductGallery images={galleryImages} selectedVariant={selectedVariant} />

          {/* ---------- PRODUCT INFO ---------- */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>

            {/* Pricing */}
            <div className="mt-3">
              <h2 className="sr-only">Product Info</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {selectedVariant?.pricing && <PriceClient pricing={selectedVariant.pricing} />}
              </p>
            </div>

            {/* Reviews */}
            {productSettings.reviewsEnabled && (
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={cn('text-main-500', 'size-5 shrink-0')}
                      />
                    ))}
                  </div>
                  <p className="sr-only">5 out of 5 stars</p>
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <RichText
                  className="space-y-6  text-base"
                  data={product.description}
                  enableGutter={false}
                />
              </div>
            )}

            {/* Variant Selector + Cart */}
            <ProductForm
              product={product}
              selectedVariantId={selectedVariant.id}
              minQuantity={minQuantity}
            />

            {/* Additional Details */}
            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional Details
              </h2>

              <div className="divide-gray-360 divide-y border-t">
                {product.details?.map((detail) => (
                  <Disclosure key={detail.id} as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="group-data-open:text-main-600 text-sm font-medium text-gray-900">
                          {detail.title}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="text-main-400 group-hover:text-main-500 hidden size-6 group-data-open:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pb-6">
                      <RichText
                        className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300"
                        data={detail.content}
                      />
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
