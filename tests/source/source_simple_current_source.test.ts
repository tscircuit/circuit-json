import { test, expect } from "bun:test"
import { source_simple_current_source } from "src/source/source_simple_current_source"

test("source_simple_current_source schema is defined", () => {
  expect(source_simple_current_source).toBeDefined()
  expect(typeof source_simple_current_source).toBe("object")
})

test("source_simple_current_source has ftype literal", () => {
  expect(source_simple_current_source.shape.ftype).toBeDefined()
})
