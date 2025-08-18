import type { CollectionBeforeChangeHook } from 'payload'

import { Product } from '@/payload-types'
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
}) => {
  const newOptions = data?.options
  const oldOptions = originalDoc?.options

  console.log({ optionsEqual: optionsEqual(newOptions, oldOptions) })
  // only regenerate if options actually changed
  if (optionsEqual(newOptions, oldOptions)) return data

  // 1. Collect option values
  const optionGroups =
    newOptions
      ?.map((opt) => {
        if (!opt?.type || !opt?.values?.length) return []

        return opt.values.map((val) => ({
          type: typeof opt.type === 'string' ? opt.type : opt.type.id,
          typeLabel: typeof opt.type === 'string' ? opt.type : opt.type.name,
          value: typeof val === 'string' ? val : val.id,
          valueLabel: typeof val === 'string' ? val : val.name,
        }))
      })
      .filter((vals) => vals.length > 0) || []

  if (optionGroups.length === 0) return data

  // 2. Cartesian product
  const combos = cartesianProduct(optionGroups)

  // 3. Preserve existing variants where possible
  const existingVariants = originalDoc?.variants ?? []

  const newVariants = combos.map((combo) => {
    const name = combo.map((c) => c.valueLabel || c.value).join(' / ')

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
