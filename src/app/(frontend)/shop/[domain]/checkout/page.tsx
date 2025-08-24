import { notFound } from 'next/navigation'

import { Checkout } from '@/collections/ShopLayout/Checkout/Component'
import { getCachedShopByDomain } from '@/utilities/shop/getShop'
import { SearchParams } from '@/types/next'

const CheckoutPage = async ({ params }: { params: Promise<{ domain: string }> }) => {
  try {
    const { domain } = await params
    const shop = await getCachedShopByDomain(domain)()

    if (!shop) notFound()

    return <Checkout shop={shop} />
  } catch {
    notFound()
  }
}

export default CheckoutPage
