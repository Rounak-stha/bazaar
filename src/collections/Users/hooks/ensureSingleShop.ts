import { User } from '@/payload-types'
import type { CollectionBeforeChangeHook } from 'payload'

export const ensureSingleShop: CollectionBeforeChangeHook<User> = async ({ data }) => {
  if (data.shops && Array.isArray(data.shops) && data.shops.length > 1) {
    throw new Error('A user can only be assigned to one shop.')
  }
  return data
}
