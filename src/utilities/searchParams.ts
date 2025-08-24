import { SearchParams } from '@/types/next'
import { StringToString } from '@/types/utilities'

export function parseSearchParamsValueAsString(searchParams: SearchParams): StringToString {
  return Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      typeof value == 'string' ? value : Array.isArray(value) ? value.join('') : '',
    ]),
  )
}
