import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { schematic_sheet_styling_warning } from "src/schematic"

test("parses sheet style warnings with a required sheet reference", () => {
  const warningData = {
    type: "schematic_sheet_styling_warning" as const,
    message: 'Schematic sheet "Controller" uses a non-default size.',
    schematic_sheet_id: "schematic_sheet_0",
    styling_issue_type: "non_default_sheet_size" as const,
  }
  const warning = schematic_sheet_styling_warning.parse(warningData)
  expect(warning.warning_type).toBe("schematic_sheet_styling_warning")
  expect(warning.schematic_sheet_styling_warning_id).toStartWith(
    "schematic_sheet_styling_warning_",
  )
  expect(any_circuit_element.parse(warning)).toEqual(warning)
  expect(() =>
    schematic_sheet_styling_warning.parse({
      ...warningData,
      schematic_sheet_id: undefined,
    }),
  ).toThrow()
})
