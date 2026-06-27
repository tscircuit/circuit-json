import { test, expect } from "bun:test"
import { source_property_ignored_warning } from "src/source/source_property_ignored_warning"

test("source_property_ignored_warning schema is defined", () => {
  expect(source_property_ignored_warning).toBeDefined()
  expect(typeof source_property_ignored_warning).toBe("object")
})
