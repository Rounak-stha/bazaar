import { Product } from '@/payload-types'
import { Cart, CartProduct, CartToCheckout } from '@/stores/CartStore/types'

export function syncCart(
  cart: Cart,
  products: Pick<Product, 'id' | 'title' | 'images' | 'variants' | 'slug'>[],
) {
  const cartProduct = [] as CartProduct[]

  const content: CartToCheckout = {
    products: cartProduct,
    total: 0,
    totalQuantity: 0,
  }

  const result: CartToCheckout = cart.reduce((a, c) => {
    const product = products.find((p) => p.id === c.id)

    if (!product) return a

    const variant = product.variants.find((v) => v.id == c.variant.id)

    if (!variant) return a

    const quantity = Math.min(variant.stock, c.quantity)

    const image =
      variant.image && typeof variant.image !== 'string'
        ? variant.image
        : product.images[0] && typeof product.images[0] != 'string'
          ? product.images[0]
          : null

    a.total = variant.pricing.value
    a.totalQuantity += quantity

    a.products.push({
      id: c.id,
      title: c.title,
      slug: c.slug,
      image,
      variant: {
        id: variant.id,
        name: variant.name,
        stock: variant.stock,
        pricing: variant.pricing,
      },
      quantity,
    })

    return a
  }, content)

  return result
}

export function checkCartInStock(cart: Cart, products: Pick<Product, 'id' | 'variants'>[]) {
  const cartErrors: { product: CartProduct; error: string }[] = []

  cart.forEach((c) => {
    const product = products.find((p) => p.id == c.id)
    const variant = product?.variants.find((v) => v.id == c.variant.id)

    if (!product || !variant) {
      cartErrors.push({ product: c, error: 'Product does not exist' })
      return
    }

    if (variant.stock == 0) {
      cartErrors.push({ product: c, error: 'Product out of stock' })
      return
    }

    if (c.quantity > variant.stock) {
      cartErrors.push({
        product: c,
        error: `Cart Overloaded. Maximum available quantity ${variant.stock}`,
      })
      return
    }
  })

  return cartErrors
}

/**
 * SHuld be used after Cart Stock is checked
 * @param cart
 * @param products
 * @returns number
 */
export function getCartCost(cart: Cart, products: Pick<Product, 'id' | 'variants'>[]) {
  let cost = 0
  let hasErrors = false

  cart.forEach((c) => {
    const product = products.find((p) => p.id == c.id)
    const variant = product?.variants.find((v) => v.id == c.variant.id)

    if (!product || !variant) {
      hasErrors = true
      return
    }

    if (variant.stock == 0) {
      hasErrors = true
      return
    }

    if (c.quantity > variant.stock) {
      hasErrors = true
      return
    }

    cost += variant.pricing.value
  })

  return cost
}

/**
 * Raw cart cost
 * Used in the UI
 * Should not be used for actual checkout
 */
export function calculateCartCost(cart: Cart) {
  return cart.reduce((a, c) => a + c.variant.pricing.value * c.quantity, 0)
}
