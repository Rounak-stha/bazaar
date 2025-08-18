import { type CollectionBeforeValidateHook } from 'payload'
import { v4 as uuidv4 } from 'uuid'

import { type Order } from '@/payload-types'

export const generateID: CollectionBeforeValidateHook<Order> = async ({ data }) => {
  if (data && !data.id) {
    const uuid = uuidv4()
    return { ...data, id: uuid }
  }

  return data
}
