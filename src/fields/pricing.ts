import { type Field } from 'payload'
import { currencyField } from './currencyField'

export const pricingField: Field = {
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
}
