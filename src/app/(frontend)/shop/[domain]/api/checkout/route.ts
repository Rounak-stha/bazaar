import { getPayload } from 'payload'

import { getFilledProducts } from '@/lib/getFilledProducts'
import { getTotal } from '@/lib/getTotal'
import { type Cart } from '@/stores/CartStore/types'
import config from '@payload-config'

type RequestBody = {
  cart: Cart | undefined
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const { cart } = (await req.json()) as RequestBody
    if (!cart) {
      return Response.json({ status: 200 })
    }

    const { docs: products } = await payload.find({
      collection: 'products',
      where: {
        id: {
          in: cart.map((product) => product.id),
        },
      },
      select: {
        title: true,
        price: true,
        images: true,
        variants: true,
        enableVariants: true,
        enableVariantPrices: true,
        colors: true,
        slug: true,
        stock: true,
        sizes: true,
        weight: true,
        pricing: true,
      },
    })

    const filledProducts = getFilledProducts(products, cart)

    const total = getTotal(filledProducts)

    const productsWithTotalAndCouriers = {
      filledProducts,
      total,
      totalQuantity: filledProducts.reduce((acc, product) => acc + (product?.quantity ?? 0), 0),
    }

    return Response.json({ status: 200, productsWithTotalAndCouriers })
  } catch (error) {
    console.log(error)
    return Response.json({ status: 500, message: 'Internal server error' })
  }
}
