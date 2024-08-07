import type * as Cvax from "./"
import { compose, cvax, cvaxify } from "./"
import { describe, it, expect, expectTypeOf } from "vitest"
import { cx } from "./"

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
        base: null,
        // @ts-expect-error

        variants: null,
        // @ts-expect-error

        compoundVariants: null,
        // @ts-expect-error

        defaultVariants: null,
      })

      type ButtonWithoutDefaultsWithoutBaseProps =
        | Cvax.VariantProps<typeof buttonOnlyBase>
        | Cvax.VariantProps<typeof buttonOnlyVariants>
        | Cvax.VariantProps<typeof buttonOnlyCompoundVariants>
        | Cvax.VariantProps<typeof buttonOnlyDefaultVariants>
        | Cvax.VariantProps<typeof buttonAllEmptyObjects>
        | Cvax.VariantProps<typeof buttonOnlyBaseNull>

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
        | Cvax.VariantProps<typeof buttonWithoutBaseWithoutDefaultsString>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameString>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithoutDefaultsArray>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameArray>

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
        // typings needed
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
        | Cvax.VariantProps<typeof buttonWithoutBaseWithDefaultsString>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameString>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithDefaultsArray>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameArray>

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
        | Cvax.VariantProps<typeof buttonWithBaseWithoutDefaultsString>
        | Cvax.VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameString>
        | Cvax.VariantProps<typeof buttonWithBaseWithoutDefaultsArray>
        | Cvax.VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameArray>

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
        | Cvax.VariantProps<typeof buttonWithBaseWithDefaultsString>
        | Cvax.VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameString>
        | Cvax.VariantProps<typeof buttonWithBaseWithDefaultsArray>
        | Cvax.VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameArray>

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
    type BoxProps = Cvax.VariantProps<typeof box>
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

    type CardBaseProps = Cvax.VariantProps<typeof cardBase>
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
    const card = ({ margin, padding, shadow }: CardProps = {}) => cx(box({ margin, padding }), cardBase({ shadow }))

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
    expectTypeOf(card).parameter(0).toMatchTypeOf<
      | {
          shadow?: "sm" | "md" | undefined | "unset"
          gap?: "unset" | 1 | 2 | 3 | undefined
          bg?: "unset" | "red" | "blue" | "purple" | undefined
        }
      | undefined
    >()

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

// Clean up stuff
// Write tests for class and className cases
it("keeps object keys with truthy values", () => {
  expect(
    cx({
      one: true,
      two: false,
      three: 0,
      four: null,
      five: undefined,
      six: 1,
    })
  ).toBe("one six")
})

it("joins arrays of class names and ignore falsy values", () => {
  expect(cx("one", 0, null, undefined, true, 1, "seven")).toBe("one 1 seven")
})

it("handles arrays that include falsy and true values", () => {
  expect(cx(["one", 0, null, undefined, false, true, "seven"])).toBe("one seven")
})

it("supports heterogenous arguments", () => {
  expect(
    cx({ one: true }, "two", 0, false, "five", [[{ six: true }]], {
      className: [{ seven: false }, [[{ eight: true }]]],
    })
  ).toBe("one two five six eight")
})

it("should be trimmed", () => {
  expect(cx("", "                   two             three            ", { four: true, "                five              ": true }, "").replace(/\s+/g, " ")).toBe("two three four five")
})

it("returns an empty string for an empty configuration", () => {
  expect(cx({})).toBe("")
})

it("supports an array of class names", () => {
  expect(cx(["one", "two"])).toBe("one two")
})

it("joins array arguments with string arguments", () => {
  expect(cx(["one", "two"], "three")).toBe("one two three")
  expect(cx("three", ["one", "two"])).toBe("three one two")
})

it("handles multiple array arguments", () => {
  expect(cx(["one", "two"], ["three", "four"])).toBe("one two three four")
})

it("handles arrays that include arrays", () => {
  expect(cx(["one", ["two", "three"]])).toBe("one two three")
})

it("handles arrays that include objects", () => {
  expect(cx(["one", { two: true, three: false }])).toBe("one two")
})

it("handles deep array recursion", () => {
  expect(cx(["one", ["two", ["three", { four: true }]]])).toBe("one two three four")
})

it("handles arrays that are empty", () => {
  expect(cx("one", [])).toBe("one")
})

it("handles nested arrays with nested arrays", () => {
  expect(cx([[[[[[[[], [], [[], [[]]], [[[[[[[[[[[["one"]]]]]]]]]]]]]]]]]]])).toBe("one")
})

it("handles nested arrays that have empty nested arrays", () => {
  expect(
    cx([
      "one",
      [
        [
          [[[[[{}, {}]], {}, null]], { two: false }],
          // @ts-expect-error
          { three: () => {} },
        ],
      ],
    ])
  ).toBe("one three")
})

it("handles all types of truthy and falsy property values as expected", () => {
  // @ts-expect-error
  const res = cx({
    // These ARE causing TypeScript errors:
    function: Object.prototype.toString,
    emptyObject: {},

    // falsy:
    null: null,
    emptyString: "",
    noNumber: Number.NaN,
    zero: 0,
    negativeZero: -0,
    false: false,
    undefined: undefined,

    // truthy
    nonEmptyString: "foobar",
    whitespace: " ",
    nonEmptyObject: { a: 1, b: 2 },
    emptyList: [],
    nonEmptyList: [1, 2, 3],
    greaterZero: 1,
  })

  expect(res).toBe("function emptyObject nonEmptyString whitespace nonEmptyObject emptyList nonEmptyList greaterZero")
})

it("handles all types of truthy and falsy property values as expected", () => {
  const className = {
    "one two three": true,
    "four five": false,

    class: ["six", "seven", false, true ?? true, true ?? 0, false ?? null, { className: "nine" }],
  }

  const res = cx({
    className,
    class: ["ten", ["eleven", ["twelve", { thirteen: true }]]],
  })

  expect(res.replace(/\s+/g, " ")).toBe("one two three six seven nine ten eleven twelve thirteen")
})

describe("cx", () => {
  describe.each<Cvax.ClassValue>([
    [null, ""],
    [undefined, ""],
    [["foo", null, "bar", undefined, "baz"], "foo bar baz"],
    [["foo", [null, ["bar"], [undefined, ["baz", "qux", "quux", "quuz", [[[[[[[[["corge", "grault"]]]]], "garply"]]]]]]]], "foo bar baz qux quux quuz corge grault garply"],
    [["foo", [1 && "bar", { baz: false, bat: null }, ["hello", ["world"]]], "cya"], "foo bar hello world cya"],
  ])("cx(%o)", (options, expected) => {
    it(`returns ${expected}`, () => {
      expect(cx(options)).toBe(expected)
    })
  })
})

it("strings", () => {
  expect(cx("")).toBe("")
  expect(cx("foo")).toBe("foo")
  expect(cx("foo")).toBe("foo")
  expect(cx(false)).toBe("")
})

it("strings (variadic)", () => {
  expect(cx("")).toBe("")
  expect(cx("foo", "bar")).toBe("foo bar")
  expect(cx("foo", false, "baz")).toBe("foo baz")
  expect(cx(false, "bar", "baz", "")).toBe("bar baz")
})

it("objects", () => {
  expect(cx({}), "")
  expect(cx({ foo: true }), "foo")
  expect(cx({ foo: true, bar: false }), "foo")
  expect(cx({ foo: "hiya", bar: 1 }), "foo bar")
  expect(cx({ foo: 1, bar: 0, baz: 1 }), "foo baz")
  expect(cx({ "-foo": 1, "--bar": 1 }), "-foo --bar")
})

it("objects (variadic)", () => {
  expect(cx({}, {})).toBe("")
  expect(cx({ foo: 1 }, { bar: 2 })).toBe("foo bar")
  expect(cx({ foo: 1 }, null, { baz: 1, bat: 0 })).toBe("foo baz")
  expect(cx({ foo: 1 }, {}, {}, { bar: "a" }, { baz: null, bat: Number.POSITIVE_INFINITY })).toBe("foo bar bat")
})

it("arrays", () => {
  expect(cx([])).toBe("")
  expect(cx(["foo"])).toBe("foo")
  expect(cx(["foo", "bar"])).toBe("foo bar")
  expect(cx(["foo", 0 && "bar", 1 && "baz"])).toBe("foo baz")
})

it("arrays (nested)", () => {
  expect(cx([[[]]])).toBe("")
  expect(cx([[["foo"]]])).toBe("foo")
  expect(cx([true, [["foo"]]])).toBe("foo")
  expect(cx(["foo", ["bar", ["", [["baz"]]]]])).toBe("foo bar baz")
})

it("arrays (variadic)", () => {
  expect(cx([], [])).toBe("")
  expect(cx(["foo"], ["bar"])).toBe("foo bar")
  expect(cx(["foo"], null, ["baz", ""], true, "", [])).toBe("foo baz")
})

it("arrays (no `push` escape)", () => {
  expect(cx({ push: 1 })).toBe("push")
  expect(cx({ pop: true })).toBe("pop")
  expect(cx({ push: true })).toBe("push")
  expect(cx("hello", { world: 1, push: true })).toBe("hello world push")
})

it("functions", () => {
  const foo = () => {}
  // @ts-expect-error
  expect(cx(foo, "hello")).toBe("hello")
  // @ts-expect-error
  expect(cx(foo, "hello", cx)).toBe("hello")
  // @ts-expect-error
  expect(cx(foo, "hello", [[cx], "world"])).toBe("hello world")
})

describe("cx", () => {
  describe.each<Parameters<typeof cx>>([
    [{ class: "asdfasdf" }, "asdfasdf"],
    [{ className: "asdfasdf" }, "asdfasdf"],
    [null, ""],
    [undefined, ""],
    [false, ""],
    ["foo", "foo"],
    [["foo", undefined, "bar", undefined, "baz"], "foo bar baz"],
    [
      ["foo", [undefined, ["bar"], [undefined, ["baz", "qux", "quux", "quuz", [[[[[[[[["corge", "grault"]]]]], "garply"]]]]]]]],
      "foo bar baz qux quux quuz corge grault garply",
      [["foo", [1 && "bar", { baz: false, bat: null }, ["hello", ["world"]]], "cya"], "foo bar hello world cya"],
    ],
  ])("cx(%o)", (options, expected) => {
    it(`returns ${expected}`, () => {
      expect(cx(options)).toBe(expected)
    })
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
        | Cvax.VariantProps<typeof buttonWithoutBaseWithoutDefaultsString>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameString>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithoutDefaultsArray>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameArray>

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
        // typings needed
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
        | Cvax.VariantProps<typeof buttonWithoutBaseWithDefaultsString>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameString>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithDefaultsArray>
        | Cvax.VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameArray>

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
        | Cvax.VariantProps<typeof buttonWithBaseWithoutDefaultsString>
        | Cvax.VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameString>
        | Cvax.VariantProps<typeof buttonWithBaseWithoutDefaultsArray>
        | Cvax.VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameArray>

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
        | Cvax.VariantProps<typeof buttonWithBaseWithDefaultsString>
        | Cvax.VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameString>
        | Cvax.VariantProps<typeof buttonWithBaseWithDefaultsArray>
        | Cvax.VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameArray>

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
