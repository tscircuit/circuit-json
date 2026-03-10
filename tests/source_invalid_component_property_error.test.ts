import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { source_invalid_component_property_error } from "../src/source/source_invalid_component_property_error"

test("source_invalid_component_property_error parses", () => {
  const error = source_invalid_component_property_error.parse({
    type: "source_invalid_component_property_error",
    message: "Property resistance must be a positive number",
    source_component_id: "source_component_0",
    property_name: "resistance",
    property_value: "abc",
    expected_format: "positive number",
  })

  expect(error.source_invalid_component_property_error_id).toBeDefined()
  expect(
    error.source_invalid_component_property_error_id.startsWith(
      "source_invalid_component_property_error",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_invalid_component_property_error", () => {
  const parsed = any_circuit_element.parse({
    type: "source_invalid_component_property_error",
    message: "Property resistance must be a positive number",
    source_component_id: "source_component_0",
    property_name: "resistance",
    property_value: "abc",
  })

  expect(parsed.type).toBe("source_invalid_component_property_error")
})
