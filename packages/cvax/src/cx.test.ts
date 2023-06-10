import { describe, it as test, expect } from "vitest"
import { cx } from "./cx"
import { ClassValue } from "./types"

// Clean up stuff
// Write tests for class and className cases
test("keeps object keys with truthy values", () => {
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
    })
  ).toBe("one two five six eight")
})

test("should be trimmed", () => {
  expect(
    cx(
      "",
      "                   two             three            ",
      { four: true, "                five              ": true },
      ""
    ).replace(/\s+/g, " ")
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
    ])
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
    "function emptyObject nonEmptyString whitespace nonEmptyObject emptyList nonEmptyList greaterZero"
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

  expect(res.replace(/\s+/g, " ")).toBe("one two three six seven nine ten eleven twelve thirteen")
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

test("strings", () => {
  expect(cx("")).toBe("")
  expect(cx("foo")).toBe("foo")
  expect(cx(true && "foo")).toBe("foo")
  expect(cx(false && "foo")).toBe("")
})

test("strings (variadic)", () => {
  expect(cx("")).toBe("")
  expect(cx("foo", "bar")).toBe("foo bar")
  expect(cx(true && "foo", false && "bar", "baz")).toBe("foo baz")
  expect(cx(false && "foo", "bar", "baz", "")).toBe("bar baz")
})

test("objects", () => {
  expect(cx({}), "")
  expect(cx({ foo: true }), "foo")
  expect(cx({ foo: true, bar: false }), "foo")
  expect(cx({ foo: "hiya", bar: 1 }), "foo bar")
  expect(cx({ foo: 1, bar: 0, baz: 1 }), "foo baz")
  expect(cx({ "-foo": 1, "--bar": 1 }), "-foo --bar")
})

test("objects (variadic)", () => {
  expect(cx({}, {})).toBe("")
  expect(cx({ foo: 1 }, { bar: 2 })).toBe("foo bar")
  expect(cx({ foo: 1 }, null, { baz: 1, bat: 0 })).toBe("foo baz")
  expect(cx({ foo: 1 }, {}, {}, { bar: "a" }, { baz: null, bat: Infinity })).toBe("foo bar bat")
})

test("arrays", () => {
  expect(cx([])).toBe("")
  expect(cx(["foo"])).toBe("foo")
  expect(cx(["foo", "bar"])).toBe("foo bar")
  expect(cx(["foo", 0 && "bar", 1 && "baz"])).toBe("foo baz")
})

test("arrays (nested)", () => {
  expect(cx([[[]]])).toBe("")
  expect(cx([[["foo"]]])).toBe("foo")
  expect(cx([true, [["foo"]]])).toBe("foo")
  expect(cx(["foo", ["bar", ["", [["baz"]]]]])).toBe("foo bar baz")
})

test("arrays (variadic)", () => {
  expect(cx([], [])).toBe("")
  expect(cx(["foo"], ["bar"])).toBe("foo bar")
  expect(cx(["foo"], null, ["baz", ""], true, "", [])).toBe("foo baz")
})

test("arrays (no `push` escape)", () => {
  expect(cx({ push: 1 })).toBe("push")
  expect(cx({ pop: true })).toBe("pop")
  expect(cx({ push: true })).toBe("push")
  expect(cx("hello", { world: 1, push: true })).toBe("hello world push")
})

test("functions", () => {
  const foo = () => {}
  // @ts-expect-error
  expect(cx(foo, "hello")).toBe("hello")
  // @ts-expect-error
  expect(cx(foo, "hello", cx)).toBe("hello")
  // @ts-expect-error
  expect(cx(foo, "hello", [[cx], "world"])).toBe("hello world")
})
