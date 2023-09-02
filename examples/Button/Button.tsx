import { cvax, VariantProps, variantIdentity } from "cvax"

const config = variantIdentity({
  base: "",
  variants: {
    intent: { primary: "", secondary: "" },
    rounded: { full: "", lg: "", none: "" },
    shadow: { none: "", sm: "", lg: "", xl: "" },
    katzen: {
      true: "",
      false: "",
    },
  },
  defaultVariants: { intent: "primary", rounded: "full", shadow: "none" },
  compoundVariants: [],
})

const variants = cvax(config)

type Props = React.ComponentProps<"div"> &
  VariantProps<typeof variants> & {
    onClick: () => void
    more: string
    other: number
  } & React.PropsWithChildren

function Button({
  children,
  onClick = () => console.log("some"),
  more,
  other = 12,
  intent,
  rounded,
  shadow,
  ...props
}: Props) {
  return <div className={variants({ intent, rounded, shadow })} {...props} />
}

export { Button, config as buttonConfig, variants as buttonVariants, type Props as ButtonProps }
