import { test, expect } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { supplier_footprint_mismatch_warning } from "../src/pcb/supplier_footprint_mismatch_warning"

test("supplier_footprint_mismatch_warning parses", () => {
  const warning = supplier_footprint_mismatch_warning.parse({
    type: "supplier_footprint_mismatch_warning",
    message: "supplier footprint does not match expected footprint",
    source_component_id: "src1",
    supplier_name: "jlcpcb",
    supplier_part_number: "C123",
    supplier_footprint_url: "https://example.com/footprints/C123.json",
    footprint_copper_intersection_over_union: 0.42,
  })

  expect(warning.supplier_footprint_mismatch_warning_id).toBeDefined()
  expect(
    warning.supplier_footprint_mismatch_warning_id.startsWith(
      "supplier_footprint_mismatch_warning",
    ),
  ).toBe(true)
  expect(warning.warning_type).toBe("supplier_footprint_mismatch_warning")
})

test("any_circuit_element includes supplier_footprint_mismatch_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "supplier_footprint_mismatch_warning",
    message: "supplier footprint does not match expected footprint",
    source_component_id: "src1",
    footprint_copper_intersection_over_union: 0.42,
  })

  expect(parsed.type).toBe("supplier_footprint_mismatch_warning")
})
