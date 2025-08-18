import { cookies } from 'next/headers'

import { Endpoint } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RootDomainFormatted } from '@/lib/url'

export const loginUserEndpoint: Endpoint = {
  path: '/auth/login',
  method: 'post',
  handler: async (req) => {
    try {
      const body = await req.json?.()
      const redirectUrl = `${RootDomainFormatted}/admin`

      if (!body) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 })
      }

      const { email, password } = body

      if (!email || !password) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 })
      }

      const payload = await getPayload({ config: configPromise })
      let isSuperAdmin = false

      const paginatedUserData = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
        limit: 1,
      })

      if (paginatedUserData.docs.length == 0) {
        return Response.json(
          {
            message: 'Invalid Request',
          },
          {
            status: 500,
          },
        )
      }

      if (paginatedUserData.docs[0].roles?.includes('super-admin')) {
        isSuperAdmin = true
      }

      const shop = await (async () => {
        if (isSuperAdmin) return null

        const shopExists = !!paginatedUserData.docs[0].shops

        if (!shopExists) {
          throw new Error('Invalid Request')
        }

        const paginatedShopData = await payload.find({
          collection: 'shops',
          where: {
            id: {
              equals:
                typeof paginatedUserData.docs[0].shops![0].shop == 'string'
                  ? paginatedUserData.docs[0].shops![0].shop
                  : paginatedUserData.docs[0].shops![0].shop.id,
            },
          },
        })

        if (paginatedShopData.docs.length == 0) {
          throw new Error('Invalid Request')
        }
        return paginatedShopData.docs[0]
      })()

      // Login the user
      const loginResult = await payload.login({
        collection: 'users',
        data: { email, password },
        req,
      })

      if (loginResult.token) {
        const cookieStore = await cookies()
        cookieStore.set({
          name: 'payload-token',
          value: loginResult.token,
          httpOnly: true,
          maxAge: 7 * 86400,
          path: '/',
        })

        if (!isSuperAdmin && shop) {
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
            message: 'Shop and admin created successfully',
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
    } catch (e) {
      console.log(e)
      return Response.json(
        {
          message: 'An error occured during signup. Please try again',
        },
        { status: 500 },
      )
    }
  },
}
