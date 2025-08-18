'use client'

import { CMSLink } from '@/components/Link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Header } from '@/payload-types'

import { MenuIcon } from 'lucide-react'
import { FC } from 'react'

type MobileMenuBarProps = {
  show: boolean
  navItems: Header['navItems']
}

export const MobileMenuBar: FC<MobileMenuBarProps> = ({ navItems, show }) => {
  if (!show) return null
  return (
    <Sheet>
      <SheetTrigger>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col gap-2">
          {navItems?.map(({ link }, i) => (
            <CMSLink key={i} {...link} appearance="link" />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
