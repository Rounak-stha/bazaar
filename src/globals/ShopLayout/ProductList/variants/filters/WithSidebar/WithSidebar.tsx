import 'server-only'

import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { type ReactNode } from 'react'

import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type Product, type ProductCategory } from '@/payload-types'

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

        {/* <MobileFiltersDialog>
          <div className="fixed inset-0 z-40 flex">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">{t("filters")}</h2>
                <MobileFiltersCloseButton />
              </div>

              <form className="mt-4 border-t border-gray-200">
                <Accordion>


                {filters.map(
                  (section) =>
                    section.options.length > 0 && (
                      <Disclosure
                        defaultOpen={Boolean(section.options.find((option) => option.checked))}
                        key={section.id}
                        as="div"
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        <h3 className="-mx-2 -my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                              <MinusIcon
                                aria-hidden="true"
                                className="size-5 group-[&:not([data-open])]:hidden"
                              />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex gap-3">
                                <div className="flex h-5 shrink-0 items-center">
                                  <div className="group grid size-4 grid-cols-1">
                                    <FilterCheckbox
                                      option={option}
                                      sectionId={section.id}
                                      optionIdx={optionIdx}
                                    />
                                    <svg
                                      fill="none"
                                      viewBox="0 0 14 14"
                                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                    >
                                      <path
                                        d="M3 8L6 11L11 3.5"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-0 group-has-checked:opacity-100"
                                      />
                                      <path
                                        d="M3 7H11"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-0 group-has-indeterminate:opacity-100"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </Disclosure>
                    ),
                )}
                </Accordion>
              </form>
          </div>
        </MobileFiltersDialog>
 */}
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
                <Accordion type="single">
                  {shopFilters.map((filter) => (
                    <AccordionItem key={filter.name} value={filter.name}>
                      <AccordionTrigger>
                        <span className="font-medium text-gray-900">{filter.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-[&:not([data-open])]:hidden"
                          />
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {filter.values.map((value, optionIdx) => (
                            <div key={value.name} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <FilterCheckbox
                                    option={value}
                                    sectionId={value.name}
                                    optionIdx={optionIdx}
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                  >
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-checked:opacity-100"
                                    />
                                    <path
                                      d="M3 7H11"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-indeterminate:opacity-100"
                                    />
                                  </svg>
                                </div>
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
