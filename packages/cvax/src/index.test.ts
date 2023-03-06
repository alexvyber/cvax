// import type * as CVA from "./"
// import type { CxOptions } from "./types"
// import { cvax, cx } from "./"

// import { describe, it as test, expect } from "vitest"

// describe("cx", () => {
//   describe.each<CxOptions>([
//     [null, ""],
//     [undefined, ""],
//     [["foo", null, "bar", undefined, "baz"], "foo bar baz"],
//     [
//       [
//         "foo",
//         [
//           null,
//           ["bar"],
//           [
//             undefined,
//             ["baz", "qux", "quux", "quuz", [[[[[[[[["corge", "grault"]]]]], "garply"]]]]],
//           ],
//         ],
//       ],
//       "foo bar baz qux quux quuz corge grault garply",
//     ],
//   ])("cx(%o)", (options, expected) => {
//     test(`returns ${expected}`, () => {
//       expect(cx(options)).toBe(expected)
//     })
//   })
// })

// describe("cvax", () => {
//   describe("without base", () => {
//     describe("without anything", () => {
//       test("empty", () => {
//         const example = cvax()

//         expect(example()).toBe("")

//         expect(
//           example({
//             // @ts-expect-error
//             aCheekyInvalidProp: "lol",
//           }),
//         ).toBe("")

//         expect(example({ className: "adhoc-className" })).toBe("adhoc-className")

//         expect(
//           example({
//             className: "adhoc-className",
//           }),
//         ).toBe("adhoc-className")
//       })

//       test("undefined", () => {
//         const example = cvax(undefined)

//         expect(example()).toBe("")

//         expect(
//           example({
//             // @ts-expect-error
//             aCheekyInvalidProp: "lol",
//           }),
//         ).toBe("")

//         expect(example({ className: "adhoc-className" })).toBe("adhoc-className")

//         expect(
//           example({
//             className: "adhoc-className",
//           }),
//         ).toBe("adhoc-className")
//       })

//       test("null", () => {
//         const example = cvax(null)

//         expect(example()).toBe("")

//         expect(
//           example({
//             // @ts-expect-error
//             aCheekyInvalidProp: "lol",
//           }),
//         ).toBe("")

//         expect(example({ className: "adhoc-className" })).toBe("adhoc-className")
//       })
//     })

//     describe("without defaults", () => {
//       const buttonWithoutBaseWithoutDefaultsWithClassNameString = cvax(null, {
//         variants: {
//           intent: {
//             primary: "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
//             secondary: "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//             warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
//             danger: "button--danger bg-red-500 text-white border-transparent hover:bg-red-600",
//           },
//           disabled: {
//             true: "button--disabled opacity-050 cursor-not-allowed",
//             false: "button--enabled cursor-pointer",
//           },
//           size: {
//             small: "button--small text-sm py-1 px-2",
//             medium: "button--medium text-base py-2 px-4",
//             large: "button--large text-lg py-2.5 px-4",
//           },
//           m: {
//             0: "m-0",
//             1: "m-1",
//           },
//         },
//         compoundVariants: [
//           {
//             intent: "primary",
//             size: "medium",
//             className: "button--primary-medium uppercase",
//           },
//           {
//             intent: "warning",
//             disabled: false,
//             className: "button--warning-enabled text-gray-800",
//           },
//           {
//             intent: "warning",
//             disabled: true,
//             className: "button--warning-disabled text-black",
//           },
//         ],
//       })

//       const buttonWithoutBaseWithoutDefaultsWithClassNameArray = cvax(null, {
//         variants: {
//           intent: {
//             primary: [
//               "button--primary",
//               "bg-blue-500",
//               "text-white",
//               "border-transparent",
//               "hover:bg-blue-600",
//             ],
//             secondary: [
//               "button--secondary",
//               "bg-white",
//               "text-gray-800",
//               "border-gray-400",
//               "hover:bg-gray-100",
//             ],
//             warning: [
//               "button--warning",
//               "bg-yellow-500",
//               "border-transparent",
//               "hover:bg-yellow-600",
//             ],
//             danger: [
//               "button--danger",
//               "bg-red-500",
//               "text-white",
//               "border-transparent",
//               "hover:bg-red-600",
//             ],
//           },
//           disabled: {
//             true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
//             false: ["button--enabled", "cursor-pointer"],
//           },
//           size: {
//             small: ["button--small", "text-sm", "py-1", "px-2"],
//             medium: ["button--medium", "text-base", "py-2", "px-4"],
//             large: ["button--large", "text-lg", "py-2.5", "px-4"],
//           },
//           m: {
//             0: "m-0",
//             1: "m-1",
//           },
//         },
//         compoundVariants: [
//           {
//             intent: "primary",
//             size: "medium",
//             className: ["button--primary-medium", "uppercase"],
//           },
//           {
//             intent: "warning",
//             disabled: false,
//             className: ["button--warning-enabled", "text-gray-800"],
//           },
//           {
//             intent: "warning",
//             disabled: true,
//             className: ["button--warning-disabled", "text-black"],
//           },
//         ],
//       })

//       type ButtonWithoutDefaultsWithoutBaseProps =
//         | CVA.VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameString>
//         | CVA.VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameArray>

//       describe.each<[ButtonWithoutDefaultsWithoutBaseProps, string]>([
//         [
//           // @ts-expect-error
//           undefined,
//           "",
//         ],
//         [{}, ""],
//         [
//           {
//             aCheekyInvalidProp: "lol",
//           } as ButtonWithoutDefaultsWithoutBaseProps,
//           "",
//         ],
//         [
//           { intent: "secondary" },
//           "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//         ],
//         [{ size: "small" }, "button--small text-sm py-1 px-2"],
//         [{ disabled: true }, "button--disabled opacity-050 cursor-not-allowed"],
//         [
//           {
//             intent: "secondary",
//             size: null,
//           },
//           "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//         ],
//         [
//           { intent: "secondary", size: undefined },
//           "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//         ],
//         [
//           { intent: "danger", size: "medium" },
//           "button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4",
//         ],
//         [
//           { intent: "warning", size: "large" },
//           "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4",
//         ],
//         [
//           { intent: "warning", size: "large", disabled: true },
//           "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black",
//         ],
//         [
//           { intent: "primary", m: 0 },
//           "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-0",
//         ],
//         [
//           { intent: "primary", m: 1 },
//           "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1",
//         ],
//         // !@TODO Add type "extractor" including class prop
//         [
//           {
//             intent: "primary",
//             m: 1,
//             className: "adhoc-classname",
//           } as ButtonWithoutDefaultsWithoutBaseProps,
//           "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-classname",
//         ],
//         // typings needed
//       ])("button(%o)", (options, expected) => {
//         test(`returns ${expected}`, () => {
//           expect(buttonWithoutBaseWithoutDefaultsWithClassNameString(options)).toBe(expected)
//           expect(buttonWithoutBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected)
//         })
//       })
//     })

//     describe("with defaults", () => {
//       const buttonWithoutBaseWithDefaultsWithClassNameString = cvax(
//         "button font-semibold border rounded",
//         {
//           variants: {
//             intent: {
//               primary:
//                 "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
//               secondary:
//                 "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//               warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
//               danger: "button--danger bg-red-500 text-white border-transparent hover:bg-red-600",
//             },
//             disabled: {
//               true: "button--disabled opacity-050 cursor-not-allowed",
//               false: "button--enabled cursor-pointer",
//             },
//             size: {
//               small: "button--small text-sm py-1 px-2",
//               medium: "button--medium text-base py-2 px-4",
//               large: "button--large text-lg py-2.5 px-4",
//             },
//             m: {
//               0: "m-0",
//               1: "m-1",
//             },
//           },
//           compoundVariants: [
//             {
//               intent: "primary",
//               size: "medium",
//               className: "button--primary-medium uppercase",
//             },
//             {
//               intent: "warning",
//               disabled: false,
//               className: "button--warning-enabled text-gray-800",
//             },
//             {
//               intent: "warning",
//               disabled: true,
//               className: "button--warning-disabled text-black",
//             },
//             {
//               intent: ["warning", "danger"],
//               className: "button--warning-danger !border-red-500",
//             },
//             {
//               intent: ["warning", "danger"],
//               size: "medium",
//               className: "button--warning-danger-medium",
//             },
//           ],
//           defaultVariants: {
//             m: 0,
//             disabled: false,
//             intent: "primary",
//             size: "medium",
//           },
//         },
//       )

//       const buttonWithoutBaseWithDefaultsWithClassNameArray = cvax(
//         ["button", "font-semibold", "border", "rounded"],
//         {
//           variants: {
//             intent: {
//               primary: [
//                 "button--primary",
//                 "bg-blue-500",
//                 "text-white",
//                 "border-transparent",
//                 "hover:bg-blue-600",
//               ],
//               secondary: [
//                 "button--secondary",
//                 "bg-white",
//                 "text-gray-800",
//                 "border-gray-400",
//                 "hover:bg-gray-100",
//               ],
//               warning: [
//                 "button--warning",
//                 "bg-yellow-500",
//                 "border-transparent",
//                 "hover:bg-yellow-600",
//               ],
//               danger: [
//                 "button--danger",
//                 "bg-red-500",
//                 "text-white",
//                 "border-transparent",
//                 "hover:bg-red-600",
//               ],
//             },
//             disabled: {
//               true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
//               false: ["button--enabled", "cursor-pointer"],
//             },
//             size: {
//               small: ["button--small", "text-sm", "py-1", "px-2"],
//               medium: ["button--medium", "text-base", "py-2", "px-4"],
//               large: ["button--large", "text-lg", "py-2.5", "px-4"],
//             },
//             m: {
//               0: "m-0",
//               1: "m-1",
//             },
//           },
//           compoundVariants: [
//             {
//               intent: "primary",
//               size: "medium",
//               className: ["button--primary-medium", "uppercase"],
//             },
//             {
//               intent: "warning",
//               disabled: false,
//               className: ["button--warning-enabled", "text-gray-800"],
//             },
//             {
//               intent: "warning",
//               disabled: true,
//               className: ["button--warning-disabled", "text-black"],
//             },
//             {
//               intent: ["warning", "danger"],
//               className: "button--warning-danger !border-red-500",
//             },
//             {
//               intent: ["warning", "danger"],
//               size: "medium",
//               className: "button--warning-danger-medium",
//             },
//           ],
//           defaultVariants: {
//             m: 0,
//             disabled: false,
//             intent: "primary",
//             size: "medium",
//           },
//         },
//       )

//       type ButtonWithoutBaseWithDefaultsProps =
//         | CVA.VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameString>
//         | CVA.VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameArray>

//       describe.each<[ButtonWithoutBaseWithDefaultsProps, string]>([
//         [
//           // @ts-expect-error
//           undefined,
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
//         ],
//         [
//           {},
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
//         ],
//         [
//           {
//             aCheekyInvalidProp: "lol",
//           } as ButtonWithoutBaseWithDefaultsProps,
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
//         ],
//         [
//           { intent: "secondary" },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0",
//         ],

//         [
//           { size: "small" },
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2 m-0",
//         ],
//         [
//           { disabled: true },
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
//         ],
//         [
//           {
//             intent: "secondary",
//             size: null,
//           },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer m-0",
//         ],
//         [
//           { intent: "secondary", size: undefined },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0",
//         ],
//         [
//           { intent: "danger", size: "medium" },
//           "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--warning-danger !border-red-500 button--warning-danger-medium",
//         ],
//         [
//           { intent: "warning", size: "large" },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-0 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
//         ],
//         [
//           { intent: "warning", size: "large", disabled: true },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 m-0 button--warning-disabled text-black button--warning-danger !border-red-500",
//         ],
//         [
//           { intent: "primary", m: 0 },
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase",
//         ],
//         [
//           { intent: "primary", m: 1 },
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase",
//         ],
//         // !@TODO Add type "extractor" including class prop

//         [
//           {
//             intent: "primary",
//             m: 1,
//             className: "adhoc-classname",
//           } as ButtonWithoutBaseWithDefaultsProps,
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase adhoc-classname",
//         ],
//       ])("button(%o)", (options, expected) => {
//         test(`returns ${expected}`, () => {
//           expect(buttonWithoutBaseWithDefaultsWithClassNameString(options)).toBe(expected)
//           expect(buttonWithoutBaseWithDefaultsWithClassNameArray(options)).toBe(expected)
//         })
//       })
//     })
//   })

//   describe("with base", () => {
//     describe("without defaults", () => {
//       const buttonWithBaseWithoutDefaultsWithClassNameString = cvax(
//         "button font-semibold border rounded",
//         {
//           variants: {
//             intent: {
//               primary:
//                 "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
//               secondary:
//                 "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//               warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
//               danger: "button--danger bg-red-500 text-white border-transparent hover:bg-red-600",
//             },
//             disabled: {
//               true: "button--disabled opacity-050 cursor-not-allowed",
//               false: "button--enabled cursor-pointer",
//             },
//             size: {
//               small: "button--small text-sm py-1 px-2",
//               medium: "button--medium text-base py-2 px-4",
//               large: "button--large text-lg py-2.5 px-4",
//             },
//           },
//           compoundVariants: [
//             {
//               intent: "primary",
//               size: "medium",
//               className: "button--primary-medium uppercase",
//             },
//             {
//               intent: "warning",
//               disabled: false,
//               className: "button--warning-enabled text-gray-800",
//             },
//             {
//               intent: "warning",
//               disabled: true,
//               className: "button--warning-disabled text-black",
//             },
//             {
//               intent: ["warning", "danger"],
//               className: "button--warning-danger !border-red-500",
//             },
//             {
//               intent: ["warning", "danger"],
//               size: "medium",
//               className: "button--warning-danger-medium",
//             },
//           ],
//         },
//       )

//       const buttonWithBaseWithoutDefaultsWithClassNameArray = cvax(
//         ["button", "font-semibold", "border", "rounded"],
//         {
//           variants: {
//             intent: {
//               primary: [
//                 "button--primary",
//                 "bg-blue-500",
//                 "text-white",
//                 "border-transparent",
//                 "hover:bg-blue-600",
//               ],
//               secondary: [
//                 "button--secondary",
//                 "bg-white",
//                 "text-gray-800",
//                 "border-gray-400",
//                 "hover:bg-gray-100",
//               ],
//               warning: [
//                 "button--warning",
//                 "bg-yellow-500",
//                 "border-transparent",
//                 "hover:bg-yellow-600",
//               ],
//               danger: [
//                 "button--danger",
//                 "bg-red-500",
//                 "text-white",
//                 "border-transparent",
//                 "hover:bg-red-600",
//               ],
//             },
//             disabled: {
//               true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
//               false: ["button--enabled", "cursor-pointer"],
//             },
//             size: {
//               small: ["button--small", "text-sm", "py-1", "px-2"],
//               medium: ["button--medium", "text-base", "py-2", "px-4"],
//               large: ["button--large", "text-lg", "py-2.5", "px-4"],
//             },
//           },
//           compoundVariants: [
//             {
//               intent: "primary",
//               size: "medium",
//               className: ["button--primary-medium", "uppercase"],
//             },
//             {
//               intent: "warning",
//               disabled: false,
//               className: ["button--warning-enabled", "text-gray-800"],
//             },
//             {
//               intent: "warning",
//               disabled: true,
//               className: ["button--warning-disabled", "text-black"],
//             },
//             {
//               intent: ["warning", "danger"],
//               className: ["button--warning-danger", "!border-red-500"],
//             },
//             {
//               intent: ["warning", "danger"],
//               size: "medium",
//               className: ["button--warning-danger-medium"],
//             },
//           ],
//         },
//       )

//       type ButtonWithBaseWithoutDefaultsProps =
//         | CVA.VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameString>
//         | CVA.VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameArray>

//       describe.each<[ButtonWithBaseWithoutDefaultsProps, string]>([
//         [
//           undefined as unknown as ButtonWithBaseWithoutDefaultsProps,
//           "button font-semibold border rounded",
//         ],
//         [{}, "button font-semibold border rounded"],
//         [
//           {
//             // @ts-expect-error
//             aCheekyInvalidProp: "lol",
//           },
//           "button font-semibold border rounded",
//         ],
//         [
//           { intent: "secondary" },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//         ],

//         [{ size: "small" }, "button font-semibold border rounded button--small text-sm py-1 px-2"],
//         [{ disabled: false }, "button font-semibold border rounded button--enabled cursor-pointer"],
//         [
//           { disabled: true },
//           "button font-semibold border rounded button--disabled opacity-050 cursor-not-allowed",
//         ],
//         [
//           { intent: "secondary", size: null },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//         ],
//         [
//           { intent: "secondary", size: undefined },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//         ],
//         [
//           { intent: "danger", size: "medium" },
//           "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium",
//         ],
//         [
//           { intent: "warning", size: "large" },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
//         ],
//         [
//           { intent: "warning", size: "large", disabled: null },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
//         ],
//         [
//           { intent: "warning", size: "large", disabled: true },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500",
//         ],
//         [
//           { intent: "warning", size: "large", disabled: false },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
//         ],
//         // !@TODO Add type "extractor" including class prop
//         [
//           {
//             intent: "primary",
//             className: "adhoc-className",
//           } as ButtonWithBaseWithoutDefaultsProps,
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-className",
//         ],
//       ])("button(%o)", (options, expected) => {
//         test(`returns ${expected}`, () => {
//           expect(buttonWithBaseWithoutDefaultsWithClassNameString(options)).toBe(expected)
//           expect(buttonWithBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected)
//         })
//       })
//     })

//     describe("with defaults", () => {
//       const buttonWithBaseWithDefaultsWithClassNameString = cvax(
//         "button font-semibold border rounded",
//         {
//           variants: {
//             intent: {
//               primary:
//                 "button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600",
//               secondary:
//                 "button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100",
//               warning: "button--warning bg-yellow-500 border-transparent hover:bg-yellow-600",
//               danger: "button--danger bg-red-500 text-white border-transparent hover:bg-red-600",
//             },
//             disabled: {
//               true: "button--disabled opacity-050 cursor-not-allowed",
//               false: "button--enabled cursor-pointer",
//             },
//             size: {
//               small: "button--small text-sm py-1 px-2",
//               medium: "button--medium text-base py-2 px-4",
//               large: "button--large text-lg py-2.5 px-4",
//             },
//           },
//           compoundVariants: [
//             {
//               intent: "primary",
//               size: "medium",
//               className: "button--primary-medium uppercase",
//             },
//             {
//               intent: "warning",
//               disabled: false,
//               className: "button--warning-enabled text-gray-800",
//             },
//             {
//               intent: "warning",
//               disabled: true,
//               className: "button--warning-disabled text-black",
//             },
//             {
//               intent: ["warning", "danger"],
//               className: "button--warning-danger !border-red-500",
//             },
//             {
//               intent: ["warning", "danger"],
//               size: "medium",
//               className: "button--warning-danger-medium",
//             },
//           ],
//           defaultVariants: {
//             disabled: false,
//             intent: "primary",
//             size: "medium",
//           },
//         },
//       )

//       const buttonWithBaseWithDefaultsWithClassNameArray = cvax(
//         ["button", "font-semibold", "border", "rounded"],
//         {
//           variants: {
//             intent: {
//               primary: [
//                 "button--primary",
//                 "bg-blue-500",
//                 "text-white",
//                 "border-transparent",
//                 "hover:bg-blue-600",
//               ],
//               secondary: [
//                 "button--secondary",
//                 "bg-white",
//                 "text-gray-800",
//                 "border-gray-400",
//                 "hover:bg-gray-100",
//               ],
//               warning: [
//                 "button--warning",
//                 "bg-yellow-500",
//                 "border-transparent",
//                 "hover:bg-yellow-600",
//               ],
//               danger: [
//                 "button--danger",
//                 "bg-red-500",
//                 "text-white",
//                 "border-transparent",
//                 "hover:bg-red-600",
//               ],
//             },
//             disabled: {
//               true: ["button--disabled", "opacity-050", "cursor-not-allowed"],
//               false: ["button--enabled", "cursor-pointer"],
//             },
//             size: {
//               small: ["button--small", "text-sm", "py-1", "px-2"],
//               medium: ["button--medium", "text-base", "py-2", "px-4"],
//               large: ["button--large", "text-lg", "py-2.5", "px-4"],
//             },
//           },
//           compoundVariants: [
//             {
//               intent: "primary",
//               size: "medium",
//               className: ["button--primary-medium", "uppercase"],
//             },
//             {
//               intent: "warning",
//               disabled: false,
//               className: ["button--warning-enabled", "text-gray-800"],
//             },
//             {
//               intent: "warning",
//               disabled: true,
//               className: ["button--warning-disabled", "text-black"],
//             },
//             {
//               intent: ["warning", "danger"],
//               className: ["button--warning-danger", "!border-red-500"],
//             },
//             {
//               intent: ["warning", "danger"],
//               size: "medium",
//               className: ["button--warning-danger-medium"],
//             },
//           ],
//           defaultVariants: {
//             disabled: false,
//             intent: "primary",
//             size: "medium",
//           },
//         },
//       )

//       type ButtonWithBaseWithDefaultsProps =
//         | CVA.VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameString>
//         | CVA.VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameArray>

//       describe.each<[ButtonWithBaseWithDefaultsProps, string]>([
//         [
//           // @ts-expect-error
//           undefined,
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
//         ],
//         [
//           {},
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
//         ],
//         [
//           {
//             aCheekyInvalidProp: "lol",
//           } as ButtonWithBaseWithDefaultsProps,
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
//         ],
//         [
//           { intent: "secondary" },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4",
//         ],

//         [
//           { size: "small" },
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2",
//         ],
//         [
//           { disabled: null },
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--medium text-base py-2 px-4 button--primary-medium uppercase",
//         ],
//         [
//           { disabled: false },
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase",
//         ],
//         [
//           { disabled: true },
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 button--primary-medium uppercase",
//         ],
//         [
//           { intent: "secondary", size: null },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer",
//         ],
//         [
//           { intent: "secondary", size: undefined },
//           "button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4",
//         ],
//         [
//           { intent: "danger", size: "medium" },
//           "button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium",
//         ],
//         [
//           { intent: "warning", size: "large" },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
//         ],
//         [
//           {
//             intent: "warning",
//             size: "large",
//             disabled: null,
//           },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500",
//         ],
//         [
//           { intent: "warning", size: "large", disabled: true },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500",
//         ],
//         [
//           { intent: "warning", size: "large", disabled: false },
//           "button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500",
//         ],
//         // !@TODO Add type "extractor" including class prop
//         [
//           {
//             intent: "primary",
//             className: "adhoc-classname",
//           } as ButtonWithBaseWithDefaultsProps,
//           "button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-classname",
//         ],
//       ])("button(%o)", (options, expected) => {
//         test(`returns ${expected}`, () => {
//           expect(buttonWithBaseWithDefaultsWithClassNameString(options)).toBe(expected)
//           expect(buttonWithBaseWithDefaultsWithClassNameArray(options)).toBe(expected)
//         })
//       })
//     })
//   })

//   describe("composing classes", () => {
//     type BoxProps = CVA.VariantProps<typeof box>
//     const box = cvax(["box", "box-border"], {
//       variants: {
//         margin: { 0: "m-0", 2: "m-2", 4: "m-4", 8: "m-8" },
//         padding: { 0: "p-0", 2: "p-2", 4: "p-4", 8: "p-8" },
//       },
//       defaultVariants: {
//         margin: 0,
//         padding: 0,
//       },
//     })

//     type CardBaseProps = CVA.VariantProps<typeof cardBase>
//     const cardBase = cvax(["card", "border-solid", "border-slate-300", "rounded"], {
//       variants: {
//         shadow: {
//           md: "drop-shadow-md",
//           lg: "drop-shadow-lg",
//           xl: "drop-shadow-xl",
//         },
//       },
//     })

//     interface CardProps extends BoxProps, CardBaseProps {}
//     const card = ({ margin, padding, shadow }: CardProps = {}) =>
//       cx(box({ margin, padding }), cardBase({ shadow }))

//     describe.each<[CardProps, string]>([
//       [
//         // @ts-expect-error
//         undefined,
//         "box box-border m-0 p-0 card border-solid border-slate-300 rounded",
//       ],
//       [{}, "box box-border m-0 p-0 card border-solid border-slate-300 rounded"],
//       [{ margin: 4 }, "box box-border m-4 p-0 card border-solid border-slate-300 rounded"],
//       [{ padding: 4 }, "box box-border m-0 p-4 card border-solid border-slate-300 rounded"],
//       [
//         { margin: 2, padding: 4 },
//         "box box-border m-2 p-4 card border-solid border-slate-300 rounded",
//       ],
//       [
//         { shadow: "md" },
//         "box box-border m-0 p-0 card border-solid border-slate-300 rounded drop-shadow-md",
//       ],
//     ])("card(%o)", (options, expected) => {
//       test(`returns ${expected}`, () => {
//         expect(card(options)).toBe(expected)
//       })
//     })
//   })
// })