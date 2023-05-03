import { twMerge } from "tailwind-merge"
import type { ClassProp, OmitUndefined, StringToBoolean } from "./types"
import isEqual from "lodash.isequal" // FIXME: find the way to not to use lodash
import { MergeDeep } from "type-fest"

/* falsyToString
   ============================================ */
function falsyToString<T extends boolean>(value: T): `${T}`
function falsyToString<T extends unknown>(value: T): T
function falsyToString<T>(value: T) {
  if (typeof value === "boolean") {
    return `${value}`
  }

  if (typeof value === "number") {
    return value === 0 ? "0" : value
  }

  return value
}

/* cx
   ============================================ */
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

export type ClassValue =
  | ClassValue[]
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined

export function cx(...inputs: ClassValue[]): string
export function cx() {
  let i = 0,
    str = "",
    tmp: any,
    { length } = arguments

  while (i < length) {
    if ((tmp = arguments[i++])) {
      str += getStr(tmp)
    }
  }

  return str.replace(/\s+/g, " ").trim()
}

function getStr(classes: ClassValue) {
  if (!classes || typeof classes === "boolean") return ""
  if (typeof classes === "number") return classes.toString() + " "

  if (typeof classes === "object") {
    let str = ""

    if (Array.isArray(classes)) {
      if (classes.length === 0) return ""

      for (const item of classes.flat(Infinity as 0)) {
        if (item) {
          str += getStr(item)
        }
      }
    } else {
      for (const key in classes) {
        if (key === "class" || key === "className") {
          str += getStr(classes[key]) + " "
        } else if (classes[key]) {
          str += key + " "
        }
      }
    }

    return str
  }

  return classes + " "
}

/* cn
   ============================================ */
export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs))
}

/* cvax
   ============================================ */
export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>

export type ConfigSchema = Record<string, Record<string, ClassValue>>

export type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null
}

export type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | StringToBoolean<keyof T[Variant]>[]
}

export type Config<T> = T extends ConfigSchema
  ? {
      base?: ClassValue
      variants?: T
      defaultVariants?: ConfigVariants<T>
      compoundVariants?:
        | readonly (T extends ConfigSchema
            ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & ClassProp
            : ClassProp)[]
    }
  : never

type Props<T> = T extends ConfigSchema ? ConfigVariants<T> & ClassProp : ClassProp

export function cvax<T>(config: Config<T>) {
  if (config.variants == null)
    return (props?: Props<T>): string => cx(config?.base, props?.className)

  return (props?: Props<T>): string => {
    const { variants, defaultVariants } = config

    if (!variants) return cx(props?.className)

    const getVariantClassNames = Object.keys(variants).map((variant: keyof typeof variants) => {
      const variantProp = props?.[variant as keyof typeof props]
      const defaultVariantProp = defaultVariants?.[variant]

      if (variantProp === null) return null

      const variantKey = (falsyToString(variantProp) ||
        falsyToString(defaultVariantProp)) as keyof (typeof variants)[typeof variant]

      return variants[variant][variantKey]
    })

    const propsWithoutUndefined =
      props &&
      Object.entries(props).reduce((acc, [key, value]) => {
        if (value === undefined) {
          return acc
        }

        acc[key] = value
        return acc
      }, {} as Record<string, unknown>)

    const getCompoundVariantClassNames = config?.compoundVariants?.reduce(
      (acc, { className: cvClassName, ...compoundVariantOptions }) =>
        Object.entries(compoundVariantOptions).every(([key, value]) =>
          Array.isArray(value)
            ? value.includes(
                {
                  ...defaultVariants,
                  ...propsWithoutUndefined,
                }[key],
              )
            : {
                ...defaultVariants,
                ...propsWithoutUndefined,
              }[key] === value,
        )
          ? [...acc, cvClassName]
          : acc,
      [] as ClassValue[],
    )

    return cx(config?.base, getVariantClassNames, getCompoundVariantClassNames, props?.className)
  }
}

/* mergeVariants
   ============================================ */
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
