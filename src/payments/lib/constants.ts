export const PAYMENT_API_PATH_PREFIX = 'epayment'
export const PAYMENT_INITIATE_API_PATH = `/${PAYMENT_API_PATH_PREFIX}/initiate/`
export const PAYMENT_LOOKUP_API_PATH = `/${PAYMENT_API_PATH_PREFIX}/lookup/`

// Provider Names
export const Payment_Provider_Khalti = 'khalti' as const

export const PaymentProviders = [Payment_Provider_Khalti]
