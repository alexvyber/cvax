import isEqual from "lodash.isequal" // FIXME: find the way to not to use lodash
import type { ClassProp, Prettify } from "./types"
import type { Config, VariantShape, VariantSchema } from "."
import { cn } from "./cn"

/* mergeVariants
   ============================================ */
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

type DefaultVariants<T> = {
  [Key in keyof T]?: keyof T[Key]
}

export function mergeVariants<T, U>(
  baseVariants: Config<T>,
  newVariants: Config<U>
): Prettify<{
  base: string
  variants: Prettify<MergeVariants<T, U>>
  defaultVariants: DefaultVariants<MergeVariants<T, U>>
  compoundVariants: []
}> {
  const base = cn(baseVariants.base, newVariants.base)
  const variants = getVariants(baseVariants.variants, newVariants.variants)
  const defaultVariants = getDefaultVariants(
    baseVariants.defaultVariants,
    newVariants.defaultVariants
  )

  const compoundVariants = getCompoundVariants(
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

// getVariants
function getVariants<T extends VariantShape | undefined, U extends VariantShape | undefined>(
  left: T,
  right: U
): Prettify<MergeVariants<T, U>> {
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

// getDefaultVariants
function getDefaultVariants<
  T extends VariantSchema<any> | undefined,
  U extends VariantSchema<any> | undefined
>(left: T, right: U): Prettify<MergeObjects<T, U>> {
  const acc = Object.assign({}, left)

  if (right)
    for (const variants in right) {
      Object.assign(acc, { [variants]: right[variants] })
    }

  return acc as any
}

function length(obj: unknown) {
  return obj ? Object.keys(obj).length : -1
}

// getCompoundVariants
function getCompoundVariants<
  const T extends readonly any[] | undefined,
  const U extends readonly any[] | undefined
>(baseVariants: T, newVariants: U) {
  if (!baseVariants) return newVariants ? newVariants : []
  if (!newVariants) return baseVariants

  const base = [...baseVariants, ...newVariants]

  const markingArray: (undefined | null)[] = new Array(base.length)

  // Refactor to not use isEqual
  for (const key of base) {
    let compoundLength = length(base[key])
    if (compoundLength <= 1) {
      markingArray[key] = null
      continue
    }

    const {
      className: _,
      class: __,
      ...rest
    } = base[key] as {
      [key: string]: string
    } & ClassProp

    for (let i = key + 1; i < base.length; i++) {
      if (base[i] < compoundLength) {
        compoundLength--
        break
      }
      const {
        className: _,
        class: __,
        ...rest2
      } = base[i] as {
        [key: string]: string
      } & ClassProp

      if (isEqual(rest, rest2)) markingArray[i] = null
    }
  }

  for (let i = base.length; i >= 0; i--) {
    if (markingArray[i] === null) [base.splice(i, 1)]
  }

  return base
}
