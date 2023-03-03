import { twMerge } from "tailwind-merge"
import isEqual from "lodash.isequal" // FIXME: find the way to not to use lodash
import type {
  ClassProp,
  ClassValue,
  CxOptions,
  CxReturn,
  OmitUndefined,
  StringToBoolean,
} from "./types"
import { MergeDeep } from "type-fest"

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "className"
>

function falsyToString<T extends unknown>(value: T) {
  return typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value
}

/* cx
  ============================================ */

export function cx<T extends CxOptions>(...classes: T): CxReturn {
  return classes
    .flat(Infinity as 0) // HACK: hack around TS behavior
    .filter(Boolean)
    .join(" ")
}

/* cn
  ============================================ */

export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs))
}

/* cvax
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

type ConfigSchema = Record<string, Record<string, ClassValue>>

type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null
}

type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | StringToBoolean<keyof T[Variant]>[]
}

type Config<T> = T extends ConfigSchema
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
  return (props?: Props<T>) => {
    if (config?.variants == null) return cx(config?.base, props?.className)

    const { variants, defaultVariants } = config

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

export function mergeVariants<T, U>(baseVariants: Config<T>, newVariants: Config<U>) {
  const base_ = getAbsentKeys(baseVariants)
  const new_ = getAbsentKeys(newVariants)

  const base = cn(baseVariants.base, newVariants.base)
  const variants = getVariants(base_.variants, new_.variants)
  const defaultVariants = getDefaultVariants(base_.defaultVariants, new_.defaultVariants)
  const compoundVariants = getCompoundVariants(base_.compoundVariants, new_.compoundVariants)

  return {
    base,
    variants,
    defaultVariants,
    compoundVariants,
  }
}

function getAbsentKeys<T>(config: Config<T>) {
  if (!("variants" in config)) Object.assign(config, { variants: {} })
  if (!("defaultVariants" in config)) Object.assign(config, { defaultVariants: {} })
  if (!("compoundVariants" in config)) Object.assign(config, { compoundVariants: [] })

  return config as unknown as RequiredConfig<T>
}

function getVariants<T extends ConfigSchema, U extends ConfigSchema>(
  baseVariants: T,
  newVariants: U,
) {
  const obj = Object.assign({}, baseVariants as T & U)

  ;(
    Object.entries(newVariants) as Array<
      [vartiant: keyof typeof newVariants, value: (typeof newVariants)[keyof typeof newVariants]]
    >
  ).map(([variant, value]) =>
    (Object.keys(value) as Array<keyof typeof value>).map((key: keyof typeof value) => {
      if (!(typeof obj !== "object")) throw new Error(`obj ${obj} is not an Object`)
      if (!(variant in obj)) Object.assign(obj, { [variant]: newVariants[variant] })

      Object.assign(obj[variant], {
        [key]: cn(obj?.[variant]?.[key], value[key]),
      })
    }),
  )

  return obj as unknown as MergeDeep<T, U>
}

function getDefaultVariants<T extends ConfigSchema, U extends ConfigSchema>(
  baseVariants: ConfigVariants<T>,
  newVariants: ConfigVariants<U>,
) {
  const obj = Object.assign({}, baseVariants as ConfigVariants<T> | ConfigVariants<U>)

  Object.keys(newVariants).map((variant: keyof typeof newVariants) => {
    Object.assign(obj, { [variant]: newVariants[variant] })
  })

  return obj as unknown as ConfigVariants<T> & ConfigVariants<U>
}

// FIXME: make newVariants as first priopity
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
      const { className, ...ArrRest } = arr[i] as {
        className: string
        [key: string]: string
      }

      if (isEqual(rest, ArrRest)) markArr[i] = null
    }
  }

  return arr.map((item, index) => (markArr[index] === undefined ? item : null)).filter(Boolean) as (
    | T[number]
    | U[number]
  )[]
}
