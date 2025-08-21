import { type ReactNode } from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { SlideOver } from './variants/SlideOver'

export const Cart = async () => {
  try {
    const { cartAndWishlist } = await getCachedGlobal('shopLayout', 1)()

    let CartComponent: ReactNode = null
    switch (cartAndWishlist.type) {
      case 'slideOver':
        CartComponent = <SlideOver />
        break
    }

    return CartComponent
  } catch (error) {
    console.log(error)
  }
}
