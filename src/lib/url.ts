import type { NextRequest } from 'next/server'
import { isDevelopment } from './isdevelopment'
import { PaymentProviderName } from '@/payments/types'

const protocol = isDevelopment ? 'http' : 'https'

export const SITE_URL = (() => {
  if (!isDevelopment) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localtest.com:3000'
})()

export const RootDomainFormatted = (() => {
  let host = new URL(SITE_URL).hostname
  if (isDevelopment) {
    host += ':3000'
  }
  return host
})()

export const getShopUrl = (domain: string) => `${protocol}://${domain}.${RootDomainFormatted}`

/**
 * Method adapted from: https://github.com/vercel/platforms/blob/main/middleware.ts
 */
export function extractSubdomain(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || '' // tenant.localtest.com:3000
  const isSubdomain = hostname !== RootDomainFormatted && !hostname.startsWith('www.')
  return isSubdomain ? hostname.split('.')[0] : null
}

export const Paths = {
  cartProducts: (shopDomain: string) => `/api/cart/products`,
  orderConfirm: (provider: PaymentProviderName) => `/order/confirm/${provider}`,
  shop: '/shop',
} as const

export const AdminPaths = {
  root: '/admin',
  login: '/admin/auth/login',
  register: '/admin/auth/register',

  api: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    loginWithoutPrefix: '/auth/login',
    registerWithoutPrefix: '/auth/register',
  },
} as const
