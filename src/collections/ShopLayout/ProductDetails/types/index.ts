import { type Media } from '@/payload-types'

export type FilledVariant = {
  color:
    | {
        label: string
        slug: string
        colorValue: string
        id?: string | null
      }
    | undefined
  size:
    | {
        label: string
        slug: string
        id?: string | null
      }
    | undefined
  slug: string
  stock: number
  image: Media | null | undefined
  pricing:
    | {
        value: number
        currency: 'NPR'
        id?: string | null
      }[]
    | null
    | undefined
}
