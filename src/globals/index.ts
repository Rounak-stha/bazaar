import { Header } from '@/collections/Header'
import { Footer } from '@/collections/Footer'
import { ShopLayout } from '@/collections/ShopLayout'
import { ShopSettings } from '@/collections/ShopSettings'
import { PaymentProviders } from '@/collections/PaymentProviders'
import {
  FooterSlug,
  HeaderSlug,
  PaymentProviderSlug,
  ShopLayoutSlug,
  ShopSettingsSlug,
} from './constants'

export const globals = [Header, Footer, PaymentProviders, ShopLayout, ShopSettings]

export const globalSlugs = [
  HeaderSlug,
  FooterSlug,
  PaymentProviderSlug,
  ShopSettingsSlug,
  ShopLayoutSlug,
]
