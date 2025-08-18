'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { HeartIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { QuantityInput } from '@/components/(storefront)/QuantityInput'
import { type Product } from '@/payload-types'
import { useCart } from '@/stores/CartStore'
import { useWishList } from '@/stores/WishlistStore'
import { cn } from '@/utilities/ui'

import { type FilledVariant } from '../../../types'
import { WithoutNullish } from '@/types/utilities'
import { Label } from '@/components/ui/label'

export const ProductForm = ({
  product,
  selectedVariant,
  filledVariants,
  minQuantity,
  maxQuantity,
}: {
  product: Product
  filledVariants?: FilledVariant[]
  selectedVariant?: FilledVariant
  minQuantity: number
  maxQuantity: number
}) => {
  const [quantity, setQuantity] = useState(1)
  const { updateCart, cart } = useCart()

  const defaultVariant = filledVariants?.find((variant) => variant.stock > 0) ?? filledVariants?.[0]

  const { toggleWishList, wishlist } = useWishList()

  const [overStock, setOverStock] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const updateQuantity = (delta: number) => {
    setQuantity((prev) => prev + delta)
  }

  const setSelectedVariant = (slug?: string) => {
    const params = new URLSearchParams(searchParams?.toString())

    if (slug) {
      params.set('variant', slug)
    } else {
      params.delete('variant')
    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity)
    }
  }, [selectedVariant, maxQuantity, quantity, minQuantity])

  useEffect(() => {
    setOverStock(false)
  }, [cart, selectedVariant])

  const isColorAvailable = (colorID: string) => {
    const isAvailable = filledVariants?.find((variant) => {
      return variant.color?.id === colorID && variant.stock > 0
    })
    return Boolean(isAvailable)
  }

  const findAvailableSizeVariant = (sizeID: string) => {
    const matchingVariant = filledVariants?.find((variant) => {
      return variant.color?.id === selectedVariant?.color?.id && variant.size?.id === sizeID
    })
    if (matchingVariant && matchingVariant.stock > 0) {
      return matchingVariant
    }
  }

  const handleChangeSize = (id: string) => {
    const matchingVariant = findAvailableSizeVariant(id)
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.slug ?? undefined)
    }
  }

  const handleChangeColor = (id: string) => {
    const matchingVariant = filledVariants?.filter(
      (variant) => variant.color?.id === id && variant.stock > 0,
    )
    const closestVariant = matchingVariant?.find(
      (variant) => variant.size?.id === selectedVariant?.size?.id,
    )

    if (closestVariant) {
      setSelectedVariant(closestVariant.slug ?? undefined)
    } else if (matchingVariant) {
      setSelectedVariant(matchingVariant[0].slug ?? undefined)
    }
  }

  const isProductAvailable = !(
    (product.enableVariants && (!selectedVariant || selectedVariant.stock === 0)) ??
    (!product.enableVariants && product.stock === 0)
  )

  const cartItem = cart?.find(
    (item) => item.id === product.id && item.choosenVariantSlug === selectedVariant?.slug,
  )

  type NonNullProductColor = WithoutNullish<NonNullable<Product['colors']>[number]>

  const productColors = useMemo(() => {
    const colors: NonNullProductColor[] =
      product.colors?.reduce<NonNullProductColor[]>((a, c) => {
        if (c.id && c.colorValue) {
          a.push(c as NonNullProductColor)
        }
        return a
      }, [] as NonNullProductColor[]) ?? []
    return colors
  }, [product])

  return (
    <form className="mt-6">
      {/* Colors */}
      {product.variants && product.enableVariants && product.variantsType !== 'colors' && (
        <div>
          <h3 className="text-sm font-medium text-gray-600">Color</h3>

          <fieldset aria-label="Choose Color" className="mt-2">
            <RadioGroup
              value={selectedVariant?.color?.id ?? defaultVariant?.color?.id}
              onChange={() => handleChangeColor(defaultVariant?.color?.id!)}
              className="flex items-center gap-x-3"
            >
              {productColors.map((color) => {
                const isAvailable = isColorAvailable(color.id ?? '')
                return (
                  <>
                    <RadioGroupItem
                      key={color.id}
                      value={color.id}
                      aria-label={color.label}
                      disabled={!isAvailable}
                      className="sr-only"
                    />
                    <Label
                      aria-hidden="true"
                      style={{ background: color.colorValue ?? '' }}
                      className={cn('size-8 rounded-full border border-black/10')}
                    />
                  </>
                )
              })}
            </RadioGroup>
          </fieldset>
        </div>
      )}

      {/* Size picker */}
      {product.variants && product.enableVariants && product.variantsType !== 'colors' && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Size</h2>
          </div>

          <fieldset aria-label="Choose Size" className="mt-2">
            <RadioGroup
              value={selectedVariant?.size?.id ?? defaultVariant?.size?.id}
              onChange={() => handleChangeSize(selectedVariant?.size?.id!)}
              className="grid grid-cols-3 gap-3 sm:grid-cols-6"
            >
              {product.sizes?.map((size, i) => {
                const matchingVariant = findAvailableSizeVariant(size.id ?? '')
                const slug = matchingVariant?.size?.slug
                  ? matchingVariant?.size?.slug
                  : 'size unavailable ' + i
                const id = matchingVariant?.size?.id ? matchingVariant?.size?.id : 'id-unavailable'

                return (
                  <>
                    <RadioGroupItem disabled={!matchingVariant} value={id} id={slug} />
                    <Label
                      htmlFor={slug}
                      className={cn(
                        matchingVariant
                          ? 'focus:outline-hidden cursor-pointer'
                          : 'cursor-not-allowed opacity-25',
                        'flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-3 text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 data-checked:border-transparent data-checked:bg-main-600 data-checked:text-white data-focus:ring-2 data-focus:ring-main-500 data-focus:ring-offset-2 data-checked:hover:bg-main-700 sm:flex-1',
                      )}
                    >
                      {size.label}
                    </Label>
                  </>
                )
              })}
            </RadioGroup>
          </fieldset>
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-y-4 sm:flex">
        <button
          type="submit"
          disabled={!isProductAvailable}
          className={cn(
            'focus:outline-hidden col-span-2 row-start-2 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-main-600 px-8 py-3 text-base font-medium text-white hover:bg-main-700 focus:ring-2 focus:ring-main-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full',
            !isProductAvailable && 'cursor-not-allowed opacity-25',
          )}
          onClick={(e) => {
            e.preventDefault()
            if (quantity <= maxQuantity - (cartItem?.quantity ?? 0)) {
              setOverStock(false)
              updateCart([
                {
                  id: product.id,
                  quantity: quantity,
                  choosenVariantSlug: selectedVariant?.slug ?? undefined,
                },
              ])
            } else {
              setOverStock(true)
            }
          }}
        >
          {isProductAvailable ? 'Add to Cart' : 'Product Unavailable'}
        </button>

        <div className="flex">
          <QuantityInput
            maxQuantity={maxQuantity}
            minQuantity={minQuantity}
            setQuantity={setQuantity}
            updateQuantity={updateQuantity}
            quantity={quantity}
          />

          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishList([
                {
                  id: product.id,
                  choosenVariantSlug: selectedVariant?.slug ?? undefined,
                },
              ])
            }}
            type="button"
            className="ml-4 flex w-fit items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            {wishlist?.find(
              (item) =>
                item.id === product.id &&
                (product.enableVariants ? item.choosenVariantSlug === selectedVariant?.slug : true),
            ) ? (
              <HeartIcon fill="red" aria-hidden="true" className="size-6 shrink-0" />
            ) : (
              <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
            )}
            <span className="sr-only">Add to Favs</span>
          </button>
        </div>
      </div>
      {overStock && (
        <p className="mt-4 text-red-500">
          {maxQuantity - (cartItem?.quantity ?? 0) > 0
            ? `Stock Left ${maxQuantity - (cartItem?.quantity ?? 0)}`
            : 'Maximum Stock'}
        </p>
      )}
    </form>
  )
}
