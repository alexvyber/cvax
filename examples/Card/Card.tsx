import { cx, cvax, VariantProps, variantIdentity } from "cvax"

const config = variantIdentity({
  base: "",
  variants: {
    some: { one: "", two: "" },
  },
  defaultVariants: { some: "one" },
  compoundVariants: [],
})
const variants = cvax(config)

type Props = React.ComponentProps<"div"> & VariantProps<typeof variants> & {}

const Card = ({ some }: Props) => {
  return <div className={variants({ some })} />
}

export { Card, config as cardConfig, variants as cardVariants, type Props as CardProps }

/**
 * Box
 */
export type BoxProps = VariantProps<typeof box>
export const box = cvax({
  base: ["box", "box-border"],
  variants: {
    margin: { 0: "m-0", 2: "m-2", 4: "m-4", 8: "m-8" },
    padding: { 0: "p-0", 2: "p-2", 4: "p-4", 8: "p-8" },
  },
  defaultVariants: {
    margin: 0,
    padding: 0,
  },
})

/**
 * Card
 */
type CardBaseProps = VariantProps<typeof cardBase>
const cardBase = cvax({
  base: ["card", "border-solid", "border-slate-300", "rounded"],
  variants: {
    shadow: {
      md: "drop-shadow-md",
      lg: "drop-shadow-lg",
      xl: "drop-shadow-xl",
    },
  },
})

interface CardProps extends BoxProps, CardBaseProps {}
export const card = ({ margin, padding, shadow }: CardProps = {}) =>
  cx(box({ margin, padding }), cardBase({ shadow }))
