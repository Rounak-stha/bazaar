'use client'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { type ReactNode, useEffect, useState } from 'react'

import { Media } from '@/components/Media'
import type { Media as MediaType, Product } from '@/payload-types'

export const ProductGallery = ({
  images,
  selectedVariant,
}: {
  selectedVariant?: Product['variants'][number]
  images: MediaType[]
}) => {
  const [selectedTab, setSelectedTab] = useState(0)

  useEffect(() => {
    if (selectedVariant) {
      const selectedVariantImageId =
        typeof selectedVariant.image == 'string' ? selectedVariant.image : selectedVariant.image?.id
      const index = images.findIndex((image) => image.id == selectedVariantImageId)
      if (index !== -1) setSelectedTab(index)
    }
  }, [selectedVariant])

  return (
    <TabGroup
      defaultIndex={0}
      selectedIndex={selectedTab}
      onChange={(index) => {
        setSelectedTab(index)
      }}
      className="flex flex-col-reverse"
    >
      {/* Image selector - client */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <TabList className="grid grid-cols-4 gap-6">
          {/* This has to be on client and recieve state */}
          {images.map((image, index) => (
            <Tab
              key={image.id}
              className="focus:ring-3 focus:outline-hidden focus:ring-main-500/50 group relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:ring-offset-4"
            >
              <span className="sr-only">{image.alt}</span>
              <span
                className={`absolute inset-0 overflow-hidden rounded-md border-solid border-primary ${index == selectedTab ? 'border' : ''}`}
              >
                <Media resource={image} className="size-full object-cover" />
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-main-500"
              />
            </Tab>
          ))}
        </TabList>
      </div>

      <TabPanels>
        {images.map((image) => (
          <TabPanel key={image.id}>
            <Media resource={image} className="aspect-square w-full object-cover sm:rounded-lg" />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  )
}
