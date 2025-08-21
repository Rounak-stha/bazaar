'use client'

import { FilterIcon } from 'lucide-react'

import { useMobileFilters } from '../stores/MobileFiltersContext'

export const MobileFunnelFiltersButton = () => {
  const { setMobileFiltersOpen } = useMobileFilters()

  return (
    <button
      type="button"
      onClick={() => setMobileFiltersOpen(true)}
      className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
    >
      <span className="sr-only">Filters</span>
      <FilterIcon aria-hidden="true" size={20} />
    </button>
  )
}
