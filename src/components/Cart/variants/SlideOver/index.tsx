'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { useCartState } from '@/stores/CartStateStore'

export const SlideOver = () => {
  const { isOpen, toggleCart } = useCartState()
  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>Here goes all items in cart</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
