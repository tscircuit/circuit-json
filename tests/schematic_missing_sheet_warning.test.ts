import { expect, test } from "bun:test"
import { any_circuit_element, schematic_missing_sheet_warning } from "../src"

test("parses a missing sheet warning without a component target", () => {
  const input = {
    type: "schematic_missing_sheet_warning" as const,
    message: "No <schematicsheet> was found.",
  }
  const warning = schematic_missing_sheet_warning.parse(input)
  expect(warning.warning_type).toBe("schematic_missing_sheet_warning")
  expect(warning.schematic_missing_sheet_warning_id).toStartWith(
    "schematic_missing_sheet_warning_",
  )
  expect(any_circuit_element.parse(warning)).toEqual(warning)
  expect(warning).not.toHaveProperty("schematic_component_id")
  expect(warning).not.toHaveProperty("source_component_id")
  expect(warning).not.toHaveProperty("subcircuit_id")
  expect(
    schematic_missing_sheet_warning.safeParse({ ...input, message: undefined })
      .success,
  ).toBe(false)
})
