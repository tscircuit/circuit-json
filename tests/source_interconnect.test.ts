import { test, expect } from "bun:test"
import { source_interconnect } from "../src/source/source_interconnect"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_interconnect parses", () => {
  const interconnect = source_interconnect.parse({
    type: "source_component",
    ftype: "interconnect",
    source_component_id: "interconnect1",
    name: "JP1",
  })
  expect(interconnect.ftype).toBe("interconnect")
})

test("any_circuit_element includes source_interconnect", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component",
    ftype: "interconnect",
    source_component_id: "interconnect1",
    name: "JP1",
  })

  if ("ftype" in parsed) {
    expect(parsed.ftype).toBe("interconnect")
  } else {
    throw new Error("Parsed element missing ftype")
  }
})
