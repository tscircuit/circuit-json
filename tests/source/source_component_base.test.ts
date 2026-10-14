import { test, expect } from "bun:test"
import { source_component_base } from "src/source/base/source_component_base"

test("source_component_base schema is defined", () => {
  expect(source_component_base).toBeDefined()
  expect(typeof source_component_base).toBe("object")
})
