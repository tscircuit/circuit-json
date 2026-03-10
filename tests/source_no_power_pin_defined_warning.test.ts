import { test, expect } from "bun:test"
import { source_no_power_pin_defined_warning } from "../src/source/source_no_power_pin_defined_warning"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_no_power_pin_defined_warning parses", () => {
  const warning = source_no_power_pin_defined_warning.parse({
    type: "source_no_power_pin_defined_warning",
    message: "U1 has no pin with requires_power=true",
    source_component_id: "source_component_0",
    source_port_ids: ["source_port_0", "source_port_1"],
  })

  expect(warning.source_no_power_pin_defined_warning_id).toBeDefined()
  expect(
    warning.source_no_power_pin_defined_warning_id.startsWith(
      "source_no_power_pin_defined_warning",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_no_power_pin_defined_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "source_no_power_pin_defined_warning",
    message: "U1 has no pin with requires_power=true",
    source_component_id: "source_component_0",
    source_port_ids: ["source_port_0", "source_port_1"],
  })

  expect(parsed.type).toBe("source_no_power_pin_defined_warning")
})
