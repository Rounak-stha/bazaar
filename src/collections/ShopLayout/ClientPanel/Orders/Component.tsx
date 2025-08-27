/* import { notFound } from 'next/navigation'
import { type ReactNode } from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { WithSidebarOrders } from '../variants/WithSidebar/components/WithSidebarOrders'

export const Orders = async () => {
  try {
    const { clientPanel } = await getCachedGlobal('shopLayout', 1)()

    let OrdersComponent: ReactNode = null
    switch (clientPanel.type) {
      case 'withSidebar':
        OrdersComponent = <WithSidebarOrders />
        break
    }

    if (!OrdersComponent) {
      notFound()
    }

    return OrdersComponent
  } catch (error) {
    console.log(error)
    notFound()
  }
}
 */
