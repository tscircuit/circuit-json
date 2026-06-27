import { test, expect } from "bun:test"
import { source_failed_to_create_component_error } from "src/source/source_failed_to_create_component_error"

test("source_failed_to_create_component_error schema is defined", () => {
  expect(source_failed_to_create_component_error).toBeDefined()
  expect(typeof source_failed_to_create_component_error).toBe("object")
})
