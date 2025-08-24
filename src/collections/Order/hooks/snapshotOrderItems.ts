import { Order } from '@/payload-types'
import type { CollectionBeforeValidateHook } from 'payload'

export const snapshotOrderItems: CollectionBeforeValidateHook<Order> = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data
  if (!data?.items) return data

  const productIds = data.items.map((i) => i.productId).filter((id) => typeof id == 'string')

  const paginatedProductData = await req.payload.find({
    collection: 'products',
    where: {
      id: {
        in: productIds,
      },
    },
    depth: 1,
  })

  if (paginatedProductData.totalDocs == 0) throw new Error('Invalid Order. No Product Found')

  // Iterate over each item
  const newItems = data.items.map((item) => {
    if (!item.productId) throw new Error('Invalid Order. No Product')

    // Fetch product (with variants populated)
    const product = paginatedProductData.docs.find((p) => p.id == item.productId)

    if (!product) throw new Error('Invalid Order. No Product')

    // Find the variant being purchased
    const variant = product.variants?.find((v: any) => v.id === item.variantId)
    if (!variant) throw new Error('Invalid Order. No Variant Found')

    let image = variant.image || product.images?.[0]

    if (image && typeof image == 'object') {
      image = image.id
    }

    const snapshot: Order['items'][number] = {
      ...item,
      sku: variant.sku,
      productTitle: product.title,
      variantName: variant.name,
      options:
        variant.options?.map((opt) => ({
          type: typeof opt.type === 'object' ? opt.type.name : opt.type,
          value: typeof opt.value === 'object' ? opt.value.name : opt.value,
        })) ?? [],
      pricing: variant.pricing,
      image,
    }

    return snapshot
  })

  return { ...data, items: newItems }
}
