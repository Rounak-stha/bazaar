import { AdminPaths } from '@/lib/url'
import { redirect } from 'next/navigation'

export default function PlaceholderLoginPage() {
  redirect(AdminPaths.login)
}
