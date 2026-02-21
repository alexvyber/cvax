import type * as Cvax from "."
import { cvax } from "."
import { suite, test } from "node:test"
import assert from "node:assert/strict"

suite("cvax incopitable", () => {
  const withIncopitable = cvax({
    base: "base",

    variants: {
      size: { first: "first", second: "second", third: "third" },
      color: { one: "one", two: "two", three: "three" },
      shape: { solid: "solid", filled: "filled", outline: "outline" },
    },

    compoundVariants: [
      { color: "one", size: "first", className: "three" },
      { color: "two", size: "second", className: "three" },
    ],

    defaultVariants: { color: "two", size: "first" },

    incompatible: {
      size: {
        first: { color: ["one"], shape: ["solid"] },
      },

      color: {
        two: { shape: ["filled"], size: ["second"] },
      },

      shape: {
        outline: { color: ["one", "two"], size: ["first", "second"] },
      },
    },
  })

  if (false) {
    const incompatibleCall = withIncopitable<{ size: "first"; color: "one" }>
    const compatibleCall = withIncopitable<{ size: "first"; color: "two" }>
    type IncompatibleReturn = ReturnType<typeof incompatibleCall>
    type CompatibleReturn = ReturnType<typeof compatibleCall>
    const _incompatibleResult: never = undefined as IncompatibleReturn
    const _compatibleResult: CompatibleReturn = ""

    // @ts-expect-error: incompatible variant pair should be rejected
    withIncopitable({ size: "first", color: "one" })
  }

  test("allways throws", () => {
    const varints = [
      //size
      { size: "first", color: "one" },
      { size: "first", shape: "solid" },

      // color
      { color: "two", shape: "filled" },
      { color: "two", size: "second" },

      // shape
      { shape: "outline", color: "one" },
      { shape: "outline", color: "two" },
      { shape: "outline", size: "first" },
      { shape: "outline", size: "second" },
    ]

    for (const variant of varints) {
      assert.throws(() => withIncopitable(variant as any))
    }
  })

  test("never throws", () => {
    const varints = [
      // size
      { size: "first", color: "two" },
      { size: "first", color: "three" },
      { size: "first", shape: "filled" },

      { size: "second", shape: "solid" },
      { size: "second", shape: "filled" },

      { size: "third", shape: "outline" },
      { size: "third", shape: "solid" },

      // color
      { color: "one", shape: "solid" },

      { color: "two", shape: "solid" },

      { color: "three", shape: "solid" },
      { color: "three", shape: "filled" },
      { color: "three", shape: "outline" },

      // shape
      { shape: "solid", color: "one" },
      { shape: "solid", color: "two" },
      { shape: "solid", color: "three" },

      { shape: "solid", size: "second" },
      { shape: "solid", size: "third" },

      { shape: "outline", size: "third" },
      { shape: "outline", color: "three" },
    ] satisfies Cvax.VariantProps<typeof withIncopitable>[]

    for (const variant of varints) {
      assert.doesNotThrow(() => withIncopitable(variant as any))
    }
  })
})
