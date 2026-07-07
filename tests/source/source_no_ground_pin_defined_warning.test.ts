import { test, expect } from "bun:test"
import { source_no_ground_pin_defined_warning } from "src/source/source_no_ground_pin_defined_warning"

test("source_no_ground_pin_defined_warning schema is defined", () => {
  expect(source_no_ground_pin_defined_warning).toBeDefined()
  expect(typeof source_no_ground_pin_defined_warning).toBe("object")
})
