import { test, expect } from "bun:test"
import { pcb_port_hint_ambiguous_error } from "../src/pcb/pcb_port_hint_ambiguous_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("pcb_port_hint_ambiguous_error parses", () => {
  const error = pcb_port_hint_ambiguous_error.parse({
    type: "pcb_port_hint_ambiguous_error",
    message: "U1.SH is ambiguous: matches multiple non-overlapping pads",
  })
  expect(error.pcb_port_hint_ambiguous_error_id).toBeDefined()
  expect(
    error.pcb_port_hint_ambiguous_error_id.startsWith(
      "pcb_port_hint_ambiguous_error",
    ),
  ).toBe(true)
  expect(error.error_type).toBe("pcb_port_hint_ambiguous_error")
})

test("pcb_port_hint_ambiguous_error parses with optional fields", () => {
  const error = pcb_port_hint_ambiguous_error.parse({
    type: "pcb_port_hint_ambiguous_error",
    message: "U1.SH is ambiguous",
    source_port_id: "source_port_1",
    pcb_component_id: "pcb_component_1",
  })
  expect(error.source_port_id).toBe("source_port_1")
  expect(error.pcb_component_id).toBe("pcb_component_1")
})

test("any_circuit_element includes pcb_port_hint_ambiguous_error", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_port_hint_ambiguous_error",
    message: "U1.SH is ambiguous: matches multiple non-overlapping pads",
  })
  expect(parsed.type).toBe("pcb_port_hint_ambiguous_error")
})
