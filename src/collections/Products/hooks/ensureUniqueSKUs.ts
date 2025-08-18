import { Product } from '@/payload-types'
import { CollectionBeforeValidateHook, ValidationError } from 'payload'

export const ensureUniqueSKUs: CollectionBeforeValidateHook<Product> = async ({
  data,
  req,
  originalDoc,
}) => {
  const seenSkus = new Set<string>()
  const variantIndexWithDuplicateSkus: number[] = []

  const skus =
    data?.variants
      ?.map((v, i) => {
        if (seenSkus.has(v.sku)) {
          variantIndexWithDuplicateSkus.push(i)
        } else {
          seenSkus.add(v.sku)
        }
        return v.sku
      })
      .filter(Boolean) || []

  if (!skus.length) return data
  if (variantIndexWithDuplicateSkus.length)
    throw new ValidationError({
      errors: variantIndexWithDuplicateSkus.map((index) => ({
        message: 'Duplicate SKU',
        path: `variants.${index}.sku`, // This should match your field name,
        label: 'Variant SKU: Duplicate SKU',
      })),
    })

  const existingProducts = await req.payload.find({
    collection: 'products',
    where: {
      'variants.sku': {
        in: skus,
      },
      id: {
        not_equals: originalDoc?.id, // ignore current product
      },
    },
    select: {
      variants: {
        sku: true,
      },
    },
    limit: 1,
  })

  if (existingProducts.totalDocs > 0) {
    existingProducts.docs.forEach((product) => {
      product.variants.forEach((variant) => {
        const dataIndex = data?.variants?.findIndex((v) => v.sku == variant.sku)
        console.log({ dataIndex, variant })
        if (dataIndex != undefined && dataIndex != -1) {
          variantIndexWithDuplicateSkus.push(dataIndex)
        }
      })
    })

    throw new ValidationError({
      errors: variantIndexWithDuplicateSkus.map((index) => ({
        message: 'Duplicate SKU',
        path: `variants.${index}.sku`, // This should match your field name,
        label: 'Variant SKU: Duplicate SKU',
      })),
    })
  }

  return data
}
