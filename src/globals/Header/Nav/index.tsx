'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { HeartIcon, ShoppingBagIcon } from 'lucide-react'
import { MobileMenuBar } from '../MobileMenubar'
import { useIsMobile } from '@/hooks/use-mobile'
import { useCartState } from '@/stores/CartStateStore'
import { useWishListState } from '@/stores/WishListStateStore'

type HeaderNavProps = {
  data: HeaderType
  disableCart?: boolean
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, disableCart }) => {
  const { toggleCart } = useCartState()
  const { toggleWishList } = useWishListState()
  const isMobile = useIsMobile()
  const navItems = data?.navItems || []

  const wishlist = [1]
  const totalQuantity = 1

  return (
    <nav className="flex-1 flex gap-3 items-center">
      <div className="flex-1 flex justify-center gap-4">
        {!isMobile &&
          navItems.map(({ link }, i) => {
            return <CMSLink key={i} {...link} appearance="link" />
          })}
      </div>
      {!disableCart && (
        <div className="flex gap-4 mr-2">
          <button onClick={toggleWishList} className="relative -m-2 cursor-pointer p-2">
            {wishlist && wishlist.length > 0 ? (
              <span className="bg-blue-600 absolute top-0 right-0 flex aspect-square h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                {wishlist.length}
              </span>
            ) : (
              ''
            )}
            <HeartIcon width={22} height={22} />
          </button>
          <button onClick={toggleCart} className="relative -m-2 cursor-pointer p-2">
            {totalQuantity && totalQuantity > 0 ? (
              <span className="bg-blue-600 absolute top-0 right-0 flex aspect-square h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                {totalQuantity}
              </span>
            ) : (
              ''
            )}
            <ShoppingBagIcon width={22} height={22} />
          </button>
        </div>
      )}
      <MobileMenuBar navItems={navItems} show={isMobile} />
    </nav>
  )
}
