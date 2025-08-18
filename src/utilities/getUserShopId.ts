import type { Shop, User } from '../payload-types'

/**
 * Returns the shop for the User
 *
 * @param user - User object with tenants field
 * @param role - Optional role to filter by
 */
export const getUserShopId = (user: null | User): Shop['id'] | null => {
  if (!user) {
    return null
  }

  const shopExists = !!(user.shops && user.shops.length > 0)

  if (!shopExists) return null

  return typeof user.shops![0].shop == 'string' ? user.shops![0].shop : user.shops![0].shop.id
}
