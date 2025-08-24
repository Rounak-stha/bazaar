export type WithoutNullish<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export type StringToString = {
  [k: string]: string
}
