import type { Access } from 'payload'
import { isSuperAdmin } from './isSuperAdmin'

export const adminOrPublished: Access = ({ req: { user } }) => {
  if (isSuperAdmin(user)) return true

  if (user && user.collection == 'users' && user.roles?.includes('shop-admin')) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
