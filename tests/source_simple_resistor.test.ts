import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { source_simple_resistor } from "../src/source/source_simple_resistor"

test("source_simple_resistor parses tolerance", () => {
  const resistor = source_simple_resistor.parse({
    type: "source_component",
    ftype: "simple_resistor",
    source_component_id: "R1",
    name: "R1",
    resistance: 10_000,
    tolerance: 0.05,
  })

  expect(resistor.tolerance).toBe(0.05)
})

test("any_circuit_element includes tolerance for simple resistors", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "simple_resistor",
    source_component_id: "R1",
    name: "R1",
    resistance: 10_000,
    tolerance: 0.05,
  })

  if ("ftype" in parsed && parsed.ftype === "simple_resistor") {
    expect(parsed.tolerance).toBe(0.05)
  } else {
    throw new Error("Parsed element was not a simple resistor")
  }
})
