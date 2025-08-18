'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { useWishListState } from '@/stores/WishListStateStore'

// TODO (optional): Merge with Cart into one reusable component, as it's very similar.
export const SlideOver = () => {
  const { isOpen, toggleWishList } = useWishListState()

  return (
    <Sheet open={isOpen} onOpenChange={toggleWishList}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Wishlist</SheetTitle>
          <SheetDescription>Here goes all items in wishlist</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
