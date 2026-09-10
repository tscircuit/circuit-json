import { test, expect } from "bun:test"
import { source_missing_manufacturer_part_number_warning } from "src/source/source_missing_manufacturer_part_number_warning"

test("source_missing_manufacturer_part_number_warning schema is defined", () => {
  expect(source_missing_manufacturer_part_number_warning).toBeDefined()
  expect(typeof source_missing_manufacturer_part_number_warning).toBe("object")
})
