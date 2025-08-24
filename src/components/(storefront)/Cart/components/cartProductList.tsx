import Link from 'next/link'

import { Media } from '@/components/Media'
import { PriceClient } from '@/components/(storefront)/PriceClient'
import { QuantityInput } from '@/components/(storefront)/QuantityInput'
import { useCart } from '@/stores/CartStore'

export function CartProductList() {
  const { cart, updateCart, removeFromCart } = useCart()

  if (!cart) return null

  return (
    <ul role="list" className="divide-y divide-gray-200 flex-1">
      {cart.map((product) => (
        <li key={`${product.id}-${product.variant.id}`} className="flex py-6 px-4">
          <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
            {product.image ? (
              <Media resource={product.image} className="size-full object-cover" />
            ) : null}
          </div>

          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between text-gray-900">
                <h3 className="text-base font-bold text-primary">
                  <Link href={`/product/${product.slug}?variant=${product.variant.id}`}>
                    {product.title}
                  </Link>
                </h3>
                <p className="ml-4">
                  <PriceClient pricing={product.variant.pricing} />
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{product.variant.name}</p>
            </div>

            <div className="flex flex-1 items-end justify-between text-sm">
              <QuantityInput
                quantity={product.quantity}
                inputVariant="cart"
                updateQuantity={(delta) => {
                  updateCart([{ ...product, quantity: product.quantity + delta }])
                }}
                maxQuantity={product.variant.stock}
                minQuantity={1}
              />

              <div className="flex">
                <button
                  type="button"
                  onClick={() => {
                    removeFromCart(product.id, product.variant.id ?? undefined)
                  }}
                  className="font-medium text-destructive hover:text-primary/80"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
