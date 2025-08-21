import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, Shop } from '@/payload-types'

type HeaderProps = {
  shop: Shop
}

export async function Header({ shop }: HeaderProps) {
  const headerData: Header = await getCachedGlobal('header', shop.id)()

  return <HeaderClient data={headerData} />
}
