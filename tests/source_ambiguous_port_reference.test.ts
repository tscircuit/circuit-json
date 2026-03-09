import { test, expect } from "bun:test"
import { source_ambiguous_port_reference } from "../src/source/source_ambiguous_port_reference"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_ambiguous_port_reference parses", () => {
  const error = source_ambiguous_port_reference.parse({
    type: "source_ambiguous_port_reference",
    message: "U1.SH is ambiguous: matches multiple non-overlapping pads",
  })
  expect(error.source_ambiguous_port_reference_id).toBeDefined()
  expect(
    error.source_ambiguous_port_reference_id.startsWith(
      "source_ambiguous_port_reference",
    ),
  ).toBe(true)
  expect(error.error_type).toBe("source_ambiguous_port_reference")
})

test("source_ambiguous_port_reference parses with optional fields", () => {
  const error = source_ambiguous_port_reference.parse({
    type: "source_ambiguous_port_reference",
    message: "U1.SH is ambiguous",
    source_port_id: "source_port_1",
    source_component_id: "source_component_1",
  })
  expect(error.source_port_id).toBe("source_port_1")
  expect(error.source_component_id).toBe("source_component_1")
})

test("any_circuit_element includes source_ambiguous_port_reference", () => {
  const parsed = any_circuit_element.parse({
    type: "source_ambiguous_port_reference",
    message: "U1.SH is ambiguous: matches multiple non-overlapping pads",
  })
  expect(parsed.type).toBe("source_ambiguous_port_reference")
})
