export const defaultbuttonVariants = {
  base: "bg-primary hover:bg-primary-hover text-main font-medium text-base",
  variants: {
    variant: {
      primary: "bg-primary hover:bg-primary-hover text-main font-medium text-base",
      underline: "hover:text-primary-hover underline p-0",
      asdf: "hover:text-primary-hover underline p-0",
    },
    size: {
      large: "py-4 px-6",
      small: "py-2 px-4",
    },
    other: {
      large: "py-4 px-6",
      small: "py-2 px-44",
      asmall: "py-2 px-44",
      aaasmall: "py-2 px-44",
    },
    qwert: { one: "py-4 px-6", two: "py-4 px-6" },
  },

  defaultVariants: {
    variant: "primary",
    size: "large",
  },

  compoundVariants: [
    {
      variant: "primary",
      size: "small",
      className: "bg-red-500",
    },
    {
      variant: "primary",
      size: "large",
      className: "bg-red-500",
    },
  ],
} as const

export const newVariants = {
  base: "bg-primary hover:bg-primary-hover text-main font-medium text-base",
  variants: {
    variant: {
      primary: "bg-red-500 hover:bg-primary-hover text-main font-medium text-base",
      secondary: "bg-neutral-200 hover:bg-neutral-300 text-main",
      dark: "bg-neutral-800 hover:bg-neutral-850 text-white",
      light: "bg-white hover:bg-neutral-50",
      underline: "hover:text-primary-hover underline p-0",
      asdasdad: "hover:text-primary-hover underline p-0",
      qwerty: "hover:text-primary-hover underline p-0",
      lol: "hover:text-primary-hover underline p-0",
    },
    size: {
      large: "py-4 px-6",
      small: "py-2 px-44",
    },
    some: {
      large: "py-4 px-6",
      small: "py-2 px-44",
    },
    other: {
      large: "py-4 px-6",
      small: "py-2 px-44",
    },
    aaaaaaaaaaaaa: { one: "py-4 px-6", two: "py-4 px-6" },
    ASDdasdasd: { asdfasdf: "asdfasdf" },
    qwert: { one: "aaaaaaaaaaaapy-4 px-6", two: "py-4 px-6aaaaaaaaaa" },
  },

  defaultVariants: {
    variant: "primary",
    size: "large",
    some: "large",
    other: "large",
    ASDdasdasd: "asdfasdf",
    aaaaaaaaaaaaa: "one",
  },

  compoundVariants: [
    {
      variant: "primary",
      size: "large",
      className: "bg-red-500",
    },
    {
      variant: "primary",
      size: "small",
      className: "bg-red-500",
    },
  ],
} as const

export const emptyVariants = {
  base: "",
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
}

export const className =
  "rounded-lg disabled:bg-[#e0e0e0] disabled:opacity-50 flex items-center justify-center transition-all"

export const variants = {
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
    },
    more: "px-4",
  },

  defaultVariants: {
    variant: "primary",
    size: "large",
  },

  compoundVariants: [],
}

export const one = {
  base: "bg-primary hover:bg-primary-hover text-main font-medium text-base",

  variants: {
    variant: {
      primary: ["bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
      // **or**
      // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
      secondary: ["bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      size: "medium",
      class: "uppercase",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
} as const

export const two = {
  base: "bg-primary hover:bg-primary-hover text-main font-medium text-base",

  variants: {
    variant: {
      primary: ["bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
      // **or**
      // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
      secondary: ["bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
    },
  },

  compoundVariants: [
    {
      variant: "primary",
      size: "medium",
      class: "uppercase",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
} as const

export const btnStyles = {
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
    toggle: false,
  },
  compoundVariants: [
    {
      intent: "primary",
      size: "large",
      className: "some className",
    },
  ],
} as const

export const defaultVariants = {
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
      size: "small",
      className: "some className",
    },
  ],
} as const
