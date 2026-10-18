import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { stimulus } from "./fixtures/simulation-ibis"
test("digital stimulus unit strings normalize to milliseconds", () => {
  const record = any_circuit_element.parse(stimulus)
  if (record.type !== "simulation_digital_stimulus")
    throw new Error("Expected a digital stimulus")
  expect(record.unit_interval_ms).toBeCloseTo(0.0000025, 14)
  expect(record.pattern).toEqual(stimulus.pattern)
})
