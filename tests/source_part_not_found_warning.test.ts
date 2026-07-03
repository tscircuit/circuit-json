import { test, expect } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { source_part_not_found_warning } from "../src/source/source_part_not_found_warning"

test("source_part_not_found_warning parses", () => {
  const warning = source_part_not_found_warning.parse({
    type: "source_part_not_found_warning",
    message: "Could not find part NE555P",
    source_component_id: "source_component_0",
    manufacturer_part_number: "NE555P",
  })

  expect(warning.type).toBe("source_part_not_found_warning")
  expect(warning.warning_type).toBe("source_part_not_found_warning")
  expect(warning.message).toContain("NE555P")
  expect(warning.source_component_id).toBe("source_component_0")
  expect(warning.manufacturer_part_number).toBe("NE555P")
  expect(warning.source_part_not_found_warning_id).toBeDefined()
  expect(
    warning.source_part_not_found_warning_id.startsWith(
      "source_part_not_found_warning",
    ),
  ).toBe(true)
})

test("any_circuit_element includes source_part_not_found_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "source_part_not_found_warning",
    message: "Could not find supplier part C12345",
    supplier_name: "jlcpcb",
    supplier_part_number: "C12345",
  })

  expect(parsed.type).toBe("source_part_not_found_warning")
})
