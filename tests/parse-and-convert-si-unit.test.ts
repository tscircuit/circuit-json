import { expect, test } from "bun:test"
import { parseAndConvertSiUnit } from "../src/utils/convert-si-unit-to-number"

test("parseAndConvertSiUnit", () => {
  expect(parseAndConvertSiUnit(undefined)).toEqual({
    parsedUnit: null,
    unitOfValue: null,
    value: null,
  })

  // Test numeric string without unit
  expect(parseAndConvertSiUnit("42")).toEqual({
    parsedUnit: null,
    unitOfValue: null,
    value: 42,
  })

  // Test number input
  expect(parseAndConvertSiUnit(3.14)).toEqual({
    parsedUnit: null,
    unitOfValue: null,
    value: 3.14,
  })

  // Test object with x and y as numbers
  expect(parseAndConvertSiUnit({ x: 10, y: 20 })).toEqual({
    parsedUnit: null,
    unitOfValue: null,
    value: { x: 10, y: 20 },
  })

  // Test object with x and y as strings with units
  expect(parseAndConvertSiUnit({ x: "10mm", y: "20mm" })).toEqual({
    parsedUnit: "mm",
    unitOfValue: "mm",
    value: { x: 10, y: 20 },
  })

  // Test string with unit that has a target conversion (length)
  expect(parseAndConvertSiUnit("5cm")).toEqual({
    parsedUnit: "cm",
    unitOfValue: "mm",
    value: 50,
  })

  // Test SI prefix units (length)
  expect(parseAndConvertSiUnit("1km")).toEqual({
    parsedUnit: "km",
    unitOfValue: "mm",
    value: 1000000,
  })

  // Test mass conversion
  expect(parseAndConvertSiUnit("2kg")).toEqual({
    parsedUnit: "kg",
    unitOfValue: "g",
    value: 2000,
  })

  // Test time conversion
  expect(parseAndConvertSiUnit("1s")).toEqual({
    parsedUnit: "s",
    unitOfValue: "ms",
    value: 1000,
  })

  // Test angle conversion
  expect(parseAndConvertSiUnit("1rad")).toEqual({
    parsedUnit: "rad",
    unitOfValue: "deg",
    value: 180 / Math.PI,
  })

  // Test volume conversion
  expect(parseAndConvertSiUnit("1l")).toEqual({
    parsedUnit: "l",
    unitOfValue: "ml",
    value: 1000,
  })

  // Test empty string
  expect(() => parseAndConvertSiUnit("")).toThrow(
    'Could not determine unit: ""',
  )

  // Test SI prefix unit without measure (frequency)
  expect(parseAndConvertSiUnit("50MHz")).toEqual({
    parsedUnit: "MHz",
    unitOfValue: "Hz",
    value: 50000000,
  })

  // Test object with mixed types
  expect(parseAndConvertSiUnit({ x: "10cm", y: 200 })).toEqual({
    parsedUnit: "cm",
    unitOfValue: "mm",
    value: { x: 100, y: 200 },
  })

  // Test unit with decimal value
  expect(parseAndConvertSiUnit("3.5kg")).toEqual({
    parsedUnit: "kg",
    unitOfValue: "g",
    value: 3500,
  })

  // Test unit with SI prefix and decimal value
  expect(parseAndConvertSiUnit("2.5um")).toEqual({
    parsedUnit: "um",
    unitOfValue: "mm",
    value: 0.0025,
  })

  // Test zero value with unit
  expect(parseAndConvertSiUnit("0kg")).toEqual({
    parsedUnit: "kg",
    unitOfValue: "g",
    value: 0,
  })

  // Test negative value with unit
  expect(parseAndConvertSiUnit("-5m")).toEqual({
    parsedUnit: "m",
    unitOfValue: "mm",
    value: -5000,
  })

  // Test unit with exponent notation
  expect(parseAndConvertSiUnit("1e3kg")).toEqual({
    parsedUnit: "kg",
    unitOfValue: "g",
    value: 1000000,
  })

  // Test unit with whitespace
  expect(parseAndConvertSiUnit("  2 kg  ")).toEqual({
    parsedUnit: "kg",
    unitOfValue: "g",
    value: 2000,
  })

  expect(parseAndConvertSiUnit("10kΩ")).toEqual({
    parsedUnit: "kΩ",
    unitOfValue: "Ω",
    value: 10000,
  })

  expect(parseAndConvertSiUnit("10k")).toEqual({
    parsedUnit: null,
    unitOfValue: null,
    value: 10000,
  })

  expect(parseAndConvertSiUnit("-6")).toEqual({
    parsedUnit: null,
    unitOfValue: null,
    value: -6,
  })

  // Test kohm unit
  expect(parseAndConvertSiUnit("10kohm")).toEqual({
    parsedUnit: "kohm",
    unitOfValue: "Ω",
    value: 10000,
  })
})
