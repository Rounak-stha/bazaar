import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { ShopLayoutSlug } from '@/globals/constants'
import { Accordion } from '@/blocks/Accordion/config'
import { Banner } from '@/blocks/Banner/config'
import { Carousel } from '@/blocks/Carousel/config'
import { Code } from '@/blocks/Code/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { revalidateShopayout } from './hooks/revalidateShopLayout'

import type { CollectionConfig } from 'payload'

export const ShopLayout: CollectionConfig = {
  slug: ShopLayoutSlug,
  labels: {
    singular: 'Shop Layout',
    plural: 'Shop Layout',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Shop Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          name: 'productDetails',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'With image gallery and expandable details',
                  value: 'WithImageGalleryExpandableDetails',
                },
              ],
              label: 'Type of product card',
              required: true,
              defaultValue: 'WithImageGalleryExpandableDetails',
            },
            {
              name: 'reviewsEnabled',
              type: 'checkbox',
              label: 'Enable product reviews',
              defaultValue: true,
              required: true,
            },
          ],
        },
        {
          label: 'Product List',
          name: 'productList',
          fields: [
            {
              name: 'filters',
              type: 'select',
              label: 'Filters',
              required: true,
              options: [
                {
                  label: 'None',
                  value: 'none',
                },
                {
                  label: 'With sidebar',
                  value: 'withSidebar',
                },
                {
                  label: 'Sort only',
                  value: 'sortOnly',
                },
              ],
            },
          ],
        },
        {
          label: 'Cart and Wishlist',
          name: 'cartAndWishlist',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'Slide-over',
                  value: 'slideOver',
                },
              ],
              label: 'Type of cart and wishlist',
              defaultValue: 'slideOver',
              required: true,
            },
          ],
        },
        {
          label: 'Checkout page',
          name: 'checkout',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'One Step With Summary',
                  value: 'OneStepWithSummary',
                },
              ],
              label: 'Type of checkout page',
              required: true,
              defaultValue: 'OneStepWithSummary',
            },
          ],
        },
        {
          label: 'Client panel',
          name: 'clientPanel',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'With sidebar',
                  value: 'withSidebar',
                },
              ],
              label: 'Type of client panel',
              required: true,
              defaultValue: 'withSidebar',
            },
            {
              name: 'help',
              type: 'group',
              label: 'Help page',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'content',
                  type: 'richText',
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                        BlocksFeature({
                          blocks: [Banner, Code, MediaBlock, Accordion, Carousel, FormBlock],
                        }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                        HorizontalRuleFeature(),
                      ]
                    },
                  }),
                  label: 'Content',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateShopayout],
  },
}
