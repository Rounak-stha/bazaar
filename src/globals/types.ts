import { CollectionConfig, TypedCollection } from 'payload'

import { globalSlugs, globals } from './index'

export type GlobalSlug = (typeof globalSlugs)[number]

type GlobalsBySlug = Pick<TypedCollection, GlobalSlug>

export type DataFromGlobalSlug<T extends GlobalSlug> = GlobalsBySlug[T]
