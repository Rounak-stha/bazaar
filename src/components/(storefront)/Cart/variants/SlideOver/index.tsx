'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { useCartState } from '@/stores/CartStateStore'
import { CartContents } from '../../components/content'

export const SlideOver = () => {
  const { isOpen, toggleCart } = useCartState()
  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <CartContents toggleCart={toggleCart} />
      </SheetContent>
    </Sheet>
  )
}
