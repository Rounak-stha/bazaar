import { Order, Transaction } from '@/payload-types'
import { CollectionAfterChangeHook } from 'payload'

export const updateRelatedRecordOnSuccess: CollectionAfterChangeHook<Transaction> = (args) => {
  if (args.doc.status === 'failed' && args.previousDoc?.status === 'success') {
    return args.doc
  }

  if (args.doc.status == 'success') {
    return handleSuccessfulTransaction(args)
  }

  if (
    args.doc.status == 'user_cancelled' ||
    args.doc.status == 'failed' ||
    args.doc.status == 'expired'
  ) {
    return handleFailedTransaction(args)
  }
}

async function handleSuccessfulTransaction(
  args: Parameters<CollectionAfterChangeHook<Transaction>>[number],
) {
  const transaction = args.doc
  const orderId = typeof transaction.order == 'string' ? transaction.order : transaction.order.id
  const payload = args.req.payload

  // Update Order Status
  const order = await payload.update({
    collection: 'orders',
    id: orderId,
    data: {
      status: 'paid',
      paymentStatus: 'paid',
    },
  })

  // Update Product Stock and Bought Statistics
  const paginatedProductData = await payload.find({
    collection: 'products',
    where: {
      id: {
        in: order.items.map((i) => i.productId),
      },
    },
    select: {
      variants: true,
      bought: true,
    },
  })

  if (paginatedProductData.totalDocs == 0) return

  const products = paginatedProductData.docs

  const productUpdatePromise: Promise<any>[] = []

  const orderedProducts = order.items.reduce(
    (a, c) => {
      if (!a[c.productId]) {
        a[c.productId] = []
      }

      a[c.productId].push({ id: c.variantId, quantity: c.quantity })

      return a
    },
    {} as { [id: string]: { id: string; quantity: number }[] },
  )

  Object.entries(orderedProducts).forEach(([productId, orderedVariants]) => {
    const product = products.find((p) => p.id === productId)

    if (!product) return

    const updatedVariants = [...product.variants]

    let quantity = 0

    orderedVariants.forEach((orderedVariant) => {
      const variantToUpdate = updatedVariants.find((uv) => uv.id == orderedVariant.id)
      if (variantToUpdate) {
        const newStock = variantToUpdate.stock - orderedVariant.quantity
        // If new stock is less than 0, then we have a case of Over_Bought
        // Need to think about this
        variantToUpdate.stock = newStock < 0 ? 0 : newStock
        quantity += orderedVariant.quantity
      }
    })

    productUpdatePromise.push(
      payload.update({
        collection: 'products',
        id: productId,
        data: {
          variants: updatedVariants,
          bought: product.bought + quantity,
        },
      }),
    )
  })

  await Promise.all(productUpdatePromise)

  return args.doc
}

async function handleFailedTransaction(
  args: Parameters<CollectionAfterChangeHook<Transaction>>[number],
) {
  const transaction = args.doc
  const orderId = typeof transaction.order == 'string' ? transaction.order : transaction.order.id
  const payload = args.req.payload

  const newPaymetStatus: Order['paymentStatus'] | null = (() => {
    switch (transaction.status) {
      case 'failed':
        return 'failed'
      case 'expired':
        return 'failed'
      case 'user_cancelled':
        return 'unpaid'
    }

    return null
  })()

  if (newPaymetStatus) {
    // Update Order Status
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        paymentStatus: newPaymetStatus,
      },
    })
  }

  return args.doc
}
