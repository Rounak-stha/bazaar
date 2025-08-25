import { extractSubdomain, RootDomainFormatted } from '@/lib/url'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const shopDomain = extractSubdomain(req)

  if (!shopDomain) return NextResponse.next()

  const { pathname, search, protocol } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(`${protocol}//${RootDomainFormatted}/admin${search}`)
  }

  const target = pathname === '/' ? `/shop/${shopDomain}` : `/shop/${shopDomain}${pathname}`
  const url = new URL(`${protocol}//${RootDomainFormatted}${target}${search}`)
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     *
     * NOTE: api (API routes) are also matched here
     * So every API request for each shop will also be rewritten to the shop/[domain] path
     * Since the admin panel also has this api route, this will also be routed through this middleware
     * But for admin panel, we're not using any subdomains, so there won't be any rewrites
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets/).*)',
  ],
}
