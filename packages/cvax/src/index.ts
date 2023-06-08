import type { ClassProp, ClassValue, ExcludeUndefined, Prettify, StringToBoolean } from "./types"
import { cx } from "./cx"

/* createVariant
   ============================================ */
export function createVariant<T>(arg: Config<T>): Prettify<Config<T>> {
  return arg
}

/* cvax
   ============================================ */
export type VariantProps<T> = T extends (props: infer U) => string
  ? Omit<ExcludeUndefined<U>, keyof ClassProp>
  : never

export type VariantShape = Record<string, Record<string, ClassValue>>

export type ConfigVariantsMulti<V extends VariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | StringToBoolean<keyof V[Variant]>[]
}

export type VariantSchema<V extends VariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | "unset" | undefined | null
}

export type Config<V> = V extends VariantShape
  ? ConfigBase & {
      variants?: V

      defaultVariants?: VariantSchema<V>
      compoundVariants?: (V extends VariantShape
        ? (VariantSchema<V> | VariantSchemaMultiple<V>) & ClassProp
        : ClassProp)[]
    }
  : ConfigBase & {
      variants?: never
      defaultVariants?: never
      compoundVariants?: never
    }

type VariantSchemaMultiple<V extends VariantShape> = {
  [Variant in keyof V]?:
    | StringToBoolean<keyof V[Variant]>
    | StringToBoolean<keyof V[Variant]>[]
    | undefined
}

type ConfigBase = { base?: ClassValue }
type Props<T> = T extends VariantShape ? Prettify<VariantSchema<T>> & ClassProp : ClassProp

export function cvax<_ extends "internal use only.", T>(
  config: Config<T>
): (props?: Props<T>) => string {
  if (!config) return (props?: ClassProp): string => cx(props?.class, props?.className)
  if (!config.variants)
    return (props?: ClassProp): string => cx(config.base, props?.class, props?.className)

  return (props?: Props<T>): string => {
    let classes = cx(config.base)
    let tmp: any = ""

    if (!props) {
      if (!("defaultVariants" in config) || !config?.defaultVariants) return classes

      for (const variant in config.variants) {
        const key = toString<keyof typeof variant>(config?.defaultVariants?.[variant])
        if ((tmp = config.variants[variant][key])) {
          classes = cx(classes, tmp)
        }
      }

      if (!config?.compoundVariants) return classes

      let adding = true
      for (const { class: Class, className, ...compound } of config.compoundVariants) {
        for (const prop in compound) {
          assertsKeyof<keyof typeof compound>(prop)

          if (config?.defaultVariants?.[prop] !== compound[prop]) {
            adding = false
            break
          }
        }

        if (adding) classes = cx(classes, Class, className)

        adding = true
      }

      return classes
    }

    for (const variant in config.variants) {
      const value =
        toString(props[variant as keyof typeof props]) ||
        toString(config.defaultVariants?.[variant])

      if ((tmp = config.variants?.[variant][value])) {
        classes = cx(classes, tmp)
      }
    }

    if (!config.compoundVariants) return cx(classes, props.class, props.className)

    let adding = true
    for (const { class: Class, className, ...compound } of config.compoundVariants) {
      for (const prop in compound) {
        assertsKeyof<keyof typeof props & keyof typeof compound>(prop)

        if (Array.isArray(compound[prop])) {
          if (!(compound[prop] as any as Array<any>).includes(props[prop as keyof typeof props])) {
            adding = false
          }
        } else {
          const some = prop in props ? props?.[prop] : config?.defaultVariants?.[prop]
          if (some !== compound[prop]) {
            adding = false
            break
          }
        }
      }

      if (adding) classes = cx(classes, Class, className)

      adding = true
    }

    return cx(classes, props?.class, props?.className)
  }
}
// HACK: to narrow to `keyof` types
function assertsKeyof<T>(arg: unknown): asserts arg is T {}

function toString<T extends PropertyKey>(value: any): Extract<T, string> {
  if (typeof value === "boolean" || typeof value === "number") {
    return value.toString() as any
  }
  if (!value) return "" as any
  return value.toString()
}
