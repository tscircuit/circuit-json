import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { schematic_text_overlap_warning } from "src/schematic"

test("parses a schematic text overlap warning", () => {
  const warningData = {
    type: "schematic_text_overlap_warning" as const,
    message: 'Schematic text "Power" overlaps "MCU"',
    schematic_text_ids: ["schematic_text_0", "schematic_text_1"] as [
      string,
      string,
    ],
    schematic_sheet_id: "schematic_sheet_0",
    subcircuit_id: "subcircuit_0",
  }

  const warning = schematic_text_overlap_warning.parse(warningData)

  expect(warning.warning_type).toBe("schematic_text_overlap_warning")
  expect(warning.schematic_text_overlap_warning_id).toStartWith(
    "schematic_text_overlap_warning_",
  )
  expect(() => any_circuit_element.parse(warningData)).not.toThrow()
})
