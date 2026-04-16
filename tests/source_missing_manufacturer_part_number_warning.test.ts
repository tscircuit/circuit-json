import { test, expect } from "bun:test"
import { source_missing_manufacturer_part_number_warning } from "../src/source/source_missing_manufacturer_part_number_warning"
import { any_circuit_element } from "../src/any_circuit_element"

test("source_missing_manufacturer_part_number_warning parses", () => {
  const warning = source_missing_manufacturer_part_number_warning.parse({
    type: "source_missing_manufacturer_part_number_warning",
    message:
      'Connector U1 has standard="usb_c" but no manufacturer part number',
    source_component_id: "source_component_0",
    standard: "usb_c",
  })

  expect(
    warning.source_missing_manufacturer_part_number_warning_id,
  ).toBeDefined()
  expect(
    warning.source_missing_manufacturer_part_number_warning_id.startsWith(
      "source_missing_manufacturer_part_number_warning",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_missing_manufacturer_part_number_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "source_missing_manufacturer_part_number_warning",
    message:
      'Connector U1 has standard="usb_c" but no manufacturer part number',
    source_component_id: "source_component_0",
    standard: "usb_c",
  })

  expect(parsed.type).toBe("source_missing_manufacturer_part_number_warning")
})
