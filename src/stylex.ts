import type { StringToBoolean } from "."
import type { UserAuthoredStyles } from "@stylexjs/stylex/lib/StyleXTypes"
import * as stylex from "@stylexjs/stylex"

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
}) => (props?: V extends CvaxVariantShape ? CvaxVariantSchema<V> & CvaxStyles : CvaxStyles) => Readonly<{
  className?: string
  style?: Readonly<{ [key: string]: string | number }>
}>

type CvaxVariantSchema<V extends CvaxVariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined | "unset"
}

type CvaxVariantShape = {
  [config: string]: { [variant: string]: UserAuthoredStyles }
}

const cvax: Cvax = (config) => {
  if (!config) {
    return (props: UserAuthoredStyles) => stylex.props(stylex.create({ props }).props)
  }

  return null as any
}

export { cvax }

const styles = stylex.create({
  main: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
})

stylex.props(styles.main)
stylex.props(styles.card)
