import { Product } from '@/payload-types'

/**
 * Build a stable string "signature" of product options.
 *
 * Why:
 * - We only care about changes that impact variant generation
 *   (active state, name, and values).
 * - This avoids unnecessary re-generation when unrelated fields
 *   (like admin notes or UI-only fields) are changed.
 *
 * Guarantees:
 * - Stable ordering: We sort arrays and object keys so that
 *   JSON.stringify produces the same output for semantically
 *   identical options.
 * - Minimal surface area: Only the subset of fields relevant
 *   for variants are included.
 */
export function optionsSignature(options: Product['options']): string {
  if (!options) return ''

  // Normalize each option
  const normalized = options
    .filter((opt) => opt.type && opt.values)
    ?.map((opt) => ({
      type: typeof opt.type == 'string' ? opt.type : opt.type.id,
      values: opt.values
        .map((v) => {
          if (typeof v == 'string') return v
          return v.id
        })
        // Handle case when a new option is added but value is not added
        .filter(Boolean)
        // ensure deterministic ordering (stable signature)
        .sort((a, b) => a.localeCompare(b) || String(a).localeCompare(String(b))),
    }))
    // Handle initial case of new option create when name and values are not yet added
    .filter((option) => Boolean(option.type) && option.values.length > 0)

  // Sort options themselves to avoid order-sensitive mismatches
  normalized.sort((a, b) => a.type.localeCompare(b.type))

  // Deterministic string output
  return JSON.stringify(normalized)
}
