export type WithoutNullish<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}
