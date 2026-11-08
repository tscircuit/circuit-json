import { expect, test } from "bun:test"
import { z } from "zod"
import { any_circuit_element } from "../src/any_circuit_element"
import { any_source_component } from "../src/source/any_source_component"
import { source_simple_battery } from "../src/source/source_simple_battery"
import { battery_capacity } from "../src/units"

const validCapacities: Array<[number | string, number]> = [
  [0, 0],
  [-0, -0],
  [-1, -1],
  [0.5, 0.5],
  [2200, 2200],
  [Number.MIN_VALUE, Number.MIN_VALUE],
  [Number.MAX_VALUE, Number.MAX_VALUE],
  ["0mAh", 0],
  ["-0mAh", -0],
  ["2200mAh", 2200],
  ["-2.5mAh", -2.5],
  [".5mAh", 0.5],
  ["1.mAh", 1],
  ["1e3mAh", 1000],
  ["+1.25E+3mAh", 1250],
  ["1e-3mAh", 0.001],
  ["5e-324mAh", Number.MIN_VALUE],
  [" \t2200 \tmAh", 2200],
]

const battery = (capacity: unknown) => ({
  type: "source_component",
  ftype: "simple_battery",
  source_component_id: "B1",
  name: "B1",
  capacity,
})

test("battery capacity preserves finite numeric and complete mAh values", () => {
  for (const [input, expected] of validCapacities) {
    expect(battery_capacity.parse(input)).toBe(expected)
  }
})

test.each([
  "mAh",
  "abcmAh",
  " mAh",
  "10junkmAh",
  "1e+mAh",
  "1.2.3mAh",
  "1mAhmAh",
  "0x10mAh",
  "InfinitymAh",
  "-InfinitymAh",
  "NaNmAh",
  "1e309mAh",
])("battery capacity rejects malformed mAh input %j", (input) => {
  const result = battery_capacity.safeParse(input)
  expect(result.success).toBe(false)
  if (!result.success) expect(result.error).toBeInstanceOf(z.ZodError)
  expect(() => battery_capacity.parse(input)).toThrow(z.ZodError)
})

test("battery capacity rejects non-finite numbers, other units and types", () => {
  for (const input of [
    Infinity,
    -Infinity,
    NaN,
    "10",
    "1Ah",
    "1mah",
    "1mAh\n",
    null,
    undefined,
    {},
  ]) {
    expect(battery_capacity.safeParse(input).success).toBe(false)
  }
})

for (const [name, schema] of [
  ["source_simple_battery", source_simple_battery],
  ["any_source_component", any_source_component],
  ["any_circuit_element", any_circuit_element],
] as const) {
  test(`${name} preserves valid battery capacities`, () => {
    for (const [input, expected] of validCapacities) {
      const parsed = schema.parse(battery(input))
      expect(parsed).toMatchObject({
        type: "source_component",
        ftype: "simple_battery",
        source_component_id: "B1",
        name: "B1",
        capacity: expected,
      })
    }
  })

  test(`${name} returns validation failures for malformed battery capacities`, () => {
    for (const input of ["mAh", "10junkmAh", "1e+mAh", "1e309mAh", Infinity]) {
      const result = schema.safeParse(battery(input))
      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(z.ZodError)
    }
  })
}

test("invalid battery capacity reports the property path", () => {
  const result = source_simple_battery.safeParse(battery("mAh"))
  expect(result.success).toBe(false)
  if (!result.success)
    expect(result.error.issues[0]?.path).toEqual(["capacity"])
})
