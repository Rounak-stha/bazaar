'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AdminLogoIcon } from '@/components/AdminLogoIcon/AdminLogoIcon'
import { AdminPaths, getShopUrl } from '@/lib/url'
import { useMemo } from 'react'
import { useAuth } from '@payloadcms/ui'

export const AdminNavHeader = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  const shopUrl = useMemo(() => {
    const shopDomain = user ? user.shops[0].shop.domain : ''
    return getShopUrl(shopDomain)
  }, [user])

  const shopHost = useMemo(() => new URL(shopUrl).host, [shopUrl])

  return (
    <div
      className={`mb-2.5 flex items-center py-2 ${pathname === AdminPaths.root ? 'active' : ''}`}
    >
      {pathname === AdminPaths.root && <div className="nav__link-indicator"></div>}
      <AdminLogoIcon size={44} />
      <div>
        <Link href={AdminPaths.root} className="no-underline hover:underline">
          <h2 className="text-xl font-semibold">Bazaar</h2>
        </Link>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={shopUrl}
          className="no-underline hover:underline text-muted-foreground font-medium text-base md:text-sm"
        >
          {shopHost}
        </a>
      </div>
    </div>
  )
}
