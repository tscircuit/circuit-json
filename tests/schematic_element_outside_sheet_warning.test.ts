import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { schematic_element_outside_sheet_warning } from "src/schematic"

test("parses a schematic element outside sheet warning", () => {
  const warningData = {
    type: "schematic_element_outside_sheet_warning" as const,
    message: "Schematic trace extends outside sheet Main",
    schematic_sheet_id: "schematic_sheet_0",
    schematic_element_type: "schematic_trace" as const,
    schematic_element_id: "schematic_trace_0",
  }

  const warning = schematic_element_outside_sheet_warning.parse(warningData)

  expect(warning.warning_type).toBe("schematic_element_outside_sheet_warning")
  expect(warning.schematic_element_outside_sheet_warning_id).toStartWith(
    "schematic_element_outside_sheet_warning_",
  )
  expect(() => any_circuit_element.parse(warningData)).not.toThrow()
})
