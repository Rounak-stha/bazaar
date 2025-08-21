import axios from 'axios'
import { create } from 'zustand'

import canUseDOM from '@/utilities/canUseDOM'

import { CartProduct, type Cart } from './types'
import { Product } from '@/payload-types'

type CartState = {
  cart: Cart | null
  setCart: (cartToSet: Cart | null) => void
  updateCart: (cartToSet: Cart) => void
  removeFromCart: (productId: string, variantSlug?: string) => void
  synchronizeCart: () => Promise<void>
}

export const convertToCartProduct = (
  product: Product,
  variant: Product['variants'][number],
  quantity: number,
): CartProduct => ({
  id: product.id,
  title: product.title,
  slug: product.slug,
  image:
    variant.image && typeof variant.image !== 'string'
      ? variant.image
      : product.images[0] && typeof product.images[0] !== 'string'
        ? product.images[0]
        : null,
  quantity: quantity,
  variant: {
    id: variant.id as string,
    name: variant.name,
    stock: variant.stock,
    pricing: variant.pricing,
  },
})

const saveCartToUserAccount = async (cart: Cart) => {
  try {
    await axios.post('/next/cart', cart)
  } catch (error) {
    console.error('Failed to save cart to UserAccount:', error)
  }
}

const fetchCartFromUserAccount = async (): Promise<Cart | null> => {
  try {
    const { data } = await axios.get<{ data: Cart; status: number }>('/next/cart')
    if (data.status === 400) return null
    return data.data
  } catch (error) {
    console.error('Failed to fetch cart from UserAccount:', error)
    return null
  }
}

const debouncedFetchCartFromUserAccount = fetchCartFromUserAccount

const debouncedSaveCartToUserAccount = saveCartToUserAccount

const useCartStore = create<CartState>((set) => ({
  cart: canUseDOM
    ? (() => {
        const cartData = window.localStorage.getItem('cart')
        if (cartData && cartData.length > 1) {
          try {
            return cartData ? (JSON.parse(cartData) as Cart) : []
          } catch (error) {
            console.error('Error parsing cart data from localStorage', error)
            return []
          }
        } else {
          return []
        }
      })()
    : null,

  setCart: (cartToSet: Cart | null) => {
    if (canUseDOM) {
      window.localStorage.setItem('cart', JSON.stringify(cartToSet))
    }
    // cartToSet && debouncedSaveCartToUserAccount(cartToSet)
    set({ cart: cartToSet })
  },

  updateCart: (cartToSet: Cart) => {
    set((state) => {
      const prevCart = state.cart

      if (prevCart === null) {
        if (canUseDOM) {
          window.localStorage.setItem('cart', JSON.stringify(cartToSet))
        }
        // void debouncedSaveCartToUserAccount(cartToSet)
        return { cart: cartToSet }
      }

      const updatedCart = [...prevCart]

      cartToSet.forEach((newProduct) => {
        const existingProductIndex = updatedCart.findIndex(
          (product) => product.id === newProduct.id && product.variant.id === newProduct.variant.id,
        )

        if (existingProductIndex >= 0) {
          updatedCart[existingProductIndex].quantity = newProduct.quantity
        } else {
          updatedCart.push(newProduct)
        }
      })

      if (canUseDOM) {
        window.localStorage.setItem('cart', JSON.stringify(updatedCart))
      }
      // void debouncedSaveCartToUserAccount(updatedCart)
      return { cart: updatedCart }
    })
  },

  removeFromCart: (productId: string, variantId?: string) => {
    set((state) => {
      const updatedCart = state.cart?.filter((product) => {
        if (variantId) {
          return product.id !== productId || product.variant.id !== variantId
        }
        return product.id !== productId
      })

      if (canUseDOM) {
        window.localStorage.setItem('cart', JSON.stringify(updatedCart))
      }
      // void debouncedSaveCartToUserAccount(updatedCart ?? [])
      return { cart: updatedCart }
    })
  },

  synchronizeCart: async () => {
    if (!canUseDOM) return

    const cartFromLocalStorage = JSON.parse(window.localStorage.getItem('cart') ?? '[]') as Cart
    const cartFromUserAccount = await debouncedFetchCartFromUserAccount()

    if (!cartFromUserAccount) {
      if (cartFromLocalStorage.length > 0) {
        // void debouncedSaveCartToUserAccount(cartFromLocalStorage)
      }
      return
    }

    window.localStorage.setItem('cart', JSON.stringify(cartFromUserAccount))
    set({ cart: cartFromUserAccount })
  },
}))

export const useCart = () => useCartStore((state) => state)
