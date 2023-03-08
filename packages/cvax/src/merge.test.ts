import type * as CVA from "./"
import type { CxOptions } from "./types"
import { cvax, cx } from "./"

import { describe, it as test, expect } from "vitest"
import { merge } from "./"

describe("merge", () => {
  describe.each<Parameters<typeof merge>>([
    [[{}, {}], {}],
    [[null, null], {}],
    [[null, undefined], {}],
    [[{}, { a: 1, b: { a: "a" } }], {}],
    // [[{}, {}, {}, {}], {}],
    // [[{}, {}, {}, null], {}],

    // [[{ a: "one" }, {}], { a: "one" }],
    // [[{ a: "one" }, { a: "one" }], { a: "one" }],
    // [undefined, ""],
    // [["foo", null, "bar", undefined, "baz"], "foo bar baz"],
    // [
    //   [
    //     "foo",
    //     [
    //       null,
    //       ["bar"],
    //       [
    //         undefined,
    //         ["baz", "qux", "quux", "quuz", [[[[[[[[["corge", "grault"]]]]], "garply"]]]]],
    //       ],
    //     ],
    //   ],
    //   "foo bar baz qux quux quuz corge grault garply",
    // ],
  ])("merge(%o)", (options, expected) => {
    console.log("🚀 ~ options:", merge(options))
    test(`returns ${expected}`, () => {
      expect(merge(options)).toEqual(expected)
    })
  })
})
