import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { external_footprint_load_error } from "../src/pcb/external_footprint_load_error"

test("external_footprint_load_error parses", () => {
  const error = external_footprint_load_error.parse({
    type: "external_footprint_load_error",
    message: "failed to load footprint",
    pcb_component_id: "pcb1",
    source_component_id: "src1",
  })
  expect(error.external_footprint_load_error_id).toBeDefined()
  expect(
    error.external_footprint_load_error_id.startsWith(
      "external_footprint_load_error",
    ),
  ).toBe(true)
})

test("any_circuit_element includes external_footprint_load_error", () => {
  const parsed = any_circuit_element.parse({
    type: "external_footprint_load_error",
    message: "failed to load footprint",
    pcb_component_id: "pcb1",
    source_component_id: "src1",
  })
  expect(parsed.type).toBe("external_footprint_load_error")
})
