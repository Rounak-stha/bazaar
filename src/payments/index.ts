import { CheckoutSessionCreateData, LookupArgsCreateData, PaymentProviderName } from './types'
import { PaymentProvider } from '@/payload-types'
import {
  createKhaltiLookupArgs,
  createKhaltiSessionArgs,
  isKhaltiEnabled,
  khaltiHandler,
} from './providers/khalti'

export function isProviderEnabled(provider: PaymentProviderName, doc: PaymentProvider) {
  switch (provider) {
    case 'khalti':
      return isKhaltiEnabled(doc)
    default:
      return false
  }
}

export function getHandlerForProvider(provider: PaymentProviderName) {
  switch (provider) {
    case 'khalti':
      return khaltiHandler
    default:
      return null
  }
}

export function createSessionArgs(provider: PaymentProviderName, data: CheckoutSessionCreateData) {
  switch (provider) {
    case 'khalti':
      return createKhaltiSessionArgs(data)
  }
}

export function createLookupArgs(data: LookupArgsCreateData) {
  switch (data.paymentProvider) {
    case 'khalti':
      return createKhaltiLookupArgs(data)
  }
}

export function getEnabledProviders(doc: PaymentProvider): PaymentProviderName[] {
  const enabledProviders: PaymentProviderName[] = []
  if (doc.khalti.enabled) enabledProviders.push('khalti')
  return enabledProviders
}
