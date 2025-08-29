import { test, expect } from "bun:test"
import { source_pin_missing_trace_warning } from "../src/source/source_pin_missing_trace_warning"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_pin_missing_trace_warning parses", () => {
  const warning = source_pin_missing_trace_warning.parse({
    type: "source_pin_missing_trace_warning",
    message: "pin missing trace",
    source_component_id: "comp1",
    source_pin_id: "pin1",
  })
  expect(warning.source_pin_missing_trace_warning_id).toBeDefined()
  expect(
    warning.source_pin_missing_trace_warning_id.startsWith(
      "source_pin_missing_trace_warning",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_pin_missing_trace_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "source_pin_missing_trace_warning",
    message: "pin missing trace",
    source_component_id: "comp1",
    source_pin_id: "pin1",
  })
  expect(parsed.type).toBe("source_pin_missing_trace_warning")
})
