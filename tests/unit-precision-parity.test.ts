import { expect, test } from "bun:test"
import {
  capacitance,
  frequency,
  inductance,
  resistance,
  voltage,
} from "../src/units"

test("SI unit schemas round to the same precision as capacitance", () => {
  expect(inductance.parse("10uH")).toBe(0.00001)
  expect(capacitance.parse("10uF")).toBe(0.00001)

  expect(inductance.parse("100nH")).toBe(1e-7)
  expect(capacitance.parse("100nF")).toBe(1e-7)

  expect(voltage.parse("10uV")).toBe(0.00001)
  expect(frequency.parse("10uHz")).toBe(0.00001)
  expect(resistance.parse("10uΩ")).toBe(0.00001)
})

test("SI unit schemas keep ordinary values untouched", () => {
  expect(resistance.parse("4.7k")).toBe(4700)
  expect(resistance.parse(0.07)).toBe(0.07)
  expect(inductance.parse("4.7mH")).toBe(0.0047)
  expect(capacitance.parse("100nF")).toBe(1e-7)
  expect(voltage.parse("3.3V")).toBe(3.3)
  expect(frequency.parse("16MHz")).toBe(16000000)
})

test("unparseable values still come through as NaN rather than throwing", () => {
  for (const schema of [resistance, inductance, capacitance, voltage, frequency]) {
    expect(schema.parse("not-a-number")).toBeNaN()
  }
})
