import { test, expect } from "bun:test"
import { source_missing_property_error } from "src/source/source_missing_property_error"

test("source_missing_property_error schema is defined", () => {
  expect(source_missing_property_error).toBeDefined()
  expect(typeof source_missing_property_error).toBe("object")
})
