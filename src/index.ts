import { classic, type ClassValue } from "@alexvyber/classic"

// Utility types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T
type ToIncompatibleKey<T> = T extends boolean ? `${T}` : T
type AnyTrue<T> = [Extract<T, true>] extends [never] ? false : true

// cvax
type CvaxConfigBase = { base?: ClassValue }
type CvaxVariantShape = Record<string, Record<string, ClassValue>>
type CvaxClassProp = { class: ClassValue; className?: never } | { class?: never; className: ClassValue } | { class?: never; className?: never }
type CvaxVariantSchema<V extends CvaxVariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined | "unset"
}

type CvaxIncompatible<V extends CvaxVariantShape> = {
  [Variant in keyof V]?: {
    [Key in keyof V[Variant]]?: {
      [IncompatibleVariant in Exclude<keyof V, Variant>]?: readonly (keyof V[IncompatibleVariant])[]
    }
  }
}

type CvaxTypeBrand<Props, Rules = never> = {
  readonly __cvax_variant_props__?: Props
  readonly __cvax_incompatible_rules__?: Rules
}

type Defined<T> = Exclude<T, undefined>

type DefaultValue<D, Variant extends PropertyKey> = D extends object
  ? Variant extends keyof D
    ? Defined<D[Variant]>
    : never
  : never

type EffectiveVariantProps<V extends CvaxVariantShape, D, P> = {
  [Variant in keyof V]: Variant extends keyof P
    ? [Defined<P[Variant]>] extends [never]
      ? DefaultValue<D, Variant>
      : Defined<P[Variant]>
    : DefaultValue<D, Variant>
}

type IncompatibleRuleForValue<
  V extends CvaxVariantShape,
  I extends CvaxIncompatible<V>,
  Variant extends keyof V,
  Value,
> = Variant extends keyof I
  ? ToIncompatibleKey<Value> extends keyof NonNullable<I[Variant]>
    ? NonNullable<NonNullable<I[Variant]>[ToIncompatibleKey<Value>]>
    : never
  : never

type VariantIsIncompatible<
  V extends CvaxVariantShape,
  I extends CvaxIncompatible<V>,
  P,
  Variant extends keyof V & keyof P,
> = IncompatibleRuleForValue<V, I, Variant, Exclude<P[Variant], undefined>> extends infer Rule
  ? Rule extends Record<PropertyKey, readonly unknown[]>
    ? AnyTrue<{
        [IncompatibleVariant in keyof Rule & keyof P]: [Exclude<P[IncompatibleVariant], undefined>] extends [never]
          ? false
          : ToIncompatibleKey<Exclude<P[IncompatibleVariant], undefined>> extends Rule[IncompatibleVariant][number]
            ? true
            : false
      }[keyof Rule & keyof P]>
    : false
  : false

type HasIncompatibleProps<
  V extends CvaxVariantShape,
  I extends CvaxIncompatible<V>,
  P,
> = AnyTrue<
  {
    [Variant in keyof V & keyof P]: VariantIsIncompatible<V, I, P, Variant>
  }[keyof V & keyof P]
>

type EnsureCompatibleProps<
  V extends CvaxVariantShape,
  I extends CvaxIncompatible<V> | undefined,
  P,
> = I extends CvaxIncompatible<V> ? (HasIncompatibleProps<V, I, P> extends true ? never : unknown) : unknown

type CvaxCallResult<
  V extends CvaxVariantShape,
  I extends CvaxIncompatible<V> | undefined,
  P,
> = I extends CvaxIncompatible<V> ? (HasIncompatibleProps<V, I, P> extends true ? never : string) : string

type CvaxIncompatibleRule<
  V extends CvaxVariantShape,
  I extends CvaxIncompatible<V>,
  D,
> = {
  variants: V
  incompatible: I
  defaults: D
}

type RuleIsIncompatible<Rule, P> = Rule extends CvaxIncompatibleRule<infer V, infer I, infer D>
  ? HasIncompatibleProps<V, I, EffectiveVariantProps<V, D, P>>
  : false

type HasIncompatibleRules<Rules, P> = [Rules] extends [never]
  ? false
  : AnyTrue<Rules extends unknown ? RuleIsIncompatible<Rules, P> : never>

type EnsureCompatibleRules<Rules, P> = HasIncompatibleRules<Rules, P> extends true ? never : unknown

type CvaxReturnWithVariants<
  V extends CvaxVariantShape,
  I extends CvaxIncompatible<V> | undefined,
  D extends CvaxVariantSchema<V> | undefined,
> = CvaxTypeBrand<
  CvaxVariantSchema<V>,
  I extends CvaxIncompatible<V> ? CvaxIncompatibleRule<V, I, D> : never
> & {
  <P = {}>(
    props?: P & CvaxVariantSchema<V> & CvaxClassProp & EnsureCompatibleProps<V, I, EffectiveVariantProps<V, D, P>>
  ): CvaxCallResult<V, I, EffectiveVariantProps<V, D, P>>
}

type VariantProps<T> = T extends CvaxTypeBrand<infer Props, any>
  ? Props
  : T extends (props: infer U) => string
    ? Omit<U extends undefined ? never : U, keyof CvaxClassProp>
    : never

type CvaxCompoundVariant<V extends CvaxVariantShape> = (
  | CvaxVariantSchema<V>
  | {
      [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | StringToBoolean<keyof V[Variant]>[] | undefined
    }
) &
  CvaxClassProp

type ConfigVariants<C> = C extends { variants: infer V extends CvaxVariantShape } ? V : never
type ConfigIncompatible<C, V extends CvaxVariantShape> = C extends { incompatible: infer I }
  ? Extract<I, CvaxIncompatible<V>>
  : undefined
type ConfigDefaults<C, V extends CvaxVariantShape> = C extends { defaultVariants: infer D }
  ? Extract<D, CvaxVariantSchema<V>>
  : undefined

type CvaxConfigConstraint<C> = C extends { variants: infer V extends CvaxVariantShape }
  ? CvaxConfigBase & {
      variants: V
      // TODO: compoundVariants should type error when trying to compound incompatible variants
      compoundVariants?: CvaxCompoundVariant<V>[]
      defaultVariants?: CvaxVariantSchema<V>
      incompatible?: CvaxIncompatible<V>
    } & EnsureCompatibleProps<
      V,
      ConfigIncompatible<C, V>,
      EffectiveVariantProps<V, undefined, ConfigDefaults<C, V>>
    >
  : CvaxConfigBase & {
      variants?: never
      compoundVariants?: never
      defaultVariants?: never
      incompatible?: never
    }

type CvaxReturn<C> = ConfigVariants<C> extends infer V extends CvaxVariantShape
  ? [V] extends [never]
    ? CvaxTypeBrand<{}> & ((props?: CvaxClassProp) => string)
    : CvaxReturnWithVariants<V, ConfigIncompatible<C, V>, ConfigDefaults<C, V>>
  : CvaxTypeBrand<{}> & ((props?: CvaxClassProp) => string)

type Cvax = <const C>(config: C & CvaxConfigConstraint<C>) => CvaxReturn<C>

// compose
type IncompatibleRules<T> = T extends CvaxTypeBrand<any, infer Rules> ? Rules : never
type CvaxComponent = CvaxTypeBrand<any, any> & ((props?: any) => string)
type ComposedVariantProps<T extends CvaxComponent[]> = UnionToIntersection<{ [K in keyof T]: VariantProps<T[K]> }[number]>
type ComposedIncompatibleRules<T extends CvaxComponent[]> = IncompatibleRules<T[number]>

type CvaxComposed<T extends CvaxComponent[]> = CvaxTypeBrand<ComposedVariantProps<T>, ComposedIncompatibleRules<T>> & {
  <P = {}>(props?: P & ComposedVariantProps<T> & CvaxClassProp & EnsureCompatibleRules<ComposedIncompatibleRules<T>, P>): string
}

type Compose = <T extends CvaxComponent[]>(...components: [...T]) => CvaxComposed<T>

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

  const cvax = ((config: any) => {
    if (!config) {
      return (props?: CvaxClassProp): string => cx(props?.class, props?.className)
    }

    if (!config.variants) {
      return (props?: CvaxClassProp): string => cx(config.base, props?.class, props?.className)
    }

    return function variants(props: any): string {
      let classes = cx(config.base)
      let tmp: any

      if (config.incompatible) {
        const effectiveProps = { ...config.defaultVariants }

        for (const variant of Object.keys(config.variants)) {
          if (props && toString(props[variant])) {
            effectiveProps[variant] = props[variant]
          }
        }

        assertCompatible(config.incompatible, effectiveProps)
      }

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
  }) as Cvax

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

function assertCompatible(incompatibleConfig: Record<string, Record<string, Record<string, unknown[]>>>, props: Record<string, unknown>): void {
  for (const variant of Object.keys(incompatibleConfig)) {
    const value = toString(props[variant])
    const incompatibleForValue = incompatibleConfig[variant]?.[value]

    if (!incompatibleForValue) {
      continue
    }

    for (const incompatibleVariant of Object.keys(incompatibleForValue)) {
      const incompatibleValue = toString(props[incompatibleVariant])

      if (incompatibleForValue[incompatibleVariant].some((value) => toString(value) === incompatibleValue)) {
        throw new Error(
          `You called variants with incompatible variants: { ${variant}: "${value}" } is incompatible with { ${incompatibleVariant}: "${incompatibleValue}" }`
        )
      }
    }
  }
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
