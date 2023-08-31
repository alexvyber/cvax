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
  ): (props?: V extends CVAXVariantShape ? CVAXVariantSchema<V> & CVAXClassProp : CVAXClassProp) => string
}

type VariantProps<T> = T extends (props: infer U) => string ? Omit<ExcludeUndefined<U>, keyof ClassProp> : never

/* compose
   ============================================ */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
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

interface CVAXConfig {
  (options?: CVAXConfigOptions): {
    compose: Compose
    cx: CX
    cvax: CVAX
  }
}

const cvaxify: CVAXConfig = (options) => {
  const cx: CX = (...inputs) => {
    if (typeof options?.hooks?.onComplete === "function") return options?.hooks.onComplete(classic(inputs))
    return classic(inputs)
  }

  const cvax: CVAX = (config) => {
    if (!config) return (props?: ClassProp): string => cx(props?.class, props?.className)
    if (!config.variants) return (props?: ClassProp): string => cx(config.base, props?.class, props?.className)

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
        const value = toString(props[variant as keyof typeof props]) || toString(config.defaultVariants?.[variant])

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
            if (!(compound[prop] as any as Array<any>).includes(props[prop as keyof typeof props])) {
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

const { cvax, cx, compose } = cvaxify()
export { type CVAX, type VariantProps, type ClassValue }
export {
  cvax,
  cx,
  compose,
  cvaxify,
  //  createVariant
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
