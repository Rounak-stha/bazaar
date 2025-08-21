import { Media, type Product } from '@/payload-types'

export type CartProduct = Pick<Product, 'id' | 'title' | 'slug'> & {
  image: Media | null
  variant: Pick<Product['variants'][number], 'id' | 'name' | 'stock' | 'pricing'>
  quantity: number
}

export type Cart = CartProduct[]

export type CartToCheckout = {
  products: CartProduct[]
  total: number
  totalQuantity: number
}
