import { test, expect } from "bun:test"
import { source_component_internal_connection } from "src/source/source_component_internal_connection"

test("source_component_internal_connection schema is defined", () => {
  expect(source_component_internal_connection).toBeDefined()
  expect(typeof source_component_internal_connection).toBe("object")
})
