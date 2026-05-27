import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { source_component_misconfigured_error } from "../src/source/source_component_misconfigured_error"

test("source_component_misconfigured_error parses", () => {
  const error = source_component_misconfigured_error.parse({
    type: "source_component_misconfigured_error",
    message: "Two TMP117 chips share the same I2C address",
    source_component_ids: ["source_component_1", "source_component_2"],
    source_port_ids: ["source_port_1", "source_port_2"],
  })

  expect(error.error_type).toBe("source_component_misconfigured_error")
  expect(error.source_component_misconfigured_error_id).toBeDefined()
  expect(
    error.source_component_misconfigured_error_id.startsWith(
      "source_component_misconfigured_error",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_component_misconfigured_error", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component_misconfigured_error",
    message: "Two TMP117 chips share the same I2C address",
    source_component_ids: ["source_component_1", "source_component_2"],
  })

  expect(parsed.type).toBe("source_component_misconfigured_error")
})
