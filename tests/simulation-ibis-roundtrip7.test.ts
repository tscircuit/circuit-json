import { expect, test } from "bun:test"
import { any_circuit_element } from "../src"
import { stimulus } from "./fixtures/simulation-ibis"

test("digital stimulus accepts an array of binary bits", () => {
  const bits: Array<0 | 1> = [0, 1, 0, 1]
  const transmission_pattern = {
    transmission_type: "bits" as const,
    bits,
    repeat: false,
  }
  const record = any_circuit_element.parse({
    ...stimulus,
    transmission_pattern,
  })
  if (record.type !== "simulation_digital_stimulus")
    throw new Error("Expected a digital stimulus")
  expect(record.transmission_pattern).toEqual(transmission_pattern)
})
