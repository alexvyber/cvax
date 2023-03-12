import { cvax, mergeVariants } from "../src/"
import { btnStyles, defaultVariants, one, two } from "./sample"

const mergedVariants = mergeVariants(defaultVariants, btnStyles)
console.log("🚀 ~ mergedVariants:", mergedVariants)

const buttonVariants_ = cvax(mergedVariants)
buttonVariants_({
  intent: "SOME_STUFF",
})
buttonVariants_({
  intent: "OTHER_STUF",
  toggle: false,
})

const mergedOneTwo = mergeVariants(one, two)
const oneTwoVariants = cvax(mergedOneTwo)
const oneTwo = [
  oneTwoVariants({ size: "small" }),
  oneTwoVariants({ size: "medium" }),
  oneTwoVariants({ variant: "primary" }),
  oneTwoVariants({ variant: "secondary" }),
  oneTwoVariants({ size: "medium", variant: "primary" }),
  oneTwoVariants({ size: "medium", variant: "secondary" }),
]
oneTwo.map(item => console.log(item))
