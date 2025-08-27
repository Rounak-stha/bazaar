// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { registerUserEndpoint } from '@/endpoints/auth/register'

import { Addresses } from './collections/Addresses'
import { Categories } from './collections/Categories'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Order } from './collections/Order'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { ProductCategories } from './collections/ProductCategories'
import { Shops } from './collections/Shops'
import { Users } from './collections/Users'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { loginUserEndpoint } from './endpoints/auth/login'
import { ProductOptions } from './collections/ProductOptions'
import { ProductOptionValues } from './collections/ProductOptionValues'
import { globals } from './globals'
import { Transactions } from './collections/Transactions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      graphics: {
        // Displayed as the Logo in Signup / Login View
        Logo: '@/components/AdminLogoBig/AdminLogoBig#AdminLogoBig',
        // Displayed above the Nav in admin panel
        Icon: '@/components/AdminLogoIcon/AdminLogoIcon#AdminLogoIcon',
      },
      Nav: {
        path: '@/components/AdminNavbar#AdminNavbar',
      },
      views: {
        dashboard: {
          Component: '@/components/AdminDashboard#AdminDashboard',
        },
      },
      beforeNavLinks: ['@/components/AdminNavbar/NavHeader#AdminNavHeader'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    routes: {
      login: '/auth/login',
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    meta: {
      icons: [
        {
          type: 'image/png',
          url: '/assets/favicon.ico',
          rel: 'icon',
        },
      ],
      title: 'Admin Panel',
      titleSuffix: '| Bazaar',
      description: 'Bazaar, Your ecom buddy to help you grow',
    },
  },
  endpoints: [loginUserEndpoint, registerUserEndpoint],
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    transactionOptions: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  }),
  collections: [
    Products,
    Pages,
    ProductCategories,
    Order,
    ProductOptions,
    ProductOptionValues,
    Media,
    Transactions,
    Addresses,
    Customers,
    Posts,
    Categories,
    Shops,
    Users,
    ...globals,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
