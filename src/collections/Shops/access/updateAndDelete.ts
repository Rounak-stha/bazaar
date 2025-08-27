import { isSuperAdmin } from '@/access/isSuperAdmin'
import { Access } from 'payload'

export const updateAndDeleteAccess: Access = ({ req }) => {
  if (!req.user || req.user.collection == 'customers') {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  return {
    id: {
      in: req.user.shops,
    },
  }
}
