'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
  disableCart?: boolean
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, disableCart }) => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const isRoot = useMemo(() => pathname == '/', [pathname])

  useEffect(() => {
    if (!isRoot) {
      setScrolled(true)
    }

    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      threshold: 0.5,
    })

    const heroImageElement = document.getElementById('hero-image')

    if (heroImageElement) observer.observe(heroImageElement)

    return () => observer.disconnect()
  }, [isRoot])

  return (
    <header
      className={cn('top-0 left-0 right-0 container z-20', isRoot ? 'fixed' : 'sticky', {
        'transparent text-white': !scrolled,
        'bg-white text-black': scrolled,
      })}
    >
      <div className="py-8 flex">
        <Link href="/">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
        <HeaderNav data={data} disableCart={disableCart} />
      </div>
    </header>
  )
}
