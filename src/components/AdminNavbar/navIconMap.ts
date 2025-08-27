import {
  AlignStartHorizontal,
  ArrowRightLeft,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  FileImageIcon,
  Footprints,
  Handshake,
  LayoutTemplate,
  type LucideProps,
  PackageSearch,
  PanelsTopLeft,
  RssIcon,
  Search,
  SendIcon,
  Settings,
  UserIcon,
  TagIcon,
  TextCursorInput,
  UsersRound,
} from 'lucide-react'
import { type CollectionSlug, type GlobalSlug } from 'payload'
import { type ExoticComponent } from 'react'

export const navIconMap: Partial<
  Record<CollectionSlug | GlobalSlug, ExoticComponent<LucideProps>>
> = {
  redirects: ArrowRightLeft,
  forms: TextCursorInput,
  'form-submissions': SendIcon,
  search: Search,
  users: UserIcon,
  pages: LayoutTemplate,
  posts: RssIcon,
  media: FileImageIcon,
  categories: TagIcon,
  header: AlignStartHorizontal,
  footer: Footprints,
  customers: UsersRound,
  orders: ClipboardList,
  products: PackageSearch,
  productOptions: Boxes,
  productCategories: TagIcon,
  shopSettings: Settings,
  shopLayout: PanelsTopLeft,
  paymentProviders: CircleDollarSign,
  transactions: Handshake,
}

export const getNavIcon = (slug: string) =>
  Object.hasOwn(navIconMap, slug) ? navIconMap[slug as CollectionSlug | GlobalSlug] : undefined
