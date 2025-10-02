import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { pcb_trace_missing_error } from "../src/pcb/pcb_trace_missing_error"

test("pcb_trace_missing_error parses", () => {
  const error = pcb_trace_missing_error.parse({
    type: "pcb_trace_missing_error",
    message: "trace missing",
    source_trace_id: "st1",
    pcb_component_ids: [],
    pcb_port_ids: [],
  })
  expect(error.pcb_trace_missing_error_id).toBeDefined()
  expect(
    error.pcb_trace_missing_error_id.startsWith("pcb_trace_missing_error"),
  ).toBe(true)
})

test("any_circuit_element includes pcb_trace_missing_error", () => {
  const parsed = any_circuit_element.parse({
    type: "pcb_trace_missing_error",
    message: "trace missing",
    source_trace_id: "st1",
    pcb_component_ids: [],
    pcb_port_ids: [],
  })
  expect(parsed.type).toBe("pcb_trace_missing_error")
})
