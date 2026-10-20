import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { stimulus } from "./fixtures/simulation-ibis"
test("digital stimulus bit duration normalizes to milliseconds", () => {
  const record = any_circuit_element.parse(stimulus)
  if (record.type !== "simulation_digital_stimulus")
    throw new Error("Expected a digital stimulus")
  expect(record.bit_duration_ms).toBeCloseTo(0.0000025, 14)
  expect(record.transmission_pattern).toEqual(stimulus.transmission_pattern)
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(record)))).toEqual(
    record,
  )
})
