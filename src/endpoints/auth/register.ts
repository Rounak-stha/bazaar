import { cookies } from 'next/headers'

import { Endpoint } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RootDomainFormatted } from '@/lib/url'

export const registerUserEndpoint: Endpoint = {
  path: '/auth/register',
  method: 'post',
  handler: async (req) => {
    const body = await req.json?.()

    if (!body) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { shopName, email, password } = body
    const redirectUrl = `${RootDomainFormatted}/admin`

    if (!shopName || !email || !password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // 1. Create the Shop
    const shop = await payload.create({
      collection: 'shops',
      data: { name: shopName, domain: shopName.split(' ').join('').toLowerCase() },
    })

    // 2. Create the admin for this Shop
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        shops: [{ shop }],
        roles: ['shop-admin'],
      },
    })

    // 3. Log the admin in (sets auth cookie automatically if cookie-based auth is enabled)
    const loginResult = await payload.login({
      collection: 'users',
      data: { email, password },
      req,
    })

    console.log({ loginResult })

    if (loginResult.token) {
      const cookieStore = await cookies()
      cookieStore.set({
        name: 'payload-token',
        value: loginResult.token,
        httpOnly: true,
        path: '/',
      })

      if (shop) {
        cookieStore.set({
          name: 'payload-tenant',
          value: shop.id,
          httpOnly: true,
          maxAge: 7 * 86400,
          path: '/',
        })
      }
      return Response.json(
        {
          message: 'Login Successful',
          shop,
          user: adminUser,
          redirectUrl,
        },
        { status: 201 },
      )
    }
    return Response.json(
      {
        message: 'An error occured during signup. Please try again',
      },
      { status: 500 },
    )
  },
}
