import { type CollectionConfig, FilterOptions } from 'payload'

import { currencyField } from '@/fields/currencyField'
import { defaultLexical } from '@/fields/defaultLexical'
import { slugField } from '@/fields/slug'
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'
import { adminOrPublished } from '@/access/adminOrPublished'
import { ensureUniqueSKUs } from './hooks/ensureUniqueSKUs'
import { generateVariantsFromOptions } from './hooks/generateVariantsFromOptions'
import { Product } from '@/payload-types'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: adminOrPublished,
    update: superAdminOrTenantAdminAccess,
  },
  admin: {
    defaultColumns: ['title', 'bought', 'categories', 'options', 'variants'],
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  hooks: {
    beforeValidate: [ensureUniqueSKUs],
    beforeChange: [generateVariantsFromOptions],
  },
  fields: [
    {
      name: 'title',
      label: 'Product name',
      type: 'text',
      localized: true,
      required: true,
    },
    ...slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'description',
              label: 'Product Description',
              localized: true,
              type: 'richText',
              editor: defaultLexical,
            },
            {
              name: 'images',
              label: 'Product images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              maxRows: 10,
              minRows: 1,
              required: true,
              admin: {
                description: 'If you have variants, first image will be variant image.',
              },
            },
            {
              name: 'details',
              type: 'array',
              label: 'Details',
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'content',
                  label: 'Content',
                  required: true,
                  type: 'richText',
                  editor: defaultLexical,
                },
              ],
            },
          ],
        },
        {
          label: 'Options',
          admin: {
            description: 'Variants are automatically generated from active options',
          },
          fields: [
            {
              name: 'options',
              type: 'array',
              label: 'Product Options',
              fields: [
                {
                  name: 'type',
                  label: 'Type',
                  type: 'relationship',
                  relationTo: 'productOptions',
                  required: true,
                  admin: {
                    components: {
                      Field:
                        '@/collections/Products/components/ProductOptionTypeSelect#ProductOptionTypeSelect',
                    },
                  },
                  filterOptions: ({ data, siblingData }) => {
                    const options = data.options as Product['options']
                    const currentTypeId = (
                      siblingData as NonNullable<Product['options']>[number] | null
                    )?.type // id of the current row
                    return {
                      id: {
                        not_in: (options?.map((option) => option.type) || [])
                          .filter(Boolean)
                          .filter((id) => id !== currentTypeId),
                      },
                    }
                  },
                },
                {
                  name: 'values',
                  type: 'relationship',
                  relationTo: 'productOptionValues',
                  filterOptions: ({ siblingData }) => {
                    const sbData = siblingData as NonNullable<Product['options']>[number] | null
                    return {
                      productOptionType: {
                        equals: sbData?.type,
                      },
                    }
                  },
                  hasMany: true,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Variants',
          fields: [
            {
              name: 'variants',
              type: 'array',
              fields: [
                {
                  type: 'tabs',
                  tabs: [
                    {
                      label: 'General',
                      fields: [
                        {
                          name: 'name',
                          label: 'Name',
                          type: 'text',
                          admin: {
                            description: 'The name of the variant',
                          },
                          required: true,
                        },
                        {
                          name: 'sku',
                          type: 'text',
                          admin: {
                            description:
                              'Your `Stock Keeping Unit` should be unique across your inventory',
                          },
                          required: true,
                          unique: true,
                        },
                        {
                          name: 'image',
                          type: 'upload',
                          relationTo: 'media',
                        },
                      ],
                    },
                    {
                      label: 'Options',
                      fields: [
                        {
                          name: 'options',
                          type: 'array',
                          admin: {
                            readOnly: true,
                          },
                          fields: [
                            {
                              type: 'row',
                              fields: [
                                {
                                  name: 'type',
                                  label: 'Type',
                                  type: 'relationship',
                                  relationTo: 'productOptions',
                                  required: true,
                                  admin: {
                                    readOnly: true,
                                  },
                                },
                                {
                                  name: 'value',
                                  type: 'relationship',
                                  relationTo: 'productOptionValues',
                                  required: true,
                                  admin: {
                                    readOnly: true,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      label: 'Inventory',
                      fields: [
                        {
                          name: 'stock',
                          type: 'number',
                          admin: {
                            description:
                              'Define stock for this variant. A stock of 0 disables checkout for this variant.',
                          },
                          defaultValue: 0,
                          required: true,
                        },
                        {
                          name: 'pricing',
                          type: 'group',
                          label: 'Pricing',
                          required: true,
                          fields: [
                            {
                              type: 'row',
                              fields: [
                                {
                                  name: 'value',
                                  index: true,
                                  type: 'number',
                                  label: 'Price',
                                  required: true,
                                },
                                currencyField,
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              admin: {
                description:
                  'All product attributes must be set through variants. If the product has only one variant, define it here as the default variant.',
              },
              required: true,
              minRows: 1,
            },
          ],
        },
        {
          label: 'Product details',
          fields: [
            {
              name: 'categories',
              label: 'Product categories',
              type: 'array',
              fields: [
                {
                  name: 'category',
                  label: 'Category',
                  type: 'relationship',
                  index: true,
                  relationTo: 'productCategories',
                  required: true,
                },
              ],
            },
            {
              name: 'bought',
              index: true,
              label: 'Bought',
              type: 'number',
              defaultValue: 0,
            },
          ],
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
