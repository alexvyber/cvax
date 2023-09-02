import type { Config, CVAXVariantShape, CVAXVariantSchema, ClassValue, StringToBoolean } from "."
import { cx } from "./"
import { Prettify } from "@alexvyber/turbo-helpers-types"
import { twMerge } from "tailwind-merge"

 function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs))
}

// TODO: Refactor types

type MergeVariants<Left, Right> = {
  [Key in keyof Left & keyof Right]: MergeObjects<Left[Key], Right[Key]>
} & MergeObjects<Left, Right>

type ToString<T> = T extends string ? string : T extends string[] ? string[] : T

type MergeObjects<Left, Right> = {
  [Prop in keyof Left | keyof Right]: Prop extends keyof Right
    ? Right[Prop]
    : Prop extends keyof Left
    ? ToString<Left[Prop]>
    : never
}

type DefaultVariants<T extends { variants: Record<PropertyKey, any>}> = {
  [Key in keyof T]?: 
  | StringToBoolean<keyof T["variants"][PropertyKey]>
  | "unset"
  
}

function merge<T, U>(
  baseVariants: Config<T>,
  newVariants: Config<U>
): Prettify<{
  base: string
  variants: Prettify<MergeVariants<T, U>>
  defaultVariants: DefaultVariants<MergeVariants<T, U> extends { variants: Record<PropertyKey, any>} ? MergeVariants<T, U> : never>
  compoundVariants: []
}> {
  const base = cn(baseVariants?.base, newVariants?.base)
  const variants = mergeVariants(baseVariants.variants, newVariants.variants)
  const defaultVariants = mergeDefaultVariants(
    baseVariants.defaultVariants,
    newVariants.defaultVariants
  )

  const compoundVariants = mergeCompoundVariants(
    baseVariants.compoundVariants,
    newVariants.compoundVariants
  )

  return {
    base,
    variants,
    defaultVariants,
    compoundVariants,
  } as any
}

export function mergeTwoObjects<Left extends object, Right extends object>(
  left: Left,
  right: Right
): Prettify<MergeObjects<Left, Right>> {
  if (Array.isArray(left) || Array.isArray(left)) return {} as any
  return Object.assign({}, left, right) as any
}

function mergeVariants<
  T extends CVAXVariantShape | undefined,
  U extends CVAXVariantShape | undefined
>(left: T, right: U): Prettify<MergeVariants<T, U>> {
  const acc = {} as Exclude<T & U, undefined>

  if (left)
    for (const variants in left) {
      for (const variant in left[variants]) {
        Object.assign(acc, { [variants]: {} })
        Object.assign(acc[variants], { [variant]: left[variants][variant] })
      }
    }

  if (right)
    for (const variants in right) {
      for (const variant in right[variants]) {
        if (!(variants in acc)) {
          Object.assign(acc, { [variants]: {} })
          Object.assign(acc[variants], { [variant]: right[variants][variant] })
        } else {
          Object.assign(acc[variants], {
            [variant]: cn(left?.[variants][variant], right[variants][variant]),
          })
        }
      }
    }

  return acc as any
}

function mergeDefaultVariants<
  T extends CVAXVariantSchema<any> | undefined,
  U extends CVAXVariantSchema<any> | undefined
>(left: T, right: U): Prettify<MergeObjects<T, U>> {
  if (!right) return left || ({} as any)
  if (!left) return right as any

  const acc = Object.assign({}, left)

  for (const variants in right) {
    Object.assign(acc, { [variants]: right[variants] })
  }

  return acc as any
}

function mergeCompoundVariants<
  const T extends readonly any[] | undefined,
  const U extends readonly any[] | undefined
>(baseVariants: T, newVariants: U) {
  if (!baseVariants) return newVariants ? newVariants : []
  if (!newVariants) return baseVariants

  // REFACTOR: ???
  const base = [...baseVariants, ...newVariants]
  let compoundLength = 0

  for (let i = 0; i < base.length; i++) {
    compoundLength = length(base[i])

    if (compoundLength <= 1) {
      base[i] = null
      continue
    }

    for (let j = i + 1; j < base.length; j++) {
      if (length(base[j]) < compoundLength) {
        compoundLength--
        break
      }

      if (isCompoundsEquivalent(base[i], base[j])) {
        base[i] = null
        break
      }
    }
  }

  return base.filter((item) => item !== null)
}

export function isCompoundsEquivalent(left: object, right: object): boolean {
  if (length(left) !== length(right)) return false
  for (const key of Object.keys(left)) {
    if (key === "class" || key === "className") continue
    if (!(key in right)) return false

    // @ts-ignore: the key type inference just isn't possible in this case
    // i've tried to make this shit work for too long
    if (left[key] !== right[key]) {
      return false
    }
  }

  return true
}

function length(obj: unknown) {
  return obj ? Object.keys(obj).length : -1
}

export { merge as mergeVariants }
