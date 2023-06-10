export type ClassValue =
  | ClassValue[]
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined
export type ClassDictionary = Record<
  string,
  | ClassValue[]
  | string
  | number
  | null
  | boolean
  | undefined
  | Record<string, ClassValue[] | string | number | null | boolean | undefined>
>
export type ClassPropKey = "class" | "className"
export type ClassProp =
  | {
      class: ClassValue
      className?: never
    }
  | { class?: never; className: ClassValue }
  | { class?: never; className?: never }
export type ExcludeUndefined<T> = T extends undefined ? never : T
export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T
export type Prettify<T> = {
  [K in keyof T]: T[K] extends object ? Prettify<T[K]> : T[K]
} & {}
