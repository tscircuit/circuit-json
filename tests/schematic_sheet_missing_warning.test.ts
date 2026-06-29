import { expect, test } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"
import { schematic_sheet_missing_warning } from "../src/schematic/schematic_sheet_missing_warning"

test("schematic_sheet_missing_warning parses", () => {
  const warning = schematic_sheet_missing_warning.parse({
    type: "schematic_sheet_missing_warning",
    message:
      'U1 references schSheetName "Sheet B" but no matching schematic sheet was found.',
    sheet_name: "Sheet B",
    source_component_id: "source_component_0",
    schematic_component_id: "schematic_component_0",
  })

  expect(warning.schematic_sheet_missing_warning_id).toBeDefined()
  expect(
    warning.schematic_sheet_missing_warning_id.startsWith(
      "schematic_sheet_missing_warning",
    ),
  ).toBe(true)
  // warning_type defaults from the literal
  expect(warning.warning_type).toBe("schematic_sheet_missing_warning")
  expect(warning.sheet_name).toBe("Sheet B")
})

test("any_circuit_element includes schematic_sheet_missing_warning", () => {
  const parsed = any_circuit_element.parse({
    type: "schematic_sheet_missing_warning",
    message:
      'U1 references schSheetName "Sheet B" but no matching schematic sheet was found.',
    sheet_name: "Sheet B",
    source_component_id: "source_component_0",
  })

  expect(parsed.type).toBe("schematic_sheet_missing_warning")
})
