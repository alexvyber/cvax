import { cvax, VariantProps, variantIdentity } from "cvax"

const config = variantIdentity({
  base: "",
  variants: {
    intent: { kill: "", grubByPussy: "", primary: "" },
    rounded: { xl: "", xs: "" },
    shadow: { dark: "", bight: "" },
    shit: { some: "", other: "" },
  },
  defaultVariants: { intent: "kill", rounded: "xl", shadow: "dark" },
  compoundVariants: [],
})
const variants = cvax(config)

type Props = React.ComponentProps<"div"> &
  VariantProps<typeof variants> & {
    onClick: () => void
    more: string
    other: number
  } & React.PropsWithChildren

function ButtonTwo({
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

export { ButtonTwo, config as buttonTwoConfig, variants as buttonTwoVariants, type Props as ButtonTwoProps }
