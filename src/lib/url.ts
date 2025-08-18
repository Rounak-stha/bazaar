import type { NextRequest } from 'next/server'

const isDevelopment = !(
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
)

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

/**
 * Method adapted from: https://github.com/vercel/platforms/blob/main/middleware.ts
 */
export function extractSubdomain(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || '' // tenant.localtest.com:3000
  const isSubdomain = hostname !== RootDomainFormatted && !hostname.startsWith('www.')
  return isSubdomain ? hostname.split('.')[0] : null
}
