export const isDevelopment = !(
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
)
