import { ShopContext } from '@/components/(storefront)/context/shop'
import { useContext } from 'react'

export const useShop = () => {
  const contextVal = useContext(ShopContext)

  if (!contextVal) {
    throw new Error('useShop must be used within a ShopProvider')
  }

  return contextVal
}
