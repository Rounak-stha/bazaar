import { useShop } from '@/collections/ShopLayout/hooks/shop'
import { Media } from '@/components/Media'
import { PriceClient } from '@/components/(storefront)/PriceClient'
import { Paths } from '@/lib/url'
import { useCart } from '@/stores/CartStore'
import { CartToCheckout } from '@/stores/CartStore/types'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { QuantityInput } from '@/components/(storefront)/QuantityInput'
import { SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

type CartContentsProps = {
  toggleCart: () => void
}

export function CartContents({ toggleCart }: CartContentsProps) {
  const { cart, setCart, updateCart, removeFromCart } = useCart()
  const { shop } = useShop()
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)

  const fetchCartContents = useCallback(async () => {
    const fetchedCart = await fetch(Paths.cartProducts(shop.domain), {
      method: 'POST',
      body: JSON.stringify({ cart }),
    }).then(async (res) => {
      if (res.status == 200) {
        const val = await res.json()
        return val.data
      }
    })

    return fetchedCart as CartToCheckout
  }, [cart])

  useEffect(() => {
    fetchCartContents().then((cartToCheckout) => {
      setCart(cartToCheckout.products)
      setTotalPrice(cartToCheckout.total)
      setTotalQuantity(cartToCheckout.totalQuantity)
    })
  }, [])

  if (!cart) return <p>Empty Cart</p>

  return (
    <>
      <ul role="list" className="divide-y divide-gray-200 flex-1">
        {cart.map((product) => (
          <li key={`${product.id}-${product.variant.id}`} className="flex py-6">
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
      <div className="border-t border-gray-200 py-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Sub Total</p>
          <p>
            <PriceClient pricing={{ value: totalPrice, currency: 'Rs' }} />
          </p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Shipping will be calculated at checkout.
        </p>
        <div className="mt-6">
          <Link href="/checkout" onClick={toggleCart}>
            <Button className="w-full">Checkout</Button>
          </Link>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            <span className="mr-1">or</span>
            <button
              type="button"
              onClick={toggleCart}
              className="font-medium text-primary hover:text-primary/80"
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
