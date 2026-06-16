import { expect, test } from "bun:test"
import {
  capacitance,
  current,
  frequency,
  inductance,
  parseAndConvertSiUnit,
  resistance,
  voltage,
} from "../src/units"

test("parseAndConvertSiUnit parses bare SI prefixes with expected units", () => {
  expect(parseAndConvertSiUnit("10f", "F").value).toBeCloseTo(10e-15)
  expect(parseAndConvertSiUnit("10p", "F").value).toBeCloseTo(10e-12)
  expect(parseAndConvertSiUnit("10n", "F").value).toBeCloseTo(10e-9)
  expect(parseAndConvertSiUnit("10u", "F").value).toBeCloseTo(10e-6)
  expect(parseAndConvertSiUnit("10µ", "F").value).toBeCloseTo(10e-6)
  expect(parseAndConvertSiUnit("10m", "F").value).toBeCloseTo(0.01)
  expect(parseAndConvertSiUnit("10k", "F").value).toBeCloseTo(10000)
  expect(parseAndConvertSiUnit("10K", "F").value).toBeCloseTo(10000)
  expect(parseAndConvertSiUnit("10M", "F").value).toBeCloseTo(10000000)
  expect(parseAndConvertSiUnit("10G", "F").value).toBeCloseTo(10000000000)
  expect(parseAndConvertSiUnit("10T", "F").value).toBeCloseTo(10000000000000)
})

test("electrical unit schemas share component quantity shorthand", () => {
  expect(resistance.parse("10m")).toBe(0.01)
  expect(capacitance.parse("10m")).toBe(0.01)
  expect(inductance.parse("10m")).toBe(0.01)
  expect(voltage.parse("10m")).toBe(0.01)
  expect(current.parse("10m")).toBe(0.01)
  expect(frequency.parse("10M")).toBe(10000000)
})

test("explicit units still parse through the generic SI unit parser", () => {
  expect(capacitance.parse("10mF")).toBe(0.01)
  expect(inductance.parse("10mH")).toBe(0.01)
  expect(voltage.parse("10mV")).toBe(0.01)
  expect(current.parse("10mA")).toBe(0.01)
  expect(frequency.parse("10MHz")).toBe(10000000)
})

test("bare m remains a length unit in the generic SI parser", () => {
  expect(parseAndConvertSiUnit("10m")).toEqual({
    parsedUnit: "m",
    unitOfValue: "mm",
    value: 10000,
  })
})
