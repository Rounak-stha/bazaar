'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { type ReactNode } from 'react'

import { useMobileFilters } from '../stores/MobileFiltersContext'

export const MobileFiltersDialog = ({ children }: { children: ReactNode }) => {
  const { mobileFiltersOpen, setMobileFiltersOpen } = useMobileFilters()
  return (
    <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
