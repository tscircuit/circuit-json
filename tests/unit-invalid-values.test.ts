import { test, expect } from "bun:test"
import {
  capacitance,
  current,
  duration_ms,
  frequency,
  inductance,
  length,
  resistance,
  rotation,
  voltage,
} from "src/units"

test("unit schemas reject unparseable values instead of returning NaN", () => {
  const schemas = {
    resistance,
    capacitance,
    inductance,
    voltage,
    current,
    length,
    frequency,
    duration_ms,
    rotation,
  }

  for (const [name, schema] of Object.entries(schemas)) {
    for (const input of ["abc", "xyz", "???", ""]) {
      const result = schema.safeParse(input)
      expect(
        result.success,
        `${name} should reject ${JSON.stringify(input)}`,
      ).toBe(false)
    }
  }
})

test("unit schemas still accept valid values", () => {
  expect(resistance.parse("10k")).toBe(10000)
  expect(resistance.parse(1000)).toBe(1000)
  expect(capacitance.parse("10uF")).toBe(0.00001)
  expect(inductance.parse("10uH")).toBeCloseTo(0.00001)
  expect(voltage.parse("3.3V")).toBeCloseTo(3.3)
  expect(current.parse("500mA")).toBeCloseTo(0.5)
  expect(rotation.parse("90deg")).toBe(90)
  expect(rotation.parse(45)).toBe(45)
})
