import { getPayload } from 'payload'

import config from '@payload-config'
import { checkCartInStock, getCartCost, syncCart } from '@/utilities/cart/syncCart'
import { getCachedShopByDomain } from '@/utilities/shop/getShop'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { createSessionArgs, getHandlerForProvider, isProviderEnabled } from '@/payments'
import { CheckoutData } from '@/types/checkout'
import { Order } from '@/payload-types'

export async function POST(req: Request, { params }: { params: Promise<{ domain: string }> }) {
  try {
    const { domain } = await params
    const payload = await getPayload({ config })
    const shop = await getCachedShopByDomain(domain)()
    const checkoutData = (await req.json()) as CheckoutData
    const { cart, paymentProvider, address, cost } = checkoutData

    if (!cart) return Response.json({ message: 'Empty Cart' }, { status: 400 })
    if (!shop) return Response.json({ message: 'Invalid Shop' }, { status: 400 })
    if (!paymentProvider)
      return Response.json({ message: 'Invalid Payment Provider' }, { status: 400 })

    const paymentProviderDoc = await getCachedGlobal('paymentProviders', shop.id)()

    if (!paymentProviderDoc)
      return Response.json({ message: 'Payment not configured for shop' }, { status: 400 })

    const providerEnabled = isProviderEnabled(paymentProvider, paymentProviderDoc)
    const paymentHandler = getHandlerForProvider(paymentProvider)

    if (!providerEnabled || !paymentHandler)
      return Response.json({ message: 'Payment Provider not supported by shop' }, { status: 400 })

    const productIds = cart.map((c) => c.id)

    const paginatedProductsData = await payload.find({
      collection: 'products',
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        variants: true,
      },
    })

    if (paginatedProductsData.totalDocs == 0)
      return Response.json({ message: 'Invalid Cart' }, { status: 400 })

    const checkCartInStockResult = checkCartInStock(cart, paginatedProductsData.docs)
    const priceForItemsInCart = getCartCost(cart, paginatedProductsData.docs)

    if (checkCartInStockResult.length > 0) {
      return Response.json({ error: 'Low Stock', data: checkCartInStockResult }, { status: 400 })
    }

    if (priceForItemsInCart !== cost.total) {
      return Response.json({ error: 'Invaid Cost', data: checkCartInStockResult }, { status: 400 })
    }

    let order = await payload.create({
      collection: 'orders',
      data: {
        paymentStatus: 'unpaid',
        status: 'pending',
        total: cost.total,
        shippingCost: 0,
        subtotal: cost.subTotal,
        shop: shop.id,
        // the rest of the items data is automatically snapshotted from the order collection hooks
        items: cart.map(
          (p) =>
            ({
              productId: p.id,
              variantId: p.variant.id!,
              quantity: p.quantity,
            }) as Order['items'][number],
        ),
        shippingAddress: {
          city: address.city,
          fullName: address.fullName,
          phone: address.phone,
          province: address.province,
          street: address.street,
          email: address.email,
        },
      },
    })

    const transaction = await payload.create({
      collection: 'transactions',
      data: {
        shop: shop.id,
        amount: cost.total,
        currency: 'NPR',
        order: order.id,
        provider: paymentProvider,
        providerTransactionId: order.id, // will be replaced by payment provider transaction id
        status: 'pending',
      },
    })

    const sessionArgs = createSessionArgs({
      order,
      transaction,
      checkoutData,
      shop,
      paymentDoc: paymentProviderDoc,
    })
    const { redirectUrl, reference, raw } = await paymentHandler.createCheckoutSession(sessionArgs)

    await payload.update({
      collection: 'transactions',
      where: {
        id: {
          equals: transaction.id,
        },
      },
      data: {
        providerTransactionId: reference,
        metadata: raw as object,
      },
    })

    return Response.json({ redirectUrl })
  } catch (error) {
    console.log(error)
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
