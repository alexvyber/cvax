import { twMerge } from "tailwind-merge"
import type { ClassProp, ClassValue, ExcludeUndefined, Prettify, StringToBoolean } from "./types"
import isEqual from "lodash.isequal"

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

// ---------------------------------------------------------------------------------
/* cn
   ============================================ */
   export function cn(...inputs: ClassValue[]) {
    return twMerge(cx(inputs))
  }

  
/* cx
   ============================================ */
export type CxOptions = Parameters<typeof cx>
export type CxReturn = ReturnType<typeof cx>

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

  return str.trim()
}

function getStr(classes: ClassValue) {
  if (!classes || typeof classes === "boolean") return ""
  if (typeof classes === "number") return classes + " "

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
  
    for (const [key, compound] of base.entries()) {
      let compoundLength = length(compound)
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
