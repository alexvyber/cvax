import { UnionToIntersection } from "@alexvyber/turbo-helpers-types"
import { Prettify } from "@alexvyber/turbo-helpers-types"
import { twMerge } from "tailwind-merge"

type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined
type ClassArray = ClassValue[]
type ClassDictionary = Record<
  string,
  | ClassValue[]
  | string
  | number
  | null
  | boolean
  | undefined
  | Record<string, ClassValue[] | string | number | null | boolean | undefined>
>

type ClassProp =
  | {
      class: ClassValue
      className?: never
    }
  | { class?: never; className: ClassValue }
  | { class?: never; className?: never }
type ExcludeUndefined<T> = T extends undefined ? never : T
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T

type Variant<T extends { variants: Record<string, ClassValue> }> = T extends {
  base?: ClassValue
  variants?: Record<string, ClassValue>
  defaultVariants?: {
    [Variant in keyof T["variants"]]?:
      | StringToBoolean<keyof T["variants"][Variant]>
      | "unset"
      | undefined
  }
  compoundVariants?: (T["variants"] extends CVAXVariantShape
    ? (
        | CVAXVariantSchema<T["variants"]>
        | {
            [Variant in keyof T["variants"]]?:
              | StringToBoolean<keyof T["variants"][Variant]>
              | StringToBoolean<keyof T["variants"][Variant]>[]
              | undefined
          }
      ) &
        CVAXClassProp
    : CVAXClassProp)[]
}
  ? T
  : never

type Config<T> = T extends CVAXVariantShape
  ? {
      base?: ClassValue
      variants?: T
      defaultVariants?: CVAXVariantSchema<T>
      compoundVariants?: (T["variants"] extends CVAXVariantShape
        ? (
            | CVAXVariantSchema<T["variants"]>
            | {
                [Variant in keyof T["variants"]]?:
                  | StringToBoolean<keyof T["variants"][Variant]>
                  | StringToBoolean<keyof T["variants"][Variant]>[]
                  | undefined
              }
          ) &
            CVAXClassProp
        : CVAXClassProp)[]
    }
  : never

/* createVariant
   ============================================ */
function variantIdentity<
  T extends {
    base?: ClassValue
    variants?: Record<string, ClassValue>
    defaultVariants?: {
      [Variant in keyof T["variants"]]?:
        | StringToBoolean<keyof T["variants"][Variant]>
        | "unset"
        | undefined
    }
    compoundVariants?: (T["variants"] extends CVAXVariantShape
      ? (
          | CVAXVariantSchema<T["variants"]>
          | {
              [Variant in keyof T["variants"]]?:
                | StringToBoolean<keyof T["variants"][Variant]>
                | StringToBoolean<keyof T["variants"][Variant]>[]
                | undefined
            }
        ) &
          CVAXClassProp
      : CVAXClassProp)[]
  }
>(config: T) {
  return config
}

/* cvax
   ============================================ */
type CVAXConfigBase = { base?: ClassValue }
type CVAXVariantShape = Record<string, Record<string, ClassValue>>
type CVAXVariantSchema<V extends CVAXVariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined | "unset"
}
type CVAXClassProp =
  | {
      class?: ClassValue
      className?: never
    }
  | {
      class?: never
      className?: ClassValue
    }

interface CVAX {
  <_ extends "iternal use only", V>(
    config: V extends CVAXVariantShape
      ? CVAXConfigBase & {
          variants?: V
          compoundVariants?: (V extends CVAXVariantShape
            ? (
                | CVAXVariantSchema<V>
                | {
                    [Variant in keyof V]?:
                      | StringToBoolean<keyof V[Variant]>
                      | StringToBoolean<keyof V[Variant]>[]
                      | undefined
                  }
              ) &
                CVAXClassProp
            : CVAXClassProp)[]
          defaultVariants?: CVAXVariantSchema<V>
        }
      : CVAXConfigBase & {
          variants?: never
          compoundVariants?: never
          defaultVariants?: never
        }
  ): (
    props?: V extends CVAXVariantShape ? CVAXVariantSchema<V> & CVAXClassProp : CVAXClassProp
  ) => string
}

type VariantProps<T> = T extends (props: infer U) => string
  ? Omit<ExcludeUndefined<U>, keyof ClassProp>
  : never

/* compose
   ============================================ */
interface Compose {
  <T extends ReturnType<CVAX>[]>(...components: [...T]): (
    props?: (
      | UnionToIntersection<
          {
            [K in keyof T]: VariantProps<T[K]>
          }[number]
        >
      | undefined
    ) &
      CVAXClassProp
  ) => string
}

/* defineConfig
   ============================================ */
interface CVAXConfigOptions {
  hooks?: {
    /**
     * Returns the completed string of concatenated classes/classNames.
     */
    onComplete?: (className: string) => string
  }
}

function cvaxify(options?: CVAXConfigOptions): {
  compose: Compose
  cx: CX
  cvax: CVAX
} {
  const cx: CX = (...inputs) => {
    if (typeof options?.hooks?.onComplete === "function")
      return options?.hooks.onComplete(classic(inputs))
    return classic(inputs)
  }

  const cvax: CVAX = (config) => {
    if (!config) return (props?: ClassProp): string => cx(props?.class, props?.className)
    if (!config.variants)
      return (props?: ClassProp): string => cx(config.base, props?.class, props?.className)

    return (props): string => {
      let classes = cx(config.base)
      let tmp: any = ""

      if (!props) {
        if (!("defaultVariants" in config) || !config.defaultVariants) return classes

        for (const variant in config.variants) {
          const key = toString<keyof typeof variant>(config.defaultVariants[variant])
          if ((tmp = config.variants[variant][key])) {
            classes = cx(classes, tmp)
          }
        }

        if (!config.compoundVariants) return classes

        let adding = true
        for (const { class: Class, className, ...compound } of config.compoundVariants) {
          for (const prop in compound) {
            assertsKeyof<keyof typeof compound>(prop)

            if (config.defaultVariants[prop] !== compound[prop]) {
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

        if ((tmp = config.variants[variant][value])) {
          classes = cx(classes, tmp)
        }
      }

      if (!config.compoundVariants) return cx(classes, props.class, props.className)

      let adding = true
      for (const { class: Class, className, ...compound } of config.compoundVariants) {
        for (const prop in compound) {
          assertsKeyof<keyof typeof props & keyof typeof compound>(prop)
          if (Array.isArray(compound[prop])) {
            if (
              !(compound[prop] as any as Array<any>).includes(props[prop as keyof typeof props])
            ) {
              adding = false
            }
          } else {
            const some = prop in props ? props[prop] : config.defaultVariants?.[prop]
            if (some !== compound[prop]) {
              adding = false
              break
            }
          }
        }

        if (adding) classes = cx(classes, Class, className)

        adding = true
      }

      return cx(classes, props.class, props.className)
    }
  }

  const compose: Compose =
    (...components) =>
    (props) => {
      const propsWithoutClass = Object.fromEntries(
        Object.entries(props || {}).filter(([key]) => !["class", "className"].includes(key))
      )

      return cx(
        components.map((component) => component(propsWithoutClass)),
        props?.class,
        props?.className
      )
    }

  return {
    cx,
    cvax,
    compose,
  }
}

/* cx
   ============================================ */
interface CX {
  (...inputs: ClassValue[]): string
}
function classic(...inputs: ClassValue[]): string
function classic() {
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
  if (!classes || classes === true || typeof classes === "function") return ""
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

function assertsKeyof<T>(_arg: unknown): asserts _arg is T {}
function toString<T extends PropertyKey>(value: any): Extract<T, string> {
  if (typeof value === "boolean" || typeof value === "number") {
    return value.toString() as any
  }
  if (!value) return "" as any
  return value.toString()
}

/* mergeVariants
   ============================================ */

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

type DefaultVariants<T extends { variants: Record<PropertyKey, any> }> = {
  [Key in keyof T]?: StringToBoolean<keyof T["variants"][PropertyKey]> | "unset"
}

function merge<T, U>(
  baseVariants: Config<T>,
  newVariants: Config<U>
): Prettify<{
  base: string
  variants: Prettify<MergeVariants<T, U>>
  defaultVariants: DefaultVariants<
    MergeVariants<T, U> extends { variants: Record<PropertyKey, any> } ? MergeVariants<T, U> : never
  >
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

const { cvax, cx, compose } = cvaxify()
export type {
  CVAX,
  VariantProps,
  CVAXVariantShape,
  CVAXVariantSchema,
  ClassValue,
  Variant,
  ClassProp,
  Config,
  StringToBoolean,
}
export { cvax, cx, compose, cvaxify, variantIdentity, merge as mergeVariants }
