'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HeartIcon } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

import { QuantityInput } from '@/components/(storefront)/QuantityInput'
import { type Product } from '@/payload-types'
import { useCart } from '@/stores/CartStore'
import { useWishList } from '@/stores/WishlistStore'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'

/**
 * Helpers to safely read ids/labels from string | object unions.
 */
function idOf(x: unknown): string | undefined {
  if (typeof x === 'string') return x
  if (x && typeof x === 'object' && 'id' in x) {
    const id = (x as { id?: string | null }).id
    return typeof id === 'string' ? id : undefined
  }
  return undefined
}

function labelOf(x: unknown): string {
  if (typeof x === 'string') return x
  if (x && typeof x === 'object') {
    const o = x as any
    return o?.name ?? o?.label ?? o?.slug ?? o?.id ?? ''
  }
  return ''
}

/**
 * Returns true if a variant matches all provided (typeId -> valueId) selections.
 * Selections can be partial (only some types chosen).
 */
function variantMatchesSelections(
  variant: Product['variants'][number],
  selections: Record<string, string | undefined>,
): boolean {
  const vmap = new Map<string, string>()
  variant.options?.forEach((opt) => {
    const t = idOf(opt.type)
    const v = idOf(opt.value)
    if (t && v) vmap.set(t, v)
  })
  for (const [typeId, valueId] of Object.entries(selections)) {
    if (!typeId || !valueId) continue
    if (vmap.get(typeId) !== valueId) return false
  }
  return true
}

export const ProductForm = ({
  product,
  selectedVariantId, // optional initial selection (e.g., from parent)
  minQuantity = 1,
}: {
  product: Product
  selectedVariantId?: string | null
  minQuantity?: number
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const variants = product.variants ?? []

  // Build option groups from product.options (admin-defined).
  const optionGroups = useMemo(() => {
    return (product.options ?? [])
      .map((opt) => {
        const typeId = idOf(opt.type)
        if (!typeId) return null
        const typeLabel = labelOf(opt.type)
        const values = (opt.values ?? [])
          .map((v) => {
            const vid = idOf(v)
            if (!vid) return null
            return { id: vid, label: labelOf(v) }
          })
          .filter(Boolean) as { id: string; label: string }[]
        if (!values.length) return null
        return { typeId, typeLabel, values }
      })
      .filter(Boolean) as {
      typeId: string
      typeLabel: string
      values: { id: string; label: string }[]
    }[]
  }, [product.options])

  // Determine the currently selected variant (by URL ?variant or prop or fallback).
  const variantFromQuery = searchParams?.get('variant') ?? selectedVariantId
  const initialVariant =
    variants.find((v) => (v.id ?? v.sku) === variantFromQuery) ??
    variants.find((v) => v.stock > 0) ??
    variants[0]

  const [currentVariant, setCurrentVariant] = useState(initialVariant)

  // Selections: typeId -> valueId (derived from the chosen variant)
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    initialVariant?.options?.forEach((o) => {
      const t = idOf(o.type)
      const v = idOf(o.value)
      if (t && v) map[t] = v
    })
    return map
  })

  // Keep URL in sync when variant changes.
  const replaceVariantInURL = (v?: Product['variants'][number]) => {
    const params = new URLSearchParams(searchParams?.toString())
    const val = v?.id ?? v?.sku
    if (val) params.set('variant', String(val))
    else params.delete('variant')
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  // When the selected variant changes externally (URL or prop), align internal state.
  useEffect(() => {
    console.log('Use Effect to set variant')
    const nextVariant =
      variants.find((v) => (v.id ?? v.sku) === variantFromQuery) ??
      variants.find((v) => v.stock > 0) ??
      variants[0]

    setCurrentVariant(nextVariant)
    const map: Record<string, string> = {}
    nextVariant?.options?.forEach((o) => {
      const t = idOf(o.type)
      const v = idOf(o.value)
      if (t && v) map[t] = v
    })
    setSelections(map)
  }, [variantFromQuery, variants])

  // Quantity + stock handling
  const [quantity, setQuantity] = useState<number>(minQuantity)
  const maxQuantity = currentVariant?.stock ?? 999
  useEffect(() => {
    console.log('Use Effect to set quantity')
    if (quantity > maxQuantity) setQuantity(maxQuantity)
    if (quantity < minQuantity) setQuantity(minQuantity)
  }, [maxQuantity, minQuantity])

  const { updateCart, cart } = useCart()
  const { toggleWishList, wishlist } = useWishList()
  const [overStock, setOverStock] = useState(false)

  useEffect(() => {
    console.log('Use Effect to set stock')
    setOverStock(false)
  }, [cart, currentVariant])

  // Compute availability of each option value given current partial selections.
  const isValueAvailable = (typeId: string, valueId: string) => {
    const hypothetical = { ...selections, [typeId]: valueId }
    return variants.some((v) => v.stock > 0 && variantMatchesSelections(v, hypothetical))
  }

  // On changing a specific option type, pick the best matching variant.
  const handleSelectValue = (typeId: string, valueId: string) => {
    const nextSelections = { ...selections, [typeId]: valueId }

    // Prefer in-stock exact match
    let nextVariant =
      variants.find((v) => v.stock > 0 && variantMatchesSelections(v, nextSelections)) ??
      // fallback to any exact match (even if out of stock)
      variants.find((v) => variantMatchesSelections(v, nextSelections)) ??
      // fallback to current variant (no change)
      currentVariant

    setSelections(nextSelections)
    setCurrentVariant(nextVariant)
    replaceVariantInURL(nextVariant)
  }

  const isProductAvailable = Boolean(currentVariant && currentVariant.stock > 0)

  const cartItem = cart?.find(
    (item) =>
      item.id === product.id &&
      item.choosenVariantSlug === (currentVariant?.id ?? currentVariant?.sku),
  )

  return (
    <form className="mt-6">
      {/* --- Generic Option Pickers (no hard-coded color/size) --- */}
      {optionGroups.length > 0 && (
        <div className="space-y-8">
          {optionGroups.map(({ typeId, typeLabel, values }) => {
            const selectedValueId = selections[typeId]
            return (
              <div key={typeId}>
                <h3 className="text-sm font-medium text-gray-900">{typeLabel}</h3>
                <fieldset aria-label={`Choose ${typeLabel}`} className="mt-2">
                  <RadioGroup
                    value={selectedValueId}
                    onValueChange={(valueId) => handleSelectValue(typeId, valueId)}
                    className="flex flex-wrap gap-3"
                  >
                    {values.map(({ id, label }) => {
                      const available = isValueAvailable(typeId, id)
                      const inputId = `${typeId}-${id}`

                      return (
                        <div key={id} className="relative">
                          <RadioGroupItem
                            value={id} // keep this
                            id={inputId}
                            disabled={!available}
                          />
                          <Label
                            htmlFor={inputId}
                            className={cn(
                              'flex items-center justify-center rounded-md border px-3 py-3 text-sm font-medium',
                              available ? 'cursor-pointer' : 'cursor-not-allowed opacity-25',
                            )}
                          >
                            {label}
                          </Label>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </fieldset>
              </div>
            )
          })}
        </div>
      )}

      {/* --- Add to Cart + Quantity + Wishlist --- */}
      <div className="mt-10 grid grid-cols-2 gap-y-4 sm:flex">
        <Button
          type="submit"
          disabled={!isProductAvailable}
          className={cn(
            'h-full col-span-2 row-start-2 flex max-w-xs flex-1 items-center justify-center px-8 py-3 text-base font-medium sm:w-full',
            !isProductAvailable && 'cursor-not-allowed opacity-25',
          )}
          onClick={(e) => {
            e.preventDefault()
            if (!currentVariant) return
            const currentInCart = cartItem?.quantity ?? 0
            if (quantity <= maxQuantity - currentInCart) {
              setOverStock(false)
              updateCart([
                {
                  id: product.id,
                  quantity,
                  // keeping the same key your stores expect:
                  choosenVariantSlug: (currentVariant.id ?? currentVariant.sku) as string,
                },
              ])
            } else {
              setOverStock(true)
            }
          }}
        >
          {isProductAvailable ? 'Add to Cart' : 'Product Unavailable'}
        </Button>

        <div className="flex">
          <QuantityInput
            maxQuantity={maxQuantity}
            minQuantity={minQuantity}
            setQuantity={setQuantity}
            updateQuantity={(delta) => setQuantity((q) => q + delta)}
            quantity={quantity}
          />

          <button
            onClick={(e) => {
              e.preventDefault()
              if (!currentVariant) return
              toggleWishList([
                {
                  id: product.id,
                  choosenVariantSlug: (currentVariant.id ?? currentVariant.sku) as string,
                },
              ])
            }}
            type="button"
            className="ml-4 flex w-fit items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            {wishlist?.find(
              (item) =>
                item.id === product.id &&
                item.choosenVariantSlug === (currentVariant?.id ?? currentVariant?.sku),
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
