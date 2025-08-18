import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { getUserShopId } from '@/utilities/getUserShopId'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { Access } from 'payload'
import { getCollectionIDType } from '@/utilities/getCollectionIdType'

/**
 * Tenant admins and super admins can will be allowed access
 */
export const superAdminOrTenantAdminAccess: Access = ({ req }) => {
  if (!req.user || req.user.collection == 'customers') {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  const userShopId = getUserShopId(req.user)

  const requestedShopId =
    req.headers &&
    getTenantFromCookie(
      req.headers,
      getCollectionIDType({ payload: req.payload, collectionSlug: 'shops' }),
    )

  return userShopId === requestedShopId
}
