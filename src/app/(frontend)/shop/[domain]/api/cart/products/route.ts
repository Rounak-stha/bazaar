import { getPayload } from 'payload'

import { CartProduct, CartToCheckout, type Cart } from '@/stores/CartStore/types'
import config from '@payload-config'

type RequestBody = {
  cart: Cart
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const { cart } = (await req.json()) as RequestBody

    if (!cart) return Response.json({ message: 'Empty Cart' }, { status: 400 })

    const productIds = cart.map((c) => c.id)

    const paginatedProductsData = await payload.find({
      collection: 'products',
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        title: true,
        images: true,
        variants: true,
        slug: true,
      },
    })

    const cartProduct = [] as CartProduct[]

    const content: CartToCheckout = {
      products: cartProduct,
      total: 0,
      totalQuantity: 0,
    }

    if (paginatedProductsData.totalDocs == 0)
      return Response.json({ message: 'Invalid Cart' }, { status: 400 })

    const result: CartToCheckout = cart.reduce((a, c) => {
      const product = paginatedProductsData.docs.find((p) => p.id === c.id)

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

    return Response.json({ data: result })
  } catch (error) {
    console.log(error)
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
