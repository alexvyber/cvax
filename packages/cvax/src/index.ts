import { twMerge } from "tailwind-merge"
import type { ClassProp, ClassValue, OmitUndefined, StringToBoolean } from "./types"
import { cx } from "./cx"
export { cx }
export { mergeVariants } from "./merge-variants"

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
