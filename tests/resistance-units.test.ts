import { expect, test } from "bun:test"
import { resistance } from "../src/units"
import { parseAndConvertSiUnit } from "../src/utils/convert-si-unit-to-number"

test("resistance parses common resistor shorthand with case-sensitive prefixes", () => {
  expect(resistance.parse("10m")).toBe(0.01)
  expect(resistance.parse("10M")).toBe(10000000)
  expect(resistance.parse("10k")).toBe(10000)
  expect(resistance.parse("10K")).toBe(10000)
})

test("resistance parses explicit ohm units with milli and mega prefixes", () => {
  expect(resistance.parse("7.6mΩ")).toBe(0.0076)
  expect(resistance.parse("7.6mohm")).toBe(0.0076)
  expect(resistance.parse("7.6mOhm")).toBe(0.0076)
  expect(resistance.parse("1MΩ")).toBe(1000000)
  expect(resistance.parse("1MOhm")).toBe(1000000)
})

test("bare m remains a length unit in the generic SI parser", () => {
  expect(parseAndConvertSiUnit("10m")).toEqual({
    parsedUnit: "m",
    unitOfValue: "mm",
    value: 10000,
  })
})
