import { test, expect } from "bun:test"
import { source_component_pins_underspecified_warning } from "../src/source/source_component_pins_underspecified_warning"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_component_pins_underspecified_warning parses", () => {
  const warning = source_component_pins_underspecified_warning.parse({
    type: "source_component_pins_underspecified_warning",
    message: "All pins on U1 are underspecified",
    source_component_id: "source_component_0",
    source_port_ids: ["source_port_0", "source_port_1"],
  })

  expect(warning.source_component_pins_underspecified_warning_id).toBeDefined()
  expect(
    warning.source_component_pins_underspecified_warning_id.startsWith(
      "source_component_pins_underspecified_warning",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_component_pins_underspecified_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "source_component_pins_underspecified_warning",
    message: "All pins on U1 are underspecified",
    source_component_id: "source_component_0",
    source_port_ids: ["source_port_0", "source_port_1"],
  })

  expect(parsed.type).toBe("source_component_pins_underspecified_warning")
})
