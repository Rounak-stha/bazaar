import 'server-only'

import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion'
import { type ReactNode } from 'react'

import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { FilterCheckbox } from './components/FilterCheckbox'
import { MobileFiltersCloseButton } from './components/MobileFiltersCloseButton'
import { MobileFiltersDialog } from './components/MobileFiltersDialog'
import { MobileFunnelFiltersButton } from './components/MobileFunnelFiltersButton'
import { SortSelect } from './components/SortSelect'
import { ParsedShopFilters } from '@/types/shop'

export const WithSidebar = ({
  title,
  shopFilters,
  sortBy,
  children,
}: {
  title: string
  shopFilters: ParsedShopFilters
  sortBy: string
  children: ReactNode
}) => {
  const sortOptions = [
    { label: 'Most Popular', value: 'most-popular' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price Low to High', value: 'priceasc' },
    { label: 'Price High to Low', value: 'pricedesc' },
  ]

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog  - client, but server children */}

        <MobileFiltersDialog>
          <form className="mt-4 border-t border-gray-200">
            <Filters shopFilters={shopFilters} />
          </form>
        </MobileFiltersDialog>

        <main className="container mx-auto">
          <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pt-16 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{title}</h1>

            <div className="flex items-center">
              <SortSelect defaultValue={sortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="py-1">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SortSelect>

              <MobileFunnelFiltersButton />
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <Filters shopFilters={shopFilters} />
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {children}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function Filters({ shopFilters }: { shopFilters: ParsedShopFilters }) {
  return (
    <Accordion type="multiple">
      {shopFilters.map((filter) => (
        <AccordionItem key={filter.name} value={filter.name}>
          <AccordionTrigger>
            <span className="font-medium text-gray-900">{filter.name}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {filter.values.map((value, optionIdx) => (
                <div key={value.id} className="flex gap-3">
                  <div className="flex h-5 shrink-0 items-center">
                    <FilterCheckbox option={value} sectionId={filter.name} optionIdx={optionIdx} />
                  </div>
                  <label
                    htmlFor={`filter-${filter.name}-${optionIdx}`}
                    className="text-sm text-gray-600"
                  >
                    {value.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
