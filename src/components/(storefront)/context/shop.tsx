'use client'

import { Shop } from '@/payload-types'
import { createContext, FC } from 'react'

type ShopContext = {
  shop: Shop
}

/**
 * Context to store organization data
 * NOTE: The initial data is empty values, the actual data is set by the provider
 * Context will always be used by components under protected routes
 * For the ease of use by avoiding null check and for cleaner code
 * I am not 100% sure if this approach is correct or safe but I find it quite tedious to always perform a null check everywhere I use the hook
 */
export const ShopContext = createContext<ShopContext>({
  shop: {
    id: '',
    name: '',
    domain: '',
    createdAt: '',
    updatedAt: '',
  },
})

type ShopProviderProps = {
  children: React.ReactNode
  shop: Shop
}

// Provider component
export const ShopProvider: FC<ShopProviderProps> = ({ children, shop }) => {
  return <ShopContext.Provider value={{ shop }}>{children}</ShopContext.Provider>
}
