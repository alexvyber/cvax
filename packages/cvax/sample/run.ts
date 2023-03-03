import { cn, cvax, mergeVariants, type VariantProps } from "../src/"

const btnStyles = {
  base: "rounded-lg disabled:bg-[#e0e0e0] disabled:opacity-50  items-center justify-center transition-all bg-green-900 sm:flex",

  variants: {
    variant: {
      primary: "bg-red-500 hover:bg-primary-hover text-main font-medium text-base",
      // secondary: 'bg-neutral-200 hover:bg-neutral-300 text-main',
      // dark: 'bg-neutral-800 hover:bg-neutral-850 text-white',
      // light: 'bg-white hover:bg-neutral-50',
      // underline: 'hover:text-primary-hover underline p-0',
      shit: "asdfasdfasdf",
    },
    size: {
      large: "py-4 px-6",
      small: "py-2 px-4",
      extraBig: "py-2 px-4",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "small",
  },

  compoundVariants: [],
} as const

const defaultVariants = {
  base: [
    "rounded-lg disabled:bg-[#ff0] disabled:opacity-50 flex items-left justify-center transition-all bg-red-500 grid",
    "rounded-lg disabled:bg-[#ff0] disabled:opacity-50 flex items-left justify-center transition-all bg-red-500 grid",
    "rounded-lg disabled:bg-[#ff0] disabled:opacity-50 flex items-left justify-center transition-all bg-red-500 grid",
  ],
  variants: {
    variant: {
      primary: "bg-primary hover:bg-primary-hover text-main font-medium text-base",
      secondary: "bg-neutral-200 hover:bg-neutral-300 text-main",
      dark: "bg-neutral-800 hover:bg-neutral-850 text-white",
      light: "bg-white hover:bg-neutral-50",
      underline: "hover:text-primary-hover underline p-0",
    },

    size: {
      large: "py-4 px-6",
      small: "py-2 px-4",
      big: "py-2 px-4",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "large",
  },

  compoundVariants: [],
} as const

const mergedVariants = mergeVariants(defaultVariants, btnStyles)

console.log("🚀 ~ mergedVariants:", mergedVariants)

const buttonVariants = cvax(mergeVariants(defaultVariants, btnStyles))
console.log("🚀 ~ buttonVariants:", buttonVariants)

const asdf = buttonVariants({ variant: "secondary" })
console.log("🚀 ~ asdf:", asdf)
