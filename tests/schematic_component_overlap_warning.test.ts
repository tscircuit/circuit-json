import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { schematic_component_overlap_warning } from "src/schematic"

test("parses a schematic component overlap warning", () => {
  const warningData = {
    type: "schematic_component_overlap_warning" as const,
    message: "Schematic components R1 and R2 overlap",
    schematic_component_ids: [
      "schematic_component_0",
      "schematic_component_1",
    ] as [string, string],
    schematic_sheet_id: "schematic_sheet_0",
  }

  const warning = schematic_component_overlap_warning.parse(warningData)

  expect(warning.warning_type).toBe("schematic_component_overlap_warning")
  expect(warning.schematic_component_overlap_warning_id).toStartWith(
    "schematic_component_overlap_warning_",
  )
  expect(() => any_circuit_element.parse(warningData)).not.toThrow()
})
