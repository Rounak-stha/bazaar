import { RootDomainFormatted } from '@/lib/url'
import { middleware } from '@/middleware'
import { isRewrite, getRewrittenUrl } from 'next/experimental/testing/server'
import { NextRequest } from 'next/server'

import { describe, it, expect } from 'vitest'

const shopSubDomain = 'shopDomain'
const shopDomain = `${shopSubDomain}.${RootDomainFormatted}`
const shopDomainWithProtocol = `http://${shopDomain}`
const shopPathName = 'shop'

describe('Next Middleware Test', () => {
  it('Rewrites Root Request for Subdomains', async () => {
    const request = new NextRequest(shopDomainWithProtocol)
    request.headers.set('host', shopDomain)

    const response = middleware(request)
    expect(isRewrite(response)).toEqual(true)
    expect(getRewrittenUrl(response)).toEqual(
      `http://${RootDomainFormatted}/${shopPathName}/${shopSubDomain}`,
    )
  })

  it('Rewrites Path Request for Subdomains', async () => {
    const request = new NextRequest(`${shopDomainWithProtocol}/products/C0FFEE`)
    request.headers.set('host', `${shopDomain}/products/C0FFEE`)

    const response = middleware(request)
    expect(isRewrite(response)).toEqual(true)
    expect(getRewrittenUrl(response)).toEqual(
      `http://${RootDomainFormatted}/${shopPathName}/${shopSubDomain}/products/C0FFEE`,
    )
  })
})
