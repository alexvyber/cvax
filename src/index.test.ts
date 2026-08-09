import { classic } from "@alexvyber/classic"
import { compose, cvax, cvaxify, type VariantProps } from "./index.js"
import { describe, it, expect, expectTypeOf } from "vitest"

describe("cvax", () => {
  describe("without base", () => {
    describe("without anything", () => {
      it("empty", () => {
        // @ts-expect-error
        const example = cvax()
        expect(example()).toBe("")
        expect(
          example({
            // @ts-expect-error
            aCheekyInvalidProp: "lol",
          })
        ).toBe("")
        expect(example({ class: "adhoc-class" })).toBe("adhoc-class")
        expect(example({ className: "adhoc-className" })).toBe("adhoc-className")
        expect(
          example({
            className: "adhoc-className",
            // @ts-expect-error
            class: "adhoc-class",
          })
        ).toBe("adhoc-class adhoc-className")
        expect(
          example({
            class: "adhoc-class",
            // @ts-expect-error
            className: "adhoc-className",
          })
        ).toBe("adhoc-class adhoc-className")
      })

      it("undefined", () => {
        // @ts-expect-error
        const example = cvax(undefined)
        expect(example()).toBe("")
        expect(
          example({
            // @ts-expect-error
            aCheekyInvalidProp: "lol",
          })
        ).toBe("")
        expect(example({ class: "adhoc-class" })).toBe("adhoc-class")
        expect(example({ className: "adhoc-className" })).toBe("adhoc-className")
        expect(
          example({
            class: "adhoc-class",
            // @ts-expect-error
            className: "adhoc-className",
          })
        ).toBe("adhoc-class adhoc-className")

        expect(
          example({
            className: "adhoc-className",
            // @ts-expect-error
            class: "adhoc-class",
          })
        ).toBe("adhoc-class adhoc-className")
      })

      it("null", () => {
        const example = cvax(
          // @ts-expect-error
          null
        )
        expect(example()).toBe("")
        expect(
          example({
            // @ts-expect-error
            aCheekyInvalidProp: "lol",
          })
        ).toBe("")
        expect(example({ class: "adhoc-class" })).toBe("adhoc-class")
        expect(example({ className: "adhoc-className" })).toBe("adhoc-className")
        expect(
          example({
            class: "adhoc-class",
            // @ts-expect-error
            className: "adhoc-className",
          })
        ).toBe("adhoc-class adhoc-className")
        expect(
          example({
            className: "adhoc-className",
            // @ts-expect-error
            class: "adhoc-class",
          })
        ).toBe("adhoc-class adhoc-className")
      })
    })

    describe("objects", () => {
      const buttonOnlyBase = cvax({
        base: {},
      })
      const buttonOnlyVariants = cvax({
        variants: {},
      })
      const buttonOnlyCompoundVariants = cvax({
        // @ts-expect-error
        compoundVariants: [],
      })
      const buttonOnlyDefaultVariants = cvax({
        // @ts-expect-error
        defaultVariants: {},
      })

      const buttonAllEmptyObjects = cvax({
        base: {},
        variants: {},
        compoundVariants: [],
        defaultVariants: {},
      })

      const buttonOnlyBaseNull = cvax({
        base: null,
      })

      const buttonOnlyVariantsNull = cvax({
        // @ts-expect-error
        variants: null,
      })
      const buttonOnlyCompoundVariantsNull = cvax({
        // @ts-expect-error
        compoundVariants: null,
      })
      const buttonOnlyDefaultVariantsNull = cvax({
        // @ts-expect-error
        defaultVariants: null,
      })

      const buttonAllEmptyObjectsNull = cvax({
        // @ts-expect-error: invalid config is rejected as a whole
        base: null,
        // @ts-expect-error: variants cannot be null
        variants: null,
        // @ts-expect-error: compound variants cannot be null
        compoundVariants: null,
        // @ts-expect-error: default variants cannot be null
        defaultVariants: null,
      })

      type ButtonWithoutDefaultsWithoutBaseProps =
        | VariantProps<typeof buttonOnlyBase>
        | VariantProps<typeof buttonOnlyVariants>
        | VariantProps<typeof buttonOnlyCompoundVariants>
        | VariantProps<typeof buttonOnlyDefaultVariants>
        | VariantProps<typeof buttonAllEmptyObjects>
        | VariantProps<typeof buttonOnlyBaseNull>

      describe.each<[ButtonWithoutDefaultsWithoutBaseProps, string]>([
        [
          // @ts-expect-error
          undefined,
          "",
        ],
        [{}, ""],
        [
          {
            aCheekyInvalidProp: "lol",
          } as ButtonWithoutDefaultsWithoutBaseProps,
          "",
        ],
        [{ intent: "secondary" }, ""],
        [{ size: "small" }, ""],
        [{ disabled: true }, ""],
        [
          {
            intent: "secondary",
            size: "unset",
          },
          "",
        ],
        [{ intent: "secondary", size: undefined }, ""],
        [{ intent: "danger", size: "medium" }, ""],
        [{ intent: "warning", size: "large" }, ""],
        [{ intent: "warning", size: "large", disabled: true }, ""],
        [{ intent: "primary", m: 0 }, ""],
        [{ intent: "primary", m: 1 }, ""],
        [
          {
            intent: "primary",
            m: 1,
            class: "adhoc-class",
          },
          "adhoc-class",
        ],
        [
          {
            intent: "primary",
            m: 1,
            className: "adhoc-classname",
          },
          "adhoc-classname",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonOnlyBase(options)).toBe(expected)
          expect(buttonOnlyVariants(options)).toBe(expected)
          expect(buttonOnlyCompoundVariants(options)).toBe(expected)
          expect(buttonOnlyDefaultVariants(options)).toBe(expected)
          expect(buttonAllEmptyObjects(options)).toBe(expected)

          expect(buttonOnlyBaseNull(options)).toBe(expected)
          expect(buttonOnlyVariantsNull(options)).toBe(expected)
          expect(buttonOnlyCompoundVariantsNull(options)).toBe(expected)
          expect(buttonOnlyDefaultVariantsNull(options)).toBe(expected)
          expect(buttonAllEmptyObjectsNull(options)).toBe(expected)
        })
      })
    })

    describe("without defaults", () => {
      const buttonWithoutBaseWithoutDefaultsString = cvax({
        variants: {
          intent: {
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
          m: {
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            class: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
        ],
      })
      const buttonWithoutBaseWithoutDefaultsWithClassNameString = cvax({
        variants: {
          intent: {
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
          m: {
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            className: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
        ],
      })
      const buttonWithoutBaseWithoutDefaultsArray = cvax({
        variants: {
          intent: {
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
          m: {
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            class: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
        ],
      })
      const buttonWithoutBaseWithoutDefaultsWithClassNameArray = cvax({
        variants: {
          intent: {
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
          m: {
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            className: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
        ],
      })

      type ButtonWithoutDefaultsWithoutBaseProps =
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsString>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsArray>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameArray>

      describe.each<[ButtonWithoutDefaultsWithoutBaseProps, string]>([
        [
          // @ts-expect-error
          undefined,
          "",
        ],
        [{}, ""],
        [
          {
            aCheekyInvalidProp: "lol",
          } as ButtonWithoutDefaultsWithoutBaseProps,
          "",
        ],
        [{ intent: "secondary" }, "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],
        [{ size: "small" }, "button--small text-sm py-1 px-2"],
        [{ disabled: true }, "button--disabled opacity-050 cursor-not-allowed"],
        [
          {
            intent: "secondary",
            size: "unset",
          },
          "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        ],
        [{ intent: "secondary", size: undefined }, "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],
        [{ intent: "danger", size: "medium" }, "button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4"],
        [{ intent: "warning", size: "large" }, "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4"],
        [
          { intent: "warning", size: "large", disabled: true },
          "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black",
        ],
        [{ intent: "primary", m: 0 }, "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-0"],
        [{ intent: "primary", m: 1 }, "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1"],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: "primary",
            m: 1,
            class: "adhoc-class",
          } as ButtonWithoutDefaultsWithoutBaseProps,
          "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-class",
        ],
        [
          {
            intent: "primary",
            m: 1,
            className: "adhoc-classname",
          } as ButtonWithoutDefaultsWithoutBaseProps,
          "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-classname",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonWithoutBaseWithoutDefaultsString(options)).toBe(expected)
          expect(buttonWithoutBaseWithoutDefaultsWithClassNameString(options)).toBe(expected)
          expect(buttonWithoutBaseWithoutDefaultsArray(options)).toBe(expected)
          expect(buttonWithoutBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected)
        })
      })
    })

    describe("with defaults", () => {
      const buttonWithoutBaseWithDefaultsString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
          m: {
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            class: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithoutBaseWithDefaultsWithClassNameString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
          m: {
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            className: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithoutBaseWithDefaultsArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
          m: {
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            class: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: ["button--warning-danger-medium"],
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithoutBaseWithDefaultsWithClassNameArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
          m: {
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            className: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })

      type ButtonWithoutBaseWithDefaultsProps =
        | VariantProps<typeof buttonWithoutBaseWithDefaultsString>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsArray>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameArray>

      describe.each<[ButtonWithoutBaseWithDefaultsProps, string]>([
        [
          // @ts-expect-error
          undefined,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          {},
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          {
            aCheekyInvalidProp: "lol",
          } as ButtonWithoutBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          { intent: "secondary" },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0",
        ],

        [
          { size: "small" },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2 m-0",
        ],
        [
          { disabled: true },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          {
            intent: "secondary",
            size: "unset",
          },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer m-0",
        ],
        [
          { intent: "secondary", size: undefined },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0",
        ],
        [
          { intent: "danger", size: "medium" },
          "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--warning-danger !border-red-500 button--warning-danger-medium",
        ],
        [
          { intent: "warning", size: "large" },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-0 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: true },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 m-0 button--warning-disabled text-black button--warning-danger !border-red-500",
        ],
        [
          { intent: "primary", m: 0 },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          { intent: "primary", m: 1 },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase",
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: "primary",
            m: 0,
            class: "adhoc-class",
          } as ButtonWithoutBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase adhoc-class",
        ],
        [
          {
            intent: "primary",
            m: 1,
            className: "adhoc-classname",
          } as ButtonWithoutBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase adhoc-classname",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonWithoutBaseWithDefaultsString(options)).toBe(expected)
          expect(buttonWithoutBaseWithDefaultsWithClassNameString(options)).toBe(expected)
          expect(buttonWithoutBaseWithDefaultsArray(options)).toBe(expected)
          expect(buttonWithoutBaseWithDefaultsWithClassNameArray(options)).toBe(expected)
        })
      })
    })
  })

  describe("with base", () => {
    describe("without defaults", () => {
      const buttonWithBaseWithoutDefaultsString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            class: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: "button--warning-danger-medium",
          },
        ],
      })
      const buttonWithBaseWithoutDefaultsWithClassNameString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            className: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: "button--warning-danger-medium",
          },
        ],
      })
      const buttonWithBaseWithoutDefaultsArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            class: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: ["button--warning-danger-medium"],
          },
        ],
      })
      const buttonWithBaseWithoutDefaultsWithClassNameArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            className: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: ["button--warning-danger-medium"],
          },
        ],
      })

      type ButtonWithBaseWithoutDefaultsProps =
        | VariantProps<typeof buttonWithBaseWithoutDefaultsString>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsArray>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameArray>

      describe.each<[ButtonWithBaseWithoutDefaultsProps, string]>([
        [undefined as unknown as ButtonWithBaseWithoutDefaultsProps, "button font-semibold border rounded"],
        [{}, "button font-semibold border rounded"],
        [
          {
            // @ts-expect-error
            aCheekyInvalidProp: "lol",
          },
          "button font-semibold border rounded",
        ],
        [{ intent: "secondary" }, "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],

        [{ size: "small" }, "button font-semibold border rounded button--small text-sm py-1 px-2"],
        [{ disabled: false }, "button font-semibold border rounded button--enabled cursor-pointer"],
        [{ disabled: true }, "button font-semibold border rounded button--disabled opacity-050 cursor-not-allowed"],
        [{ intent: "secondary", size: "unset" }, "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],
        [{ intent: "secondary", size: undefined }, "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],
        [
          { intent: "danger", size: "medium" },
          "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium",
        ],
        [
          { intent: "warning", size: "large" },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: "unset" },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: true },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: false },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: "primary",
            class: "adhoc-class",
          } as ButtonWithBaseWithoutDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-class",
        ],
        [
          {
            intent: "primary",
            className: "adhoc-className",
          } as ButtonWithBaseWithoutDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-className",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonWithBaseWithoutDefaultsString(options)).toBe(expected)
          expect(buttonWithBaseWithoutDefaultsWithClassNameString(options)).toBe(expected)
          expect(buttonWithBaseWithoutDefaultsArray(options)).toBe(expected)
          expect(buttonWithBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected)
        })
      })
    })

    describe("with defaults", () => {
      const buttonWithBaseWithDefaultsString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            class: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithBaseWithDefaultsWithClassNameString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            className: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithBaseWithDefaultsArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            class: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: ["button--warning-danger-medium"],
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithBaseWithDefaultsWithClassNameArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            className: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: ["button--warning-danger-medium"],
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })

      type ButtonWithBaseWithDefaultsProps =
        | VariantProps<typeof buttonWithBaseWithDefaultsString>
        | VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithBaseWithDefaultsArray>
        | VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameArray>

      describe.each<[ButtonWithBaseWithDefaultsProps, string]>([
        [
          // @ts-expect-error
          undefined,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          {},
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          {
            aCheekyInvalidProp: "lol",
          } as ButtonWithBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          { intent: "secondary" },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4",
        ],

        [
          { size: "small" },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2",
        ],
        [
          { disabled: "unset" },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          { disabled: false },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          { disabled: true },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          { intent: "secondary", size: "unset" },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer",
        ],
        [
          { intent: "secondary", size: undefined },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4",
        ],
        [
          { intent: "danger", size: "medium" },
          "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium",
        ],
        [
          { intent: "warning", size: "large" },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
        ],
        [
          {
            intent: "warning",
            size: "large",
            disabled: "unset",
          },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: true },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: false },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: "primary",
            class: "adhoc-class",
          } as ButtonWithBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-class",
        ],
        [
          {
            intent: "primary",
            className: "adhoc-classname",
          } as ButtonWithBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-classname",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonWithBaseWithDefaultsString(options)).toBe(expected)
          expect(buttonWithBaseWithDefaultsWithClassNameString(options)).toBe(expected)
          expect(buttonWithBaseWithDefaultsArray(options)).toBe(expected)
          expect(buttonWithBaseWithDefaultsWithClassNameArray(options)).toBe(expected)
        })
      })
    })
  })

  describe("composing classes", () => {
    type BoxProps = VariantProps<typeof box>
    const box = cvax({
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
    const card = ({ margin, padding, shadow }: CardProps = {}) => classic(box({ margin, padding }), cardBase({ shadow }))

    describe.each<[CardProps, string]>([
      [
        // @ts-expect-error
        undefined,
        "box box-border m-0 p-0 card border-solid border-slate-300 rounded",
      ],
      [{}, "box box-border m-0 p-0 card border-solid border-slate-300 rounded"],
      [{ margin: 4 }, "box box-border m-4 p-0 card border-solid border-slate-300 rounded"],
      [{ padding: 4 }, "box box-border m-0 p-4 card border-solid border-slate-300 rounded"],
      [{ margin: 2, padding: 4 }, "box box-border m-2 p-4 card border-solid border-slate-300 rounded"],
      [{ shadow: "md" }, "box box-border m-0 p-0 card border-solid border-slate-300 rounded drop-shadow-md"],
    ])("card(%o)", (options, expected) => {
      it(`returns ${expected}`, () => {
        expect(card(options)).toBe(expected)
      })
    })
  })
})

describe("compose", () => {
  it("should merge into a single component", () => {
    const box = cvax({
      variants: {
        shadow: {
          sm: "shadow-sm",
          md: "shadow-md",
        },
      },
      defaultVariants: {
        shadow: "sm",
      },
    })

    const stack = cvax({
      variants: {
        gap: {
          unset: null,
          1: "gap-1",
          2: "gap-2",
          3: "gap-3",
        },
      },
      defaultVariants: {
        gap: "unset",
      },
    })

    const bg = cvax({
      variants: {
        bg: {
          unset: null,
          red: "bg-red-300 opacity-50 rounded-lg",
          blue: "bg-blue-300 opacity-50 rounded-lg",
          purple: "bg-purple-300 opacity-50 rounded-lg",
        },
      },
      defaultVariants: {
        bg: "unset",
      },
    })

    const card = compose(box, stack, bg)

    expectTypeOf(card).toBeFunction()
    expectTypeOf<VariantProps<typeof card>>().toMatchTypeOf<{
      readonly shadow?: "sm" | "md" | undefined | "unset"
      readonly gap?: "unset" | 1 | 2 | 3 | undefined
      readonly bg?: "unset" | "red" | "blue" | "purple" | undefined
    }>()
    const emptyCardProps = {} satisfies VariantProps<typeof card>
    expect(emptyCardProps).toEqual({})

    expect(card()).toBe("shadow-sm")
    expect(card({ class: "adhoc-class" })).toBe("shadow-sm adhoc-class")
    expect(card({ className: "adhoc-class" })).toBe("shadow-sm adhoc-class")
    expect(card({ shadow: "md" })).toBe("shadow-md")
    expect(card({ gap: 2 })).toBe("shadow-sm gap-2")
    expect(card({ shadow: "md", gap: 3, class: "adhoc-class" })).toBe("shadow-md gap-3 adhoc-class")
    expect(card({ shadow: "md", gap: 3, className: "adhoc-class" })).toBe("shadow-md gap-3 adhoc-class")
    expect(card({ bg: "red", gap: 2 })).toBe("shadow-sm gap-2 bg-red-300 opacity-50 rounded-lg")
  })
})

describe("cvax", () => {
  describe("without base", () => {
    describe("without anything", () => {
      it("empty", () => {
        // @ts-expect-error
        const example = cvax()

        expect(example()).toBe("")
        expect(
          example({
            // @ts-expect-error
            aCheekyInvalidProp: "lol",
          })
        ).toBe("")
        expect(example({ class: "adhoc-class" })).toBe("adhoc-class")
        expect(example({ className: "adhoc-className" })).toBe("adhoc-className")
        expect(
          example({
            class: "adhoc-class",
            // @ts-expect-error
            className: "adhoc-className",
          })
        ).toBe("adhoc-class adhoc-className")
      })

      it("undefined", () => {
        // @ts-expect-error
        const example = cvax(undefined)
        expect(example()).toBe("")
        expect(
          example({
            // @ts-expect-error
            aCheekyInvalidProp: "lol",
          })
        ).toBe("")
        expect(example({ class: "adhoc-class" })).toBe("adhoc-class")
        expect(example({ className: "adhoc-className" })).toBe("adhoc-className")
        expect(
          example({
            class: "adhoc-class",
            // @ts-expect-error
            className: "adhoc-className",
          })
        ).toBe("adhoc-class adhoc-className")
      })

      it("null", () => {
        const example = cvax(
          // @ts-expect-error
          null
        )
        expect(example()).toBe("")
        expect(
          example({
            // @ts-expect-error
            aCheekyInvalidProp: "lol",
          })
        ).toBe("")
        expect(example({ class: "adhoc-class" })).toBe("adhoc-class")
        expect(example({ className: "adhoc-className" })).toBe("adhoc-className")
        expect(
          example({
            class: "adhoc-class",
            // @ts-expect-error
            className: "adhoc-className",
          })
        ).toBe("adhoc-class adhoc-className")
      })
    })

    describe("without defaults", () => {
      const buttonWithoutBaseWithoutDefaultsString = cvax({
        variants: {
          intent: {
            unset: null,
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            unset: null,
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
          m: {
            unset: null,
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            class: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
        ],
      })
      const buttonWithoutBaseWithoutDefaultsWithClassNameString = cvax({
        variants: {
          intent: {
            unset: null,
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            unset: null,
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
          m: {
            unset: null,
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            className: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
        ],
      })

      const buttonWithoutBaseWithoutDefaultsArray = cvax({
        variants: {
          intent: {
            unset: null,
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            unset: null,
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
          m: {
            unset: null,
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            class: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
        ],
      })
      const buttonWithoutBaseWithoutDefaultsWithClassNameArray = cvax({
        variants: {
          intent: {
            unset: null,
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            unset: null,
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
          m: {
            unset: null,
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            className: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
        ],
      })

      type ButtonWithoutDefaultsWithoutBaseProps =
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsString>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsArray>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameArray>

      describe.each<[ButtonWithoutDefaultsWithoutBaseProps, string]>([
        [
          // @ts-expect-error
          undefined,
          "",
        ],
        [{}, ""],
        [
          {
            aCheekyInvalidProp: "lol",
          } as ButtonWithoutDefaultsWithoutBaseProps,
          "",
        ],
        [{ intent: "secondary" }, "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],
        [{ size: "small" }, "button--small text-sm py-1 px-2"],
        [{ disabled: true }, "button--disabled opacity-050 cursor-not-allowed"],
        [
          {
            intent: "secondary",
            size: "unset",
          },
          "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
        ],
        [{ intent: "secondary", size: undefined }, "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],
        [{ intent: "danger", size: "medium" }, "button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4"],
        [{ intent: "warning", size: "large" }, "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4"],
        [
          { intent: "warning", size: "large", disabled: true },
          "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black",
        ],
        [{ intent: "primary", m: 0 }, "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-0"],
        [{ intent: "primary", m: 1 }, "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1"],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: "primary",
            m: 1,
            class: "adhoc-class",
          } as ButtonWithoutDefaultsWithoutBaseProps,
          "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-class",
        ],
        [
          {
            intent: "primary",
            m: 1,
            className: "adhoc-classname",
          } as ButtonWithoutDefaultsWithoutBaseProps,
          "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-classname",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonWithoutBaseWithoutDefaultsString(options)).toBe(expected)
          expect(buttonWithoutBaseWithoutDefaultsWithClassNameString(options)).toBe(expected)
          expect(buttonWithoutBaseWithoutDefaultsArray(options)).toBe(expected)
          expect(buttonWithoutBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected)
        })
      })
    })

    describe("with defaults", () => {
      const buttonWithoutBaseWithDefaultsString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            unset: null,
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            unset: null,
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
          m: {
            unset: null,
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            class: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithoutBaseWithDefaultsWithClassNameString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            unset: null,
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            unset: null,
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
          m: {
            unset: null,
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            className: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })

      const buttonWithoutBaseWithDefaultsArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            unset: null,
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            unset: null,
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
          m: {
            unset: null,
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            class: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: ["button--warning-danger-medium"],
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithoutBaseWithDefaultsWithClassNameArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            unset: null,
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            unset: null,
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
          m: {
            unset: null,
            0: "m-0",
            1: "m-1",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            className: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })

      type ButtonWithoutBaseWithDefaultsProps =
        | VariantProps<typeof buttonWithoutBaseWithDefaultsString>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsArray>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameArray>

      describe.each<[ButtonWithoutBaseWithDefaultsProps, string]>([
        [
          // @ts-expect-error
          undefined,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          {},
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          {
            aCheekyInvalidProp: "lol",
          } as ButtonWithoutBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          { intent: "secondary" },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0",
        ],

        [
          { size: "small" },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2 m-0",
        ],
        [
          { disabled: true },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          {
            intent: "secondary",
            size: "unset",
          },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer m-0",
        ],
        [
          { intent: "secondary", size: undefined },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0",
        ],
        [
          { intent: "danger", size: "medium" },
          "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--warning-danger !border-red-500 button--warning-danger-medium",
        ],
        [
          { intent: "warning", size: "large" },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-0 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: true },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 m-0 button--warning-disabled text-black button--warning-danger !border-red-500",
        ],
        [
          { intent: "primary", m: 0 },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
        ],
        [
          { intent: "primary", m: 1 },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase",
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: "primary",
            m: 0,
            class: "adhoc-class",
          } as ButtonWithoutBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase adhoc-class",
        ],
        [
          {
            intent: "primary",
            m: 1,
            className: "adhoc-classname",
          } as ButtonWithoutBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase adhoc-classname",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonWithoutBaseWithDefaultsString(options)).toBe(expected)
          expect(buttonWithoutBaseWithDefaultsWithClassNameString(options)).toBe(expected)
          expect(buttonWithoutBaseWithDefaultsArray(options)).toBe(expected)
          expect(buttonWithoutBaseWithDefaultsWithClassNameArray(options)).toBe(expected)
        })
      })
    })
  })

  describe("with base", () => {
    describe("without defaults", () => {
      const buttonWithBaseWithoutDefaultsString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            unset: null,
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            unset: null,
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            class: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: "button--warning-danger-medium",
          },
        ],
      })
      const buttonWithBaseWithoutDefaultsWithClassNameString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            unset: null,
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            unset: null,
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            className: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: "button--warning-danger-medium",
          },
        ],
      })

      const buttonWithBaseWithoutDefaultsArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            unset: null,
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            unset: null,
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            class: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: ["button--warning-danger-medium"],
          },
        ],
      })
      const buttonWithBaseWithoutDefaultsWithClassNameArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            unset: null,
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            unset: null,
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            className: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: ["button--warning-danger-medium"],
          },
        ],
      })

      type ButtonWithBaseWithoutDefaultsProps =
        | VariantProps<typeof buttonWithBaseWithoutDefaultsString>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsArray>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameArray>

      describe.each<[ButtonWithBaseWithoutDefaultsProps, string]>([
        [undefined as unknown as ButtonWithBaseWithoutDefaultsProps, "button font-semibold border rounded"],
        [{}, "button font-semibold border rounded"],
        [
          {
            // @ts-expect-error
            aCheekyInvalidProp: "lol",
          },
          "button font-semibold border rounded",
        ],
        [{ intent: "secondary" }, "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],

        [{ size: "small" }, "button font-semibold border rounded button--small text-sm py-1 px-2"],
        [{ disabled: false }, "button font-semibold border rounded button--enabled cursor-pointer"],
        [{ disabled: true }, "button font-semibold border rounded button--disabled opacity-050 cursor-not-allowed"],
        [{ intent: "secondary", size: "unset" }, "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],
        [{ intent: "secondary", size: undefined }, "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100"],
        [
          { intent: "danger", size: "medium" },
          "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium",
        ],
        [
          { intent: "warning", size: "large" },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: "unset" },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: true },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: false },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: "primary",
            class: "adhoc-class",
          } as ButtonWithBaseWithoutDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-class",
        ],
        [
          {
            intent: "primary",
            className: "adhoc-className",
          } as ButtonWithBaseWithoutDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-className",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonWithBaseWithoutDefaultsString(options)).toBe(expected)
          expect(buttonWithBaseWithoutDefaultsWithClassNameString(options)).toBe(expected)
          expect(buttonWithBaseWithoutDefaultsArray(options)).toBe(expected)
          expect(buttonWithBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected)
        })
      })
    })

    describe("with defaults", () => {
      const buttonWithBaseWithDefaultsString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            unset: null,
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            unset: null,
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            class: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithBaseWithDefaultsWithClassNameString = cvax({
        base: "button font-semibold border rounded",
        variants: {
          intent: {
            unset: null,
            primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
            warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: "button--disabled opacity-050 cursor-not-allowed",
            false: "button--enabled cursor-pointer",
          },
          size: {
            unset: null,
            small: "button--small text-sm py-1 px-2",
            medium: "button--medium text-base py-2 px-4",
            large: "button--large text-lg py-2.5 px-4",
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: "button--primary-medium uppercase",
          },
          {
            intent: "warning",
            disabled: false,
            className: "button--warning-enabled text-gray-800",
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: "button--warning-danger !border-red-500",
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: "button--warning-danger-medium",
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })

      const buttonWithBaseWithDefaultsArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            unset: null,
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            unset: null,
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            class: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            class: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            class: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            class: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            class: ["button--warning-danger-medium"],
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })
      const buttonWithBaseWithDefaultsWithClassNameArray = cvax({
        base: ["button", "font-semibold", "border", "rounded"],
        variants: {
          intent: {
            unset: null,
            primary: ["button--primary", "bg-blue-500", "text-white", "border-transparent", "hover:bg-blue-600"],
            secondary: ["button--secondary", "bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
            warning: ["button--warning", "bg-yellow-500", "border-transparent", "hover:bg-yellow-600"],
            danger: ["button--danger", [1 && "bg-red-500", { baz: false, bat: null }, ["text-white", ["border-transparent"]]], "hover:bg-red-600"],
          },
          disabled: {
            unset: null,
            true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
            false: ["button--enabled", "cursor-pointer"],
          },
          size: {
            unset: null,
            small: ["button--small", "text-sm", "py-1", "px-2"],
            medium: ["button--medium", "text-base", "py-2", "px-4"],
            large: ["button--large", "text-lg", "py-2.5", "px-4"],
          },
        },
        compoundVariants: [
          {
            intent: "primary",
            size: "medium",
            className: ["button--primary-medium", "uppercase"],
          },
          {
            intent: "warning",
            disabled: false,
            className: ["button--warning-enabled", "text-gray-800"],
          },
          {
            intent: "warning",
            disabled: true,
            className: ["button--warning-disabled", [1 && "text-black", { baz: false, bat: null }]],
          },
          {
            intent: ["warning", "danger"],
            className: ["button--warning-danger", "!border-red-500"],
          },
          {
            intent: ["warning", "danger"],
            size: "medium",
            className: ["button--warning-danger-medium"],
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: "primary",
          size: "medium",
        },
      })

      type ButtonWithBaseWithDefaultsProps =
        | VariantProps<typeof buttonWithBaseWithDefaultsString>
        | VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithBaseWithDefaultsArray>
        | VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameArray>

      describe.each<[ButtonWithBaseWithDefaultsProps, string]>([
        [
          // @ts-expect-error
          undefined,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          {},
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          {
            aCheekyInvalidProp: "lol",
          } as ButtonWithBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          { intent: "secondary" },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4",
        ],

        [
          { size: "small" },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2",
        ],
        [
          { disabled: "unset" },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          { disabled: false },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          { disabled: true },
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 button--primary-medium uppercase",
        ],
        [
          { intent: "secondary", size: "unset" },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer",
        ],
        [
          { intent: "secondary", size: undefined },
          "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4",
        ],
        [
          { intent: "danger", size: "medium" },
          "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium",
        ],
        [
          { intent: "warning", size: "large" },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
        ],
        [
          {
            intent: "warning",
            size: "large",
            disabled: "unset",
          },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: true },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500",
        ],
        [
          { intent: "warning", size: "large", disabled: false },
          "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: "primary",
            class: "adhoc-class",
          } as ButtonWithBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-class",
        ],
        [
          {
            intent: "primary",
            className: "adhoc-classname",
          } as ButtonWithBaseWithDefaultsProps,
          "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-classname",
        ],
      ])("button(%o)", (options, expected) => {
        it(`returns ${expected}`, () => {
          expect(buttonWithBaseWithDefaultsString(options)).toBe(expected)
          expect(buttonWithBaseWithDefaultsWithClassNameString(options)).toBe(expected)
          expect(buttonWithBaseWithDefaultsArray(options)).toBe(expected)
          expect(buttonWithBaseWithDefaultsWithClassNameArray(options)).toBe(expected)
        })
      })
    })
  })
})

describe("cvaxify", () => {
  describe("hooks", () => {
    describe("onComplete", () => {
      const prefix = "never-gonna-give-you-up"
      const suffix = "never-gonna-let-you-down"

      const onCompleteHandler = (className: string) => [prefix, className, suffix].join(" ")

      it("should extend compose", () => {
        const { compose: composeExtended } = cvaxify({
          hooks: {
            onComplete: onCompleteHandler,
          },
        })

        const box = cvax({
          variants: {
            shadow: {
              sm: "shadow-sm",
              md: "shadow-md",
            },
          },
          defaultVariants: {
            shadow: "sm",
          },
        })
        const stack = cvax({
          variants: {
            gap: {
              unset: null,
              1: "gap-1",
              2: "gap-2",
              3: "gap-3",
            },
          },
          defaultVariants: {
            gap: "unset",
          },
        })
        const card = composeExtended(box, stack)

        expectTypeOf(card).toBeFunction()

        const cardClassList = card()
        const cardClassListSplit = cardClassList.split(" ")
        expect(cardClassListSplit[0]).toBe(prefix)
        expect(cardClassListSplit[cardClassListSplit.length - 1]).toBe(suffix)

        const cardShadowGapClassList = card({ shadow: "md", gap: 3 })
        const cardShadowGapClassListSplit = cardShadowGapClassList.split(" ")
        expect(cardShadowGapClassListSplit[0]).toBe(prefix)
        expect(cardShadowGapClassListSplit[cardShadowGapClassListSplit.length - 1]).toBe(suffix)
      })

      it("should extend cvax", () => {
        const { cvax: cvaxExtended } = cvaxify({
          hooks: {
            onComplete: onCompleteHandler,
          },
        })

        const component = cvaxExtended({
          base: "foo",
          variants: { intent: { primary: "bar" } },
        })
        const componentClassList = component({ intent: "primary" })
        const componentClassListSplit = componentClassList.split(" ")

        expectTypeOf(component).toBeFunction()
        expect(componentClassListSplit[0]).toBe(prefix)
        expect(componentClassListSplit[componentClassListSplit.length - 1]).toBe(suffix)
      })

      it("should extend cx", () => {
        const { cx: cxExtended } = cvaxify({
          hooks: {
            onComplete: onCompleteHandler,
          },
        })

        const classList = cxExtended("foo", "bar")
        const classListSplit = classList.split(" ")

        expectTypeOf(classList).toBeString()
        expect(classListSplit[0]).toBe(prefix)
        expect(classListSplit[classListSplit.length - 1]).toBe(suffix)
      })
    })
  })
})
