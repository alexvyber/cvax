import type { StringToBoolean } from "."
import type { UserAuthoredStyles } from "@stylexjs/stylex/lib/StyleXTypes"

type CvaxStyles = { styles?: UserAuthoredStyles }

type Cvax = <_ extends "iternal use only", V extends CvaxVariantShape>(config: {
  base?: UserAuthoredStyles
  variants?: V
  compoundVariants?: (V extends CvaxVariantShape
    ? (
        | CvaxVariantSchema<V>
        | { [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | StringToBoolean<keyof V[Variant]>[] | undefined }
      ) &
        CvaxStyles
    : CvaxStyles)[]
  defaultVariants?: CvaxVariantSchema<V>
}) => (props?: V extends CvaxVariantShape ? CvaxVariantSchema<V> & CvaxStyles : CvaxStyles) => string

type CvaxVariantSchema<V extends CvaxVariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined | "unset"
}

type CvaxVariantShape = { [config: string]: { [variant: string]: UserAuthoredStyles } }

const cvax: Cvax = (_) => {
  return null as any
}

export { cvax }
