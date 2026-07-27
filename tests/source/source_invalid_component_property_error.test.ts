import { test, expect } from "bun:test"
import { source_invalid_component_property_error } from "src/source/source_invalid_component_property_error"

test("source_invalid_component_property_error schema is defined", () => {
  expect(source_invalid_component_property_error).toBeDefined()
  expect(typeof source_invalid_component_property_error).toBe("object")
})
