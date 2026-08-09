import type * as Cvax from "."
import { compose, cvax } from "."
import { describe, expect, expectTypeOf, it } from "vitest"

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

const withIncompatible = cvax({
  base: "base",
  variants: {
    size: { first: "size-first", second: "size-second", third: "size-third" },
    color: { one: "color-one", two: "color-two", three: "color-three" },
    shape: { solid: "shape-solid", filled: "shape-filled", outline: "shape-outline" },
  },
  compoundVariants: [
    { color: "one", size: "first", className: "compound-one-first" },
    { color: "two", size: "second", className: "compound-two-second" },
  ],
  defaultVariants: { color: "two", size: "first" },
  incompatible,
})

type RuntimeVariant = {
  -readonly [Variant in keyof Cvax.VariantProps<typeof withIncompatible>]: Cvax.VariantProps<typeof withIncompatible>[Variant]
}

const defaultVariants = { color: "two", size: "first" } as const
const incompatibleRules = incompatible as Record<string, Record<string, Record<string, readonly string[]>>>

function shouldThrowForVariant(variant: RuntimeVariant): boolean {
  const effectiveVariant = { ...defaultVariants, ...variant } as Record<string, unknown>

  for (const key of Object.keys(incompatibleRules)) {
    const variantValue = effectiveVariant[key]

    if (typeof variantValue !== "string") {
      continue
    }

    const incompatibleForValue = incompatibleRules[key][variantValue]

    if (!incompatibleForValue) {
      continue
    }

    for (const incompatibleKey of Object.keys(incompatibleForValue)) {
      const incompatibleValue = effectiveVariant[incompatibleKey]

      if (typeof incompatibleValue === "string" && incompatibleForValue[incompatibleKey].includes(incompatibleValue)) {
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

        if (size !== undefined) variant.size = size
        if (color !== undefined) variant.color = color
        if (shape !== undefined) variant.shape = shape
        variants.push(variant)
      }
    }
  }

  return variants
}

describe("cvax incompatible variants: runtime", () => {
  it("checks all 64 explicit/default variant combinations against an independent oracle", () => {
    const allVariants = generateAllVariants()
    let throws = 0
    let nonThrows = 0

    expect(allVariants).toHaveLength(64)

    for (const variant of allVariants) {
      const call = () => withIncompatible(variant as any)

      if (shouldThrowForVariant(variant)) {
        throws += 1
        expect(call, JSON.stringify(variant)).toThrow()
      } else {
        nonThrows += 1
        expect(call, JSON.stringify(variant)).not.toThrow()
      }
    }

    expect(throws + nonThrows).toBe(64)
    expect(throws).toBeGreaterThan(0)
    expect(nonThrows).toBeGreaterThan(0)
  })

  it("uses defaults when props are omitted or undefined", () => {
    expect(withIncompatible()).toBe("base size-first color-two")
    expect(withIncompatible({ size: undefined, color: undefined })).toBe("base size-first color-two")
  })

  it("returns default classes without compound variants when props are omitted", () => {
    const withoutCompounds = cvax({
      base: "base",
      variants: { tone: { primary: "tone-primary", secondary: "tone-secondary" } },
      defaultVariants: { tone: "primary" },
    })

    expect(withoutCompounds()).toBe("base tone-primary")
  })

  it("checks explicit values against defaults", () => {
    expect(() => withIncompatible({ shape: "solid" } as any)).toThrow()
    expect(() => withIncompatible({ shape: "filled" } as any)).toThrow()
    expect(() => withIncompatible({ color: "one" } as any)).toThrow()
    expect(() => withIncompatible({ size: "second" } as any)).toThrow()
  })

  it("lets explicit values override conflicting defaults", () => {
    expect(withIncompatible({ size: "second", color: "one", shape: "solid" })).toBe(
      "base size-second color-one shape-solid"
    )
    expect(withIncompatible({ size: "third", color: "three", shape: "outline" })).toBe(
      "base size-third color-three shape-outline"
    )
  })

  it("reports the exact incompatible pair", () => {
    expect(() => withIncompatible({ size: "first", color: "one" } as any)).toThrow(
      'You called variants with incompatible variants: { size: "first" } is incompatible with { color: "one" }'
    )
  })

  it("normalizes boolean variant values", () => {
    const booleanVariants = cvax({
      variants: {
        enabled: { true: "enabled", false: "disabled" },
        visible: { true: "visible", false: "hidden" },
      },
      incompatible: {
        enabled: {
          true: { visible: ["false"] },
        },
      },
    })

    expect(() => booleanVariants({ enabled: true, visible: false } as any)).toThrow()
    expect(booleanVariants({ enabled: true, visible: true })).toBe("enabled visible")
    expect(booleanVariants({ enabled: false, visible: false })).toBe("disabled hidden")
  })

  it("supports unset and ad-hoc classes without false positives", () => {
    expect(withIncompatible({ size: "unset", color: "three", class: "adhoc" })).toBe("base color-three adhoc")
    expect(withIncompatible({ size: "third", shape: "solid", className: "adhoc" })).toBe(
      "base size-third color-two shape-solid adhoc"
    )
  })

  it("defensively rejects incompatible defaults from untyped JavaScript", () => {
    const invalidDefaults = (cvax as any)({
      variants: {
        size: { first: "first" },
        color: { one: "one" },
      },
      defaultVariants: { size: "first", color: "one" },
      incompatible: { size: { first: { color: ["one"] } } },
    })

    expect(() => invalidDefaults()).toThrow()
    expect(() => invalidDefaults({})).toThrow()
  })

  it("enforces component rules through compose", () => {
    const composed = compose(
      withIncompatible,
      cvax({ variants: { elevation: { low: "elevation-low", high: "elevation-high" } } })
    )

    expect(() => composed({ shape: "filled", elevation: "high" } as any)).toThrow()
    expect(composed({ shape: "solid", size: "second", color: "one", elevation: "high" })).toBe(
      "base size-second color-one shape-solid elevation-high"
    )
  })
})

describe("cvax incompatible variants: types", () => {
  it("preserves complete VariantProps inference", () => {
    expectTypeOf<RuntimeVariant>().toEqualTypeOf<{
      size?: "first" | "second" | "third" | "unset" | undefined
      color?: "one" | "two" | "three" | "unset" | undefined
      shape?: "solid" | "filled" | "outline" | "unset" | undefined
    }>()
  })

  it("accepts every statically compatible form", () => {
    expectTypeOf(withIncompatible()).toEqualTypeOf<string>()
    expectTypeOf(withIncompatible({ size: "first", color: "two" })).toEqualTypeOf<string>()
    expectTypeOf(withIncompatible({ size: "second", color: "one", shape: "solid" })).toEqualTypeOf<string>()
    expectTypeOf(withIncompatible({ size: "third", color: "three", shape: "outline" })).toEqualTypeOf<string>()
    expectTypeOf(withIncompatible({ size: "unset", color: "three", class: "adhoc" })).toEqualTypeOf<string>()
    expectTypeOf(withIncompatible({ size: undefined, color: undefined })).toEqualTypeOf<string>()
  })

  it("rejects every declared incompatible pair", () => {
    if (false) {
      // @ts-expect-error: size:first conflicts with color:one
      withIncompatible({ size: "first", color: "one" })
      // @ts-expect-error: size:first conflicts with shape:solid
      withIncompatible({ size: "first", shape: "solid", color: "three" })
      // @ts-expect-error: color:two conflicts with shape:filled
      withIncompatible({ color: "two", shape: "filled", size: "third" })
      // @ts-expect-error: color:two conflicts with size:second
      withIncompatible({ color: "two", size: "second" })
      // @ts-expect-error: shape:outline conflicts with color:one
      withIncompatible({ shape: "outline", color: "one", size: "third" })
      // @ts-expect-error: shape:outline conflicts with color:two
      withIncompatible({ shape: "outline", color: "two", size: "third" })
      // @ts-expect-error: shape:outline conflicts with size:first
      withIncompatible({ shape: "outline", size: "first", color: "three" })
      // @ts-expect-error: shape:outline conflicts with size:second
      withIncompatible({ shape: "outline", size: "second", color: "three" })
    }
  })

  it("rejects incompatible explicit/default combinations", () => {
    if (false) {
      // @ts-expect-error: default size:first conflicts with shape:solid
      withIncompatible({ shape: "solid" })
      // @ts-expect-error: default color:two conflicts with shape:filled
      withIncompatible({ shape: "filled" })
      // @ts-expect-error: default size:first conflicts with color:one
      withIncompatible({ color: "one" })
      // @ts-expect-error: default color:two conflicts with size:second
      withIncompatible({ size: "second" })
      // @ts-expect-error: class props do not bypass incompatibility
      withIncompatible({ shape: "filled", className: "adhoc" })
    }
  })

  it("rejects incompatible defaults in configuration", () => {
    if (false) {
      // @ts-expect-error: the two defaults are incompatible
      cvax({
        variants: {
          size: { first: "first" },
          color: { one: "one" },
        },
        defaultVariants: { size: "first", color: "one" },
        incompatible: { size: { first: { color: ["one"] } } },
      })
    }
  })

  it("validates incompatible configuration keys and values", () => {
    if (false) {
      // @ts-expect-error: unknown source variant
      cvax({
        variants: {
          size: { small: "small", large: "large" },
          tone: { calm: "calm", loud: "loud" },
        },
        incompatible: { missing: { small: { tone: ["calm"] } } },
      })
      // @ts-expect-error: unknown source value
      cvax({
        variants: { size: { small: "small" }, tone: { calm: "calm" } },
        incompatible: { size: { huge: { tone: ["calm"] } } },
      })
      // @ts-expect-error: a variant cannot target itself
      cvax({
        variants: { size: { small: "small", large: "large" }, tone: { calm: "calm" } },
        incompatible: { size: { small: { size: ["large"] } } },
      })
      // @ts-expect-error: unknown target variant
      cvax({
        variants: { size: { small: "small" }, tone: { calm: "calm" } },
        incompatible: { size: { small: { missing: ["calm"] } } },
      })
      // @ts-expect-error: unknown target value
      cvax({
        variants: { size: { small: "small" }, tone: { calm: "calm" } },
        incompatible: { size: { small: { tone: ["quiet"] } } },
      })
    }
  })

  it("handles boolean rules at compile time", () => {
    const booleanVariants = cvax({
      variants: {
        enabled: { true: "enabled", false: "disabled" },
        visible: { true: "visible", false: "hidden" },
      },
      incompatible: { enabled: { true: { visible: ["false"] } } },
    })

    expectTypeOf(booleanVariants({ enabled: true, visible: true })).toEqualTypeOf<string>()
    expectTypeOf(booleanVariants({ enabled: false, visible: false })).toEqualTypeOf<string>()

    if (false) {
      // @ts-expect-error: enabled:true conflicts with visible:false
      booleanVariants({ enabled: true, visible: false })
    }
  })

  it("preserves and enforces rules through compose", () => {
    const composed = compose(
      withIncompatible,
      cvax({ variants: { elevation: { low: "low", high: "high" } } })
    )

    expectTypeOf(composed({ size: "third", color: "three", elevation: "high" })).toEqualTypeOf<string>()
    expectTypeOf<Cvax.VariantProps<typeof composed>>().toMatchTypeOf<{
      size?: "first" | "second" | "third" | "unset"
      elevation?: "low" | "high" | "unset"
    }>()

    if (false) {
      // @ts-expect-error: composed calls retain default-aware incompatible rules
      composed({ shape: "filled", elevation: "high" })
    }
  })
})
