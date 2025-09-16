import { test, expect } from "bun:test"
import { circuit_json_footprint_load_error } from "../src/pcb/circuit_json_footprint_load_error"
import { any_circuit_element } from "../src/any_circuit_element"

test("circuit_json_footprint_load_error parses", () => {
  const error = circuit_json_footprint_load_error.parse({
    type: "circuit_json_footprint_load_error",
    message: "failed to load JSON footprint",
    pcb_component_id: "pcb1",
    source_component_id: "src1",
  })
  expect(error.circuit_json_footprint_load_error_id).toBeDefined()
  expect(
    error.circuit_json_footprint_load_error_id.startsWith(
      "circuit_json_footprint_load_error",
    ),
  ).toBe(true)
})

test("any_circuit_element includes circuit_json_footprint_load_error", () => {
  const parsed = any_circuit_element.parse({
    type: "circuit_json_footprint_load_error",
    message: "failed to load JSON footprint",
    pcb_component_id: "pcb1",
    source_component_id: "src1",
  })
  expect(parsed.type).toBe("circuit_json_footprint_load_error")
})
