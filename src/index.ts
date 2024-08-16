import { classic, type ClassValue } from "@alexvyber/classic"

// Utility types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T

// cvax
type CvaxConfigBase = { base?: ClassValue }
type CvaxVariantShape = Record<string, Record<string, ClassValue>>
type CvaxClassProp = { class: ClassValue; className?: never } | { class?: never; className: ClassValue } | { class?: never; className?: never }
type CvaxVariantSchema<V extends CvaxVariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined | "unset"
}

type VariantProps<T> = T extends (props: infer U) => string ? Omit<U extends undefined ? never : U, keyof CvaxClassProp> : never

type Cvax = <_ extends "iternal use only", V>(
  config: V extends CvaxVariantShape
    ? CvaxConfigBase & {
        variants?: V

        // TODO: compoundVariants should type error when trying to compound incompatible variants
        compoundVariants?: (V extends CvaxVariantShape
          ? (
              | CvaxVariantSchema<V>
              | {
                  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | StringToBoolean<keyof V[Variant]>[] | undefined
                }
            ) &
              CvaxClassProp
          : CvaxClassProp)[]

        // TODO: defaultVariants should type error when trying to default incompatible variants
        defaultVariants?: CvaxVariantSchema<V>

        incompatible?: {
          [Variant in keyof V]?: {
            [Key in keyof V[Variant]]?: {
              [IncompatibleVariant in Exclude<keyof V, Variant>]?: readonly (keyof V[IncompatibleVariant])[]
            }
          }
        }
      }
    : CvaxConfigBase & {
        variants?: never
        compoundVariants?: never
        defaultVariants?: never
        incompatible?: never
      }
) => (props?: V extends CvaxVariantShape ? CvaxVariantSchema<V> & CvaxClassProp : CvaxClassProp) => string

// compose
type Compose = <T extends ReturnType<Cvax>[]>(...components: [...T]) => (props?: (UnionToIntersection<{ [K in keyof T]: VariantProps<T[K]> }[number]> | undefined) & CvaxClassProp) => string

// defineConfig
interface CvaxConfigOptions {
  hooks?: {
    /**
     * Returns the completed string of concatenated classes/classNames.
     */
    onComplete?: (className: string) => string
  }
}

// cvaxify
function cvaxify(options?: CvaxConfigOptions): {
  compose: Compose
  cx: typeof classic
  cvax: Cvax
} {
  const cx: typeof classic = (...inputs) => {
    if (typeof options?.hooks?.onComplete === "function") {
      return options?.hooks.onComplete(classic(inputs))
    }

    return classic(inputs)
  }

  const cvax: Cvax = (config) => {
    if (!config) {
      return (props?: CvaxClassProp): string => cx(props?.class, props?.className)
    }

    if (!config.variants) {
      return (props?: CvaxClassProp): string => cx(config.base, props?.class, props?.className)
    }

    return function variants(props): string {
      let classes = cx(config.base)
      let tmp: any

      if (!props) {
        if (!("defaultVariants" in config && config.defaultVariants)) {
          return classes
        }

        for (const variant of Object.keys(config.variants!) as (keyof typeof config.variants)[]) {
          const key = toString(config.defaultVariants[variant])

          if ((tmp = config.variants?.[variant][key])) {
            classes = cx(classes, tmp)
          }
        }

        if (!config.compoundVariants) {
          return classes
        }

        let adding = true

        for (const compound of config.compoundVariants) {
          for (const prop in compound) {
            if (prop === "class" || prop === "className") {
              continue
            }

            if (config.defaultVariants[prop] !== compound[prop]) {
              adding = false
              break
            }
          }

          if (adding) {
            classes = cx(classes, compound.class, compound.className)
          }

          adding = true
        }

        return classes
      }

      // incompatible
      if (config.incompatible) {
        for (const key of Object.keys(config.incompatible)) {
          if (key in props) {
            // @ts-expect-error: no inference needed
            if (props[key] in config.incompatible[key]) {
              // @ts-expect-error: kinda imposible to make inference right
              const incompatibles = config.incompatible[key][
                // @ts-expect-error: kinda imposible to make inference right
                props[key]
              ] as object

              for (const incompatible of Object.keys(incompatibles)) {
                if (
                  incompatible in props &&
                  // @ts-expect-error: no inference needed
                  incompatibles[incompatible].includes(props[incompatible])
                ) {
                  throw new Error(
                    // @ts-expect-error: no inference needed
                    `You called variants with incompatible variatns: { ${key}: "${props[key]}"} incompatible with {  ${incompatible}: "${props[incompatible]}"}`
                  )
                }
              }
            }
          }
        }
      }

      // TODO: rewrite to go through variants from props - not from config
      for (const variant of Object.keys(config.variants!) as (keyof typeof config.variants)[]) {
        const value = toString(props[variant as keyof typeof props]) || toString(config.defaultVariants?.[variant])

        if ((tmp = config.variants?.[variant][value])) {
          classes = cx(classes, tmp)
        }
      }

      if (!config.compoundVariants) {
        return cx(classes, props.class, props.className)
      }

      let adding = true

      for (const compound of config.compoundVariants) {
        for (const prop in compound) {
          if (prop === "class" || prop === "className") {
            continue
          }

          if (Array.isArray(compound[prop])) {
            if (!(compound[prop] as any[]).includes(props[prop as keyof typeof props])) {
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

        if (adding) {
          classes = cx(classes, compound.class, compound.className)
        }

        adding = true
      }

      return cx(classes, props.class, props.className)
    }
  }

  const compose: Compose =
    (...components) =>
    (props) => {
      const { class: clss, className, ...rest } = props ?? {}
      let tmp: string
      let classes = ""

      for (const component of components) {
        if ((tmp = component(rest))) {
          classes = `${classes} ${tmp.trim()}`
        }
      }

      return cx(classes, clss, className)
    }

  return { cx, cvax, compose }
}

function toString(value: any): string {
  if (typeof value === "boolean" || typeof value === "number") {
    return value.toString()
  }

  if (!value) {
    return ""
  }

  return value.toString()
}

const { cvax, cx, compose } = cvaxify()

export type { VariantProps, Cvax, ClassValue, Compose, CvaxConfigOptions }
export { cvax, cx, compose, cvaxify }
