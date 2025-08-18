import { Product } from '@/payload-types'
import { CollectionBeforeDeleteHook } from 'payload'

export const deleteChildOptionValues: CollectionBeforeDeleteHook = async ({ req, id }) => {
  await req.payload.delete({
    collection: 'productOptionValues',
    where: {
      productOptionType: {
        equals: id,
      },
    },
  })
}
