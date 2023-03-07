import { cn, cvax, mergeVariants, type VariantProps } from "../src/"

const btnStyles = {
  base: "rounded-lg disabled:bg-[#e0e0e0] disabled:opacity-50  items-center justify-center transition-all bg-green-900 sm:flex",

  variants: {
    intent: {
      primary: "bg-red-500 hover:bg-primary-hover text-main font-medium text-base",
      // secondary: 'bg-neutral-200 hover:bg-neutral-300 text-main',
      // dark: 'bg-neutral-800 hover:bg-neutral-850 text-white',
      // light: 'bg-white hover:bg-neutral-50',
      // underline: 'hover:text-primary-hover underline p-0',
      shit: "asdfasdfasdf",
      OTHER_STUF: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
    },
    size: {
      large: "py-4 px-6",
      small: "py-2 px-4",
      extraBig: "py-2 px-4",
    },
    rounded: {
      lg: "LG PP LL",
    },
  },

  defaultVariants: {
    intent: "primary",
    size: "small",
  },
  compoundVariants: [
    {
      intent: "primary",
      size: "large",
      className: "some className",
    },
  ],
} as const

const defaultVariants = {
  base: [
    "rounded-lg disabled:bg-[#ff0] disabled:opacity-50 flex items-left justify-center transition-all bg-red-500 grid",
    "rounded-lg disabled:bg-[#ff0] disabled:opacity-50 flex items-left justify-center transition-all bg-red-500 grid",
    "rounded-lg disabled:bg-[#ff0] disabled:opacity-50 flex items-left justify-center transition-all bg-red-500 grid",
  ],
  variants: {
    intent: {
      primary: "bg-primary hover:bg-primary-hover text-main font-medium text-base",
      secondary: "bg-neutral-200 hover:bg-neutral-300 text-main",
      dark: "bg-neutral-800 hover:bg-neutral-850 text-white",
      light: "bg-white hover:bg-neutral-50",
      SOME_STUFF: "bg-white hover:bg-neutral-50",
      underline: "hover:text-primary-hover underline p-0",
    },

    size: {
      large: "py-4 px-6",
      small: "py-2 px-4",
      big: "py-2 px-4",
    },
    AOC: {
      one: "1",
    },
    toggle: {
      true: "TOGGGGGGGGGGGGGLE",
    },
  },

  defaultVariants: {
    intent: "primary",
    size: "large",
    toggle: true,
  },
  compoundVariants: [
    {
      intent: "primary",
      size: "large",
      className: "some className",
    },
  ],
} as const

// const merged = merge(defaultVariants, btnStyles)

const mergedVariants = mergeVariants(defaultVariants, btnStyles)
console.log("🚀 ~ mergedVariants:", mergedVariants)
// defaultVariants
// btnStyles
// mergeVariants

// const buttonVariants = cvax(mergeVariants(defaultVariants, btnStyles))
const buttonVariants_ = cvax(mergedVariants)
buttonVariants_({
  intent: "SOME_STUFF",
})
const asdf = buttonVariants_({
  intent: "OTHER_STUF",
  toggle: false,
})
console.log("🚀 ~ asdf:", asdf)

// const buttonVariants__ = cvax(merged)
// buttonVariants__({
//   intent: "SOME_STUFF",
// })
