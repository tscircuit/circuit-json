import { expect, test } from "bun:test"
import { source_missing_manufacturer_part_number_warning } from "src/source/source_missing_manufacturer_part_number_warning"

test("missing MPN warnings support components without a connector standard", () => {
  const warning = {
    type: "source_missing_manufacturer_part_number_warning" as const,
    message: "U1 is missing a manufacturer part number",
    source_component_id: "source_component_1",
  }
  const parsed = source_missing_manufacturer_part_number_warning.parse(warning)
  expect(parsed.standard).toBeUndefined()
  expect(parsed.warning_type).toBe(warning.type)
  expect(parsed.source_component_id).toBe(warning.source_component_id)
  expect(
    source_missing_manufacturer_part_number_warning.parse({
      ...warning,
      standard: "usb_c",
    }).standard,
  ).toBe("usb_c")
  expect(
    source_missing_manufacturer_part_number_warning.safeParse({
      ...warning,
      standard: 123,
    }).success,
  ).toBe(false)
})
