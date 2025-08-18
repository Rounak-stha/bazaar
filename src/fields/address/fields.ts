import type { Field } from 'payload'

export const commonAddressFields: Field[] = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    required: true,
  },
  {
    name: 'province',
    label: 'Province',
    type: 'select',
    options: ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudhurpaschim'],
    required: true,
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    required: true,
  },
  {
    name: 'street',
    label: 'Street',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
  },

  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
    required: true,
  },
]
