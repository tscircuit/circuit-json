import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { schematic_component_styling_warning } from "src/schematic"

test("parses a schematic component styling warning", () => {
  const warningData = {
    type: "schematic_component_styling_warning" as const,
    message: "J1 has excessive empty space above its pins",
    schematic_component_id: "schematic_component_0",
    styling_issue_type: "excessive_top_padding",
    schematic_port_ids: ["schematic_port_0", "schematic_port_1"],
    source_component_id: "source_component_0",
    schematic_sheet_id: "schematic_sheet_0",
    subcircuit_id: "subcircuit_0",
  }

  const warning = schematic_component_styling_warning.parse(warningData)

  expect(warning.warning_type).toBe("schematic_component_styling_warning")
  expect(warning.schematic_component_styling_warning_id).toStartWith(
    "schematic_component_styling_warning_",
  )
  expect(warning.styling_issue_type).toBe("excessive_top_padding")
  expect(() => any_circuit_element.parse(warningData)).not.toThrow()
})
