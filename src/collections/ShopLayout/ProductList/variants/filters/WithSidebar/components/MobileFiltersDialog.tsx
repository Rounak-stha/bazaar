'use client'

import { Sheet, SheetHeader, SheetTitle, SheetContent } from '@/components/ui/sheet'
import { type ReactNode } from 'react'

import { useMobileFilters } from '../stores/MobileFiltersContext'

export const MobileFiltersDialog = ({ children }: { children: ReactNode }) => {
  const { mobileFiltersOpen, setMobileFiltersOpen } = useMobileFilters()
  return (
    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
