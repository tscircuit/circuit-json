import { test, expect } from "bun:test"
import { json_footprint_load_error } from "../src/pcb/json_footprint_load_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("json_footprint_load_error parses", () => {
  const error = json_footprint_load_error.parse({
    type: "json_footprint_load_error",
    message: "failed to load JSON footprint",
    pcb_component_id: "pcb1",
    source_component_id: "src1",
  })
  expect(error.json_footprint_load_error_id).toBeDefined()
  expect(
    error.json_footprint_load_error_id.startsWith("json_footprint_load_error"),
  ).toBe(true)
})

test("any_circuit_element includes json_footprint_load_error", () => {
  const parsed = any_circuit_element.parse({
    type: "json_footprint_load_error",
    message: "failed to load JSON footprint",
    pcb_component_id: "pcb1",
    source_component_id: "src1",
  })
  expect(parsed.type).toBe("json_footprint_load_error")
})
