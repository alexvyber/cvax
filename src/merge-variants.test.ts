import { describe, it as test, expect } from "vitest"
import { isCompoundsEquivalent, mergeTwoObjects, mergeVariants } from "./merge-variants"
import { variantIdentity } from "."

const generatedDefault = {
  base: "",
  compoundVariants: [],
  defaultVariants: {},
  variants: {},
}

function withGeneratedDefault(obj: object): {
  base: string
  compoundVariants: any[]
  // defaultVariants: object
  variants: object
} {
  return { ...generatedDefault, ...obj }
}

// TODO: write all test cases for mergeVariants
describe("mergeVariants", () => {
  const defaultVarinats = variantIdentity({
    base: "",
    variants: {
      intent: {
        primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
        secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
        danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
      },
      disabled: {
        true: "opacity-050 cursor-not-allowed",
        false: "cursor-pointer",
      },
      size: {
        small: "text-sm py-1 px-2",
        medium: "text-base py-2 px-4",
        large: "text-lg py-2.5 px-4",
      },
      m: {
        0: "m-0",
        1: "m-1",
      },
    },
    defaultVariants: {},
    compoundVariants: [
      {
        intent: "warning",
        disabled: false,
        className: "text-gray-800",
      },

      {
        intent: "primary",
        size: "medium",
        className: "uppercase",
      },
      {
        intent: "warning",
        disabled: true,
        className: "text-black",
      },
    ],
  })
  const newVariants = variantIdentity({
    base: "",
    variants: {
      intent: {
        primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
        secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
        danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
      },
      disabled: {
        true: "opacity-050 cursor-not-allowed",
        false: "cursor-pointer",
      },
      size: {
        small: "text-sm py-1 px-2",
        medium: "text-base py-2 px-4",
        large: "text-lg py-2.5 px-4",
      },
      m: {
        0: "m-0",
        1: "m-1",
      },
    },
    defaultVariants: {},
    compoundVariants: [
      {
        intent: "warning",
        disabled: false,
        className: "text-gray-800",
      },
      {
        intent: "primary",
        size: "medium",
        className: "uppercase",
      },
      {
        intent: "warning",
        disabled: true,
        className: "text-black",
      },
    ],
  })

  const mergedVariants = mergeVariants(defaultVarinats, newVariants)

  test("same variants", () => {
    expect(mergedVariants).toEqual(withGeneratedDefault(defaultVarinats))
    expect(mergedVariants).toEqual(withGeneratedDefault(newVariants))
  })
})

describe("mergeVariants", () => {
  const defaultVarinats = {
    variants: {
      intent: {
        primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600 text-7xl",
      },
    },
  }

  const newVariants = {
    variants: {
      intent: {
        primary: "bg-blue-500 text-red border-transparent hover:bg-blue-600",
      },
    },
  }

  const expected = {
    variants: {
      intent: {
        primary: "text-7xl bg-blue-500 text-red border-transparent hover:bg-blue-600",
      },
    },
  }

  const mergedVariants = mergeVariants(defaultVarinats, newVariants)

  test("same variants", () => {
    expect(mergedVariants).toEqual(withGeneratedDefault(expected))
  })
})

describe("mergevariants", () => {
  const baseOnly = {
    base: "mt-2",
  }

  const variantsOnly = variantIdentity({
    base: "mt-2",
    variants: {
      intent: {
        primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
        secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
        danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
      },
    },
  })

  const defaultVariants = variantIdentity({
    base: "mt-2",
    variants: {
      intent: {
        primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
        secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
        danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  })

  const compoundVariants = variantIdentity({
    base: "mt-2",
    variants: {
      intent: {
        primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
        secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
        danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
      },
    },
    defaultVariants: {},
    compoundVariants: [
      {
        intent: "primary",
        className: "mt-14",
      },
    ],
  })

  const stupidShit = variantIdentity({
    base: "mt-2",
    variants: {
      intent: {
        primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
        secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
        danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
      },
    },
    defaultVariants: {},
    compoundVariants: [
      {
        className: "mt-14",
      },

      {
        class: "mt-14",
      },

      {
        intent: "primary",
      },
    ],
  })

  const moreShit = variantIdentity({
    base: "mt-2",
    variants: {
      intent: {
        primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
        secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
        danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
      },
    },
    defaultVariants: {},
    compoundVariants: [
      {
        intent: "primary",
        class: "mt-14",
      },

      {
        intent: "primary",
        className: "mt-14",
      },

      {
        intent: "primary",
        class: "mt-14",
      },

      {
        intent: "primary",
        class: "mt-14",
      },
      {
        intent: "primary",
        className: "mt-14",
      },

      {
        intent: "primary",
        class: "mt-14",
      },

      {
        intent: "primary",
        className: "mt-14",
      },
    ],
  })

  describe.each([
    [{}, {}, generatedDefault],
    [baseOnly, baseOnly, withGeneratedDefault(baseOnly)],
    [variantsOnly, variantsOnly, withGeneratedDefault(variantsOnly)],
    [defaultVariants, defaultVariants, withGeneratedDefault(defaultVariants)],
    [compoundVariants, compoundVariants, withGeneratedDefault(compoundVariants)],
    [
      stupidShit,
      stupidShit,
      {
        base: "mt-2",
        variants: {
          intent: {
            primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
          },
        },
        defaultVariants: {},
        compoundVariants: [],
      },
    ],
    [
      moreShit,
      moreShit,
      {
        base: "mt-2",
        variants: {
          intent: {
            primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: "bg-red-500 text-white border-transparent hover:bg-red-600",
          },
        },
        defaultVariants: {},
        compoundVariants: [
          {
            intent: "primary",
            className: "mt-14",
          },
        ],
      },
    ],
  ])("mergevariants(%o)", (baseVariants, newVariants, expected) => {
    test("same variants", () => {
      // @ts-ignore
      expect(mergeVariants(baseVariants, newVariants)).toEqual(expected)
    })
  })
})

describe("mergeTwoObjects", () => {
  const func = () => console.log("func")
  const otherFunc = () => console.log("otherFunc")

  const obj = {
    a: { f: func },
  }
  const otherObj = {
    a: { f: otherFunc },
  }

  describe.each<{
    left: object
    right: object
    expected: object
  }>([
    { left: {}, right: {}, expected: {} },
    { left: [], right: [], expected: {} },
    { left: [1, 2, 3, 4], right: [], expected: {} },
    { left: () => {}, right: [], expected: {} },
    {
      left: (a: any, b: any, c: any) => {
        return [a, b, c]
      },
      right: [],
      expected: {},
    },
    { left: { a: 1 }, right: {}, expected: { a: 1 } },
    {
      left: { a: "string" },
      right: { a: "string" },
      expected: { a: "string" },
    },
    { left: { a: "string" }, right: { a: 69 }, expected: { a: 69 } },
    { left: { a: "string" }, right: { a: false }, expected: { a: false } },
    { left: { a: 420 }, right: { a: obj }, expected: { a: obj } },
    {
      left: { a: "string", b: { c: [] } },
      right: {},
      expected: { a: "string", b: { c: [] } },
    },
    {
      left: { a: "string", b: { c: [], f: func } },
      right: {},
      expected: { a: "string", b: { c: [], f: func } },
    },
    { left: { o: obj }, right: {}, expected: { o: obj } },
    { left: { f: func }, right: { f: otherFunc }, expected: { f: otherFunc } },
    {
      left: { f: func, o: obj },
      right: { f: otherFunc, o: otherObj },
      expected: { f: otherFunc, o: otherObj },
    },
  ])("merge(%o)", ({ left, right, expected }) => {
    test(`returns ${expected}`, () => {
      expect(mergeTwoObjects(left, right)).toEqual(expected)
    })
  })
})

describe("isCompoundsEquivalent", () => {
  describe.each<[object, object, boolean]>([
    [
      {
        class: "one",
        className: "two",
      },
      {
        class: "three",
        className: "four",
      },
      true,
    ],
    [
      {
        one: 1,
        two: 2,
        class: "one",
        className: "two",
      },
      {
        one: 1,
        two: 2,
        class: "three",
        className: "four",
      },
      true,
    ],

    [
      {
        one: 1,
        two: 2,
        class: "one",
        className: "two",
      },
      {
        one: 1,
        two: 2,
        three: 3,
        class: "three",
        className: "four",
      },
      false,
    ],
    [
      {
        one: 2,

        class: "one",
        className: "two",
      },
      {
        one: 1,

        class: "three",
        className: "four",
      },
      false,
    ],
  ])("isCompoundsEquivalent(%o)", (left, right, expected) => {
    test(`returns ${expected}`, () => {
      expect(isCompoundsEquivalent(left, right)).toEqual(expected)
    })
  })
})
