import type { Access } from 'payload'
import { User } from '../payload-types'

export const isSuperAdminAccess: Access = ({ req }): boolean => {
  if (req.user?.collection == 'customers') return false
  return isSuperAdmin(req.user)
}

export const isSuperAdmin = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('super-admin'))
}
