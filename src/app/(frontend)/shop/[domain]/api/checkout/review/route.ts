import { getPayload } from 'payload'

import { CartProduct, CartToCheckout, type Cart } from '@/stores/CartStore/types'
import config from '@payload-config'
import { syncCart } from '@/utilities/cart/syncCart'
import { getCachedShopByDomain } from '@/utilities/shop/getShop'

type RequestBody = {
  cart: Cart
}

export async function POST(req: Request, { params }: { params: Promise<{ domain: string }> }) {
  try {
    const { domain } = await params
    const payload = await getPayload({ config })
    const shop = getCachedShopByDomain(domain)
    const { cart } = (await req.json()) as RequestBody

    if (!cart) return Response.json({ message: 'Empty Cart' }, { status: 400 })
    if (!shop) return Response.json({ message: 'Invalid Shop' }, { status: 400 })

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

    if (paginatedProductsData.totalDocs == 0)
      return Response.json({ message: 'Invalid Cart' }, { status: 400 })

    const result = syncCart(cart, paginatedProductsData.docs)
    return Response.json({ data: result })
  } catch (error) {
    console.log(error)
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
