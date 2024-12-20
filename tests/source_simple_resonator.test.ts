import { expect, test } from "bun:test"
import { source_simple_resonator } from "../src/source/source_simple_resonator"

test("source_simple_resonator schema validation", () => {
  const validResonator = {
    type: "source_component",
    source_component_id: "resonator_1",
    name: "Test Resonator",
    ftype: "simple_resonator",
    frequency: "50MHz",
    load_capacitance: "10pF",
    pin_count: 3,
  }

  const parsed = source_simple_resonator.parse(validResonator)
  expect(parsed.frequency).toBe(50000000) // 50 MHz in Hz
  expect(parsed.load_capacitance).toBe("10pF")
})

test("invalid frequency unit", () => {
  const invalidResonator = {
    type: "source_component",
    source_component_id: "resonator_2",
    name: "Invalid Resonator",
    ftype: "simple_resonator",
    frequency: "50lightyears",
    load_capacitance: "10pF",
    pin_count: 3,
  }

  expect(() => source_simple_resonator.parse(invalidResonator)).toThrow()
})
