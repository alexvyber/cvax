import type * as Cvax from "."
import { cvax } from "."
import { describe, expect, it } from "vitest"

describe("cvax incopitable", () => {
  const incompatible = {
    size: {
      first: { color: ["one"], shape: ["solid"] },
    },

    color: {
      two: { shape: ["filled"], size: ["second"] },
    },

    shape: {
      outline: { color: ["one", "two"], size: ["first", "second"] },
    },
  } as const

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

    incompatible,
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
    // @ts-expect-error: incompatible variant pair should be rejected
    withIncopitable({ size: "first", shape: "solid" })
    // @ts-expect-error: incompatible variant pair should be rejected
    withIncopitable({ color: "two", shape: "filled" })
    // @ts-expect-error: incompatible variant pair should be rejected
    withIncopitable({ color: "two", size: "second" })
    // @ts-expect-error: incompatible variant pair should be rejected
    withIncopitable({ shape: "outline", color: "one" })
    // @ts-expect-error: incompatible variant pair should be rejected
    withIncopitable({ shape: "outline", color: "two" })
    // @ts-expect-error: incompatible variant pair should be rejected
    withIncopitable({ shape: "outline", size: "first" })
    // @ts-expect-error: incompatible variant pair should be rejected
    withIncopitable({ shape: "outline", size: "second" })
  }

  type RuntimeVariant = {
    size?: "first" | "second" | "third"
    color?: "one" | "two" | "three"
    shape?: "solid" | "filled" | "outline"
  }

  const incompatibleRules = incompatible as Record<string, Record<string, Record<string, readonly string[]>>>

  function shouldThrowForVariant(variant: RuntimeVariant): boolean {
    for (const key of Object.keys(incompatibleRules)) {
      if (!(key in variant)) {
        continue
      }

      const variantValue = variant[key as keyof RuntimeVariant]

      if (typeof variantValue !== "string") {
        continue
      }

      const incompatibleForValue = incompatibleRules[key][variantValue]

      if (!incompatibleForValue) {
        continue
      }

      for (const incompatibleKey of Object.keys(incompatibleForValue)) {
        const incompatibleValue = variant[incompatibleKey as keyof RuntimeVariant]

        if (typeof incompatibleValue !== "string") {
          continue
        }

        if (incompatibleForValue[incompatibleKey].includes(incompatibleValue)) {
          return true
        }
      }
    }

    return false
  }

  function generateAllVariants(): RuntimeVariant[] {
    const variants: RuntimeVariant[] = []
    const sizes = [undefined, "first", "second", "third"] as const
    const colors = [undefined, "one", "two", "three"] as const
    const shapes = [undefined, "solid", "filled", "outline"] as const

    for (const size of sizes) {
      for (const color of colors) {
        for (const shape of shapes) {
          const variant: RuntimeVariant = {}

          if (size) {
            variant.size = size
          }

          if (color) {
            variant.color = color
          }

          if (shape) {
            variant.shape = shape
          }

          variants.push(variant)
        }
      }
    }

    return variants
  }

  it("checks incompatible logic for every variant combination", () => {
    const allVariants = generateAllVariants()
    const typedVariants = allVariants satisfies Cvax.VariantProps<typeof withIncopitable>[]
    let throws = 0
    let nonThrows = 0

    expect(allVariants).toHaveLength(64)

    for (const variant of typedVariants) {
      const call = () => withIncopitable(variant as any)

      if (shouldThrowForVariant(variant)) {
        throws += 1
        expect(call).toThrow()
      } else {
        nonThrows += 1
        expect(call).not.toThrow()
      }
    }

    expect(throws).toBeGreaterThan(0)
    expect(nonThrows).toBeGreaterThan(0)
  })

  it("returns default variant classes without compounds when props are omitted", () => {
    const withoutCompounds = cvax({
      base: "base",
      variants: {
        tone: { primary: "tone-primary", secondary: "tone-secondary" },
      },
      defaultVariants: {
        tone: "primary",
      },
    })

    expect(withoutCompounds()).toBe("base tone-primary")
  })
})
