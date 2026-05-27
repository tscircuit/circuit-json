import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { source_conflicting_i2c_addr_error } from "../src/source/source_conflicting_i2c_addr_error"

test("source_conflicting_i2c_addr_error parses", () => {
  const error = source_conflicting_i2c_addr_error.parse({
    type: "source_conflicting_i2c_addr_error",
    message: "Two TMP117 chips share the same I2C address",
    source_component_ids: ["source_component_1", "source_component_2"],
    source_port_ids: ["source_port_1", "source_port_2"],
  })

  expect(error.error_type).toBe("source_conflicting_i2c_addr_error")
  expect(error.source_conflicting_i2c_addr_error_id).toBeDefined()
  expect(
    error.source_conflicting_i2c_addr_error_id.startsWith(
      "source_conflicting_i2c_addr_error",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_conflicting_i2c_addr_error", () => {
  const parsed = any_circuit_element.parse({
    type: "source_conflicting_i2c_addr_error",
    message: "Two TMP117 chips share the same I2C address",
    source_component_ids: ["source_component_1", "source_component_2"],
  })

  expect(parsed.type).toBe("source_conflicting_i2c_addr_error")
})
