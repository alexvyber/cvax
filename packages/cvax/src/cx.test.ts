import { describe, it as test, expect } from "vitest"
import { cx, ClassValue } from "./cx"

test("keeps object keys with truthy values", () => {
  expect(cx({ one: true, two: false, three: 0, four: null, five: undefined, six: 1 })).toBe(
    "one six",
  )
})

test("joins arrays of class names and ignore falsy values", () => {
  expect(cx("one", 0, null, undefined, true, 1, "seven")).toBe("one 1 seven")
})

test("handles arrays that include falsy and true values", () => {
  expect(cx(["one", 0, null, undefined, false, true, "seven"])).toBe("one seven")
})

test("supports heterogenous arguments", () => {
  expect(
    cx({ one: true }, "two", 0, false, "five", [[{ six: true }]], {
      className: [{ seven: false }, [[{ eight: true }]]],
    }),
  ).toBe("one two five six eight")
})

test("should be trimmed", () => {
  expect(
    cx(
      "",
      "                   two             three            ",
      { four: true, "                five              ": true },
      "",
    ),
  ).toBe("two three four five")
})

test("returns an empty string for an empty configuration", () => {
  expect(cx({})).toBe("")
})

test("supports an array of class names", () => {
  expect(cx(["one", "two"])).toBe("one two")
})

test("joins array arguments with string arguments", () => {
  expect(cx(["one", "two"], "three")).toBe("one two three")
  expect(cx("three", ["one", "two"])).toBe("three one two")
})

test("handles multiple array arguments", () => {
  expect(cx(["one", "two"], ["three", "four"])).toBe("one two three four")
})

test("handles arrays that include arrays", () => {
  expect(cx(["one", ["two", "three"]])).toBe("one two three")
})

test("handles arrays that include objects", () => {
  expect(cx(["one", { two: true, three: false }])).toBe("one two")
})

test("handles deep array recursion", () => {
  expect(cx(["one", ["two", ["three", { four: true }]]])).toBe("one two three four")
})

test("handles arrays that are empty", () => {
  expect(cx("one", [])).toBe("one")
})

test("handles nested arrays with nested arrays", () => {
  expect(cx([[[[[[[[], [], [[], [[]]], [[[[[[[[[[[["one"]]]]]]]]]]]]]]]]]]])).toBe("one")
})

test("handles nested arrays that have empty nested arrays", () => {
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
    ]),
  ).toBe("one three")
})

test("handles all types of truthy and falsy property values as expected", () => {
  // @ts-expect-error
  const res = cx({
    // These ARE causing TypeScript errors:
    function: Object.prototype.toString,
    emptyObject: {},

    // falsy:
    null: null,
    emptyString: "",
    noNumber: NaN,
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

  expect(res).toBe(
    "function emptyObject nonEmptyString whitespace nonEmptyObject emptyList nonEmptyList greaterZero",
  )
})

test("handles all types of truthy and falsy property values as expected", () => {
  const className = {
    "one two three": true,
    "four five": false,

    class: [
      "six",
      true && "seven",
      false && "eight",
      true ?? true,
      true ?? 0,
      false ?? null,
      { className: "nine" },
    ],
  }

  const res = cx({
    className,
    class: ["ten", ["eleven", ["twelve", { thirteen: true }]]],
  })

  expect(res).toBe("one two three six seven nine ten eleven twelve thirteen")
})

describe("cx", () => {
  describe.each<ClassValue>([
    [null, ""],
    [undefined, ""],
    [["foo", null, "bar", undefined, "baz"], "foo bar baz"],
    [
      [
        "foo",
        [
          null,
          ["bar"],
          [
            undefined,
            ["baz", "qux", "quux", "quuz", [[[[[[[[["corge", "grault"]]]]], "garply"]]]]],
          ],
        ],
      ],
      "foo bar baz qux quux quuz corge grault garply",
    ],
    [
      ["foo", [1 && "bar", { baz: false, bat: null }, ["hello", ["world"]]], "cya"],
      "foo bar hello world cya",
    ],
  ])("cx(%o)", (options, expected) => {
    test(`returns ${expected}`, () => {
      expect(cx(options)).toBe(expected)
    })
  })
})
