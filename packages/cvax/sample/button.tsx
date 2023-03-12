import { forwardRef } from "react"
import { cn, cvax, mergeVariants, type VariantProps } from "../src/"
import React from "react"

const btnStyles = {
  base: "rounded-lg disabled:bg-red-[#ff0] disabled:opacity-50 flex items-center justify-center transition-all",
  variants: {
    variant: {
      primary: "bg-red-500 hover:bg-primary-hover text-main font-medium text-base",
      // secondary: 'bg-neutral-200 hover:bg-neutral-300 text-main',
      // dark: 'bg-neutral-800 hover:bg-neutral-850 text-white',
      // light: 'bg-white hover:bg-neutral-50',
      // underline: 'hover:text-primary-hover underline p-0',
      shit: "asdfasdfasdf",
      cat: "asdfasdfasdf",
    },
    size: {
      large: "py-4 px-6",
      small: "py-2 px-4",
      extraBig: "py-2 px-4",
    },
  },

  // defaultVariants: {
  //   variant: 'primary',
  //   size: 'large',
  // },

  compoundVariants: [],
} as const

const defaultVariants = {
  base: "rounded-lg disabled:bg-[#e0e0e0] disabled:opacity-50 flex items-center justify-center transition-all",
  variants: {
    variant: {
      primary: "bg-primary hover:bg-primary-hover text-main font-medium text-base",
      secondary: "bg-neutral-200 hover:bg-neutral-300 text-main",
      dark: "bg-neutral-800 hover:bg-neutral-850 text-white",
      light: "bg-white hover:bg-neutral-50",
      underline: "hover:text-primary-hover underline p-0",
      katzen: "asdfasdfasdf",
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
const buttonVariants = cvax(mergeVariants(defaultVariants, btnStyles))

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = "Button"

export { Button }
