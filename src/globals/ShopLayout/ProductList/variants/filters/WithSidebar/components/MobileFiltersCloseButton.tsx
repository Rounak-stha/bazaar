'use client'

import { XIcon } from 'lucide-react'

import { useMobileFilters } from '../stores/MobileFiltersContext'

export const MobileFiltersCloseButton = () => {
  const { setMobileFiltersOpen } = useMobileFilters()
  return (
    <button
      type="button"
      onClick={() => setMobileFiltersOpen(false)}
      className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
    >
      <span className="sr-only">Close Filters</span>
      <XIcon aria-hidden="true" size={24} />
    </button>
  )
}
