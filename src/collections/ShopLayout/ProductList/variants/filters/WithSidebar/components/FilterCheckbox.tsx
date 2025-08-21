'use client'
import { Input } from '@/components/ui/input'
import { ParsedShopFilters } from '@/types/shop'
import { useSearchParams, useRouter } from 'next/navigation'
import { type ChangeEvent } from 'react'

export const FilterCheckbox = ({
  option,
  sectionId,
  optionIdx,
}: {
  option: ParsedShopFilters[number]['values'][number]
  sectionId: string
  optionIdx: number
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleCheckFilter = (e: ChangeEvent<HTMLInputElement>, filterType: string) => {
    const value = option.id
    const checked = e.target.checked

    const currentParams = new URLSearchParams(searchParams?.toString())

    const currentValues = currentParams.get(filterType)?.split(',') ?? []

    if (checked) {
      if (!currentValues.includes(value)) {
        currentValues.push(value)
      }
    } else {
      const index = currentValues.indexOf(value)
      if (index !== -1) {
        currentValues.splice(index, 1)
      }
    }

    if (currentValues.length > 0) {
      currentParams.set(filterType, currentValues.join(','))
    } else {
      currentParams.delete(filterType)
    }

    router.push(`?${currentParams.toString()}`)
  }

  return (
    <Input
      defaultValue={option.name}
      defaultChecked={option.checked}
      onChange={(e) => {
        handleCheckFilter(e, sectionId)
      }}
      id={`filter-${sectionId}-${optionIdx}`}
      name={`${sectionId}[]`}
      type="checkbox"
    />
  )
}
