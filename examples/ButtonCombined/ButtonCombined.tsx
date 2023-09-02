import { cvax, VariantProps, mergeVariants } from "cvax"
import { buttonConfig } from "../Button/Button"
import { buttonTwoConfig } from "../ButtonTwo/ButtonTwo"

const config = mergeVariants(buttonConfig, buttonTwoConfig)

const variants = cvax(config)

type Props = React.ComponentProps<"div"> & VariantProps<typeof variants>

const ButtonCombined = ({ intent, rounded, shadow, ...props }: Props) => {
  return <div className={variants({ intent, rounded, shadow })} {...props} />
}

export {
  ButtonCombined,
  config as buttonCombinedConfig,
  variants as buttonCombinedVariants,
  type Props as ButtonCombinedProps,
}
;<>
  <ButtonCombined intent="grubByPussy" shit="some" />
</>
