import { test, expect } from "bun:test"
import { source_simple_inductor } from "../src/source/source_simple_inductor"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_simple_inductor parse preserves display_inductance", () => {
  const inductor = source_simple_inductor.parse({
    type: "source_component",
    ftype: "simple_inductor",
    source_component_id: "L1",
    name: "L1",
    inductance: 10,
    display_inductance: "10uH",
    max_current_rating: 1.2,
  })

  expect(inductor.ftype).toBe("simple_inductor")
  expect(inductor.inductance).toBe(10)
  expect(inductor.display_inductance).toBe("10uH")
  expect(inductor.max_current_rating).toBe(1.2)
})

test("any_circuit_element includes display_inductance for simple inductors", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "simple_inductor",
    source_component_id: "L1",
    name: "L1",
    inductance: 10,
    display_inductance: "10uH",
  })

  if ("ftype" in parsed && parsed.ftype === "simple_inductor") {
    expect(parsed.display_inductance).toBe("10uH")
  } else {
    throw new Error("Parsed element was not a simple inductor")
  }
})
