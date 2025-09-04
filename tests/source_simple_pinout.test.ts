import { test, expect } from "bun:test"
import { source_simple_pinout } from "../src/source/source_simple_pinout"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_simple_pinout parses", () => {
  const pinout = source_simple_pinout.parse({
    type: "source_component",
    ftype: "simple_pinout",
    source_component_id: "pinout1",
    name: "P1",
  })
  expect(pinout.ftype).toBe("simple_pinout")
})

test("any_circuit_element includes source_simple_pinout", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "simple_pinout",
    source_component_id: "pinout1",
    name: "P1",
  })
  expect(parsed.ftype).toBe("simple_pinout")
})
