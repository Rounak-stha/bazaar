'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AdminLogoIcon } from '@/components/AdminLogoIcon/AdminLogoIcon'
import { AdminPaths } from '@/lib/url'

export const AdminNavHeader = () => {
  const pathname = usePathname()

  return (
    <div
      className={`nav__link mb-2.5 flex items-center py-2 ${pathname === '/admin' ? 'active' : ''}`}
    >
      {pathname === '/admin' && <div className="nav__link-indicator"></div>}
      <AdminLogoIcon size={44} />
      <div>
        <Link href={AdminPaths.root} className="no-underline hover:underline">
          <h2 className="text-xl font-semibold">Bazaar</h2>
        </Link>
        <span className="text-muted-foreground text-sm">bagbae.localtest.com</span>
      </div>
    </div>
  )
}
