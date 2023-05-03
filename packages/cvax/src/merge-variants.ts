import isEqual from "lodash.isequal" // FIXME: find the way to not to use lodash
import { MergeDeep } from "type-fest"

import type { ClassProp, ClassValue } from "./types"

import { Config, ConfigSchema, ConfigVariants, ConfigVariantsMulti, cn } from "."

type RequiredConfig<T> = T extends ConfigSchema
  ? {
      base?: ClassValue
      variants: T
      defaultVariants: ConfigVariants<T>
      compoundVariants: readonly (T extends ConfigSchema
        ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & ClassProp
        : ClassProp)[]
    }
  : never

/* mergeVariants
   ============================================ */

// TODO: merge non-tailwind classes?..
export function mergeVariants<T, U>(baseVariants: Config<T>, newVariants: Config<U>) {
  const base_ = getAbsentKeys(baseVariants)
  const new_ = getAbsentKeys(newVariants)

  let base = ""
  if (baseVariants.base || newVariants.base) {
    base = cn(baseVariants.base, newVariants.base)
  }

  const variants = getVariants(base_.variants, new_.variants)
  const defaultVariants = getDefaultVariants(base_.defaultVariants, new_.defaultVariants)
  const compoundVariants = getCompoundVariants(base_.compoundVariants, new_.compoundVariants)

  return {
    base,
    variants,
    defaultVariants,
    compoundVariants,
  }

  // return {
  //   ...(base && { base }),
  //   ...(Object.keys(variants).length > 0 && { variants }),
  //   ...(Object.keys(defaultVariants).length > 0 && { defaultVariants }),
  //   ...(compoundVariants.length > 0 && { compoundVariants }),
  // }
}

function getAbsentKeys<T>(config: Config<T>) {
  const obj = Object.assign({}, config)

  if (!("variants" in config)) Object.assign(obj, { variants: {} })
  if (!("defaultVariants" in config)) Object.assign(obj, { defaultVariants: {} })
  if (!("compoundVariants" in config)) Object.assign(obj, { compoundVariants: [] })

  return obj as unknown as RequiredConfig<T>
}

function getVariants<T extends ConfigSchema, U extends ConfigSchema>(
  baseVariants: T,
  newVariants: U,
) {
  const variants = { ...baseVariants }
  ;(
    Object.entries(newVariants) as Array<
      [vartiant: keyof typeof newVariants, value: (typeof newVariants)[keyof typeof newVariants]]
    >
  ).map(([variant, value]) =>
    (
      Object.entries(value) as Array<
        [key: keyof typeof value, classes: (typeof value)[keyof typeof value]]
      >
    ).map(([key, classes]) => {
      if (!(variant in variants)) Object.assign(variants, { [variant]: {} })

      Object.assign((variants as T & U)[variant], {
        [key]: cn((variants as T & U)?.[variant]?.[key], classes),
      })
    }),
  )

  return variants as unknown as MergeDeep<T, U>
}

function getDefaultVariants<T extends ConfigSchema, U extends ConfigSchema>(
  baseVariants: ConfigVariants<T>,
  newVariants: ConfigVariants<U>,
) {
  return merge(baseVariants, newVariants)
}

// FIXME: make newVariants as first priopity
// TODO: optimize algorithm
function getCompoundVariants<T extends readonly any[], U extends readonly any[]>(
  baseVariants: T,
  newVariants: U,
) {
  const arr = [...baseVariants, ...newVariants]
  const markArr: (undefined | null)[] = []

  for (const [key, { className, ...rest }] of (
    arr as Array<{ className: string; [key: string]: string }>
  ).entries()) {
    for (let i = key + 1; i < arr.length; i++) {
      const { className, ...arrRest } = arr[i] as {
        className: string
        [key: string]: string
      }

      if (isEqual(rest, arrRest)) markArr[i] = null
    }
  }

  return arr.map((item, index) => (markArr[index] === undefined ? item : null)).filter(Boolean) as (
    | T[number]
    | U[number]
  )[]
}

/* merge
   ============================================ */
export function merge<Args extends object[]>(...args: [...Args]) {
  return Object.assign({}, ...args.filter(cleanObjects)) as Spread<Args>
}

function cleanObjects(element: object) {
  if (element === null) return false
  if (Array.isArray(element)) return false
  return Object.keys(element).length !== 0
}

type Spread<Args extends readonly [...any]> = Args extends [infer Left, ...infer Right]
  ? SpreadTwo<Left, Spread<Right>>
  : unknown

type SpreadTwo<Left, Right> = Identity<
  Pick<Left, Exclude<keyof Left, keyof Right>> &
    Pick<Right, Exclude<keyof Right, OptionalPropertyNames<Right>>> &
    Pick<Right, Exclude<OptionalPropertyNames<Right>, keyof Left>> &
    SpreadProperties<Left, Right, OptionalPropertyNames<Right> & keyof Left>
>

type Identity<T> = T extends infer U ? { [Key in keyof U]: U[Key] } : never

type OptionalPropertyNames<T> = {
  [Key in keyof T]-?: {} extends { [P in Key]: T[Key] } ? Key : never
}[keyof T]

type SpreadProperties<Left, Right, Key extends keyof Left & keyof Right> = {
  [P in Key]: Left[P] | Exclude<Right[P], undefined>
}
