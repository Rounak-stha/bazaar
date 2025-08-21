import type { CollectionBeforeChangeHook } from 'payload'

import { Product, ProductOption, ProductOptionValue } from '@/payload-types'
import { optionsSignature } from '../utilities'

function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>((acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])), [[]])
}

function optionsEqual(a: Product['options'], b: Product['options']) {
  return optionsSignature(a) === optionsSignature(b)
}

export const generateVariantsFromOptions: CollectionBeforeChangeHook<Product> = async ({
  data,
  originalDoc,
  req,
}) => {
  const newOptions = data?.options
  const oldOptions = originalDoc?.options

  console.log({ optionsEqual: optionsEqual(newOptions, oldOptions) })
  // only regenerate if options actually changed
  if (optionsEqual(newOptions, oldOptions)) return data

  // 1. Collect unique IDs
  const typeIDs = new Set<string>()
  const valueIDs = new Set<string>()

  for (const opt of newOptions ?? []) {
    if (typeof opt?.type === 'string') typeIDs.add(opt.type)
    else if (opt?.type?.id) typeIDs.add(opt.type.id)

    for (const val of opt?.values || []) {
      if (typeof val === 'string') valueIDs.add(val)
      else if (val?.id) valueIDs.add(val.id)
    }
  }

  // 2. Fetch in batches
  const [typeDocs, valueDocs] = await Promise.all([
    typeIDs.size
      ? req.payload.find({
          collection: 'productOptions',
          where: { id: { in: Array.from(typeIDs) } },
          limit: 1000,
        })
      : { docs: [] },
    valueIDs.size
      ? req.payload.find({
          collection: 'productOptionValues',
          where: { id: { in: Array.from(valueIDs) } },
          limit: 1000,
        })
      : { docs: [] },
  ])

  // 3. Build lookup maps
  const typeMap = new Map<string, ProductOption>(typeDocs.docs.map((d: any) => [d.id, d]))
  const valueMap = new Map<string, ProductOptionValue>(valueDocs.docs.map((d: any) => [d.id, d]))

  // 1. Collect option values
  const optionGroups =
    newOptions
      ?.map((option) => {
        if (!option?.type || !option?.values?.length) return []

        const productOption =
          typeof option.type === 'string' ? typeMap.get(option.type) : option.type
        if (!productOption) return []

        const res = option.values
          .map((val) => {
            const productOptionValue = typeof val === 'string' ? valueMap.get(val) : val
            if (!productOptionValue) return null
            return {
              type: productOption.id,
              typeLabel: productOption.name,
              value: productOptionValue.id,
              valueLabel: productOptionValue.name,
            }
          })
          .filter((v): v is NonNullable<typeof v> => v !== null)
        return res
      })
      .filter((vals) => vals.length > 0) || []

  if (optionGroups.length === 0) return data

  // 4. Cartesian product
  const combos = cartesianProduct(optionGroups)

  // 5. Preserve existing variants where possible
  const existingVariants = originalDoc?.variants ?? []

  const newVariants = combos.map((combo) => {
    const name = data.title + combo.map((c) => ` ${c.valueLabel}`).join(' ')

    const existing = existingVariants.find((v) => v.name === name)

    return {
      ...existing,
      name,
      sku: existing?.sku || `${data.slug}-${name.replace(/\s+/g, '-')}`,
      stock: existing?.stock ?? 0,
      pricing: existing?.pricing ?? { value: 0, currency: 'NPR' },
      options: combo.map((c) => ({
        type: c.type,
        value: c.value,
      })),
    }
  })

  data.variants = newVariants
  return data
}
