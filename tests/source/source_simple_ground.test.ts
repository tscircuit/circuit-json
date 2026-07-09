import { test, expect } from "bun:test"
import { source_simple_ground } from "src/source/source_simple_ground"

test("source_simple_ground schema is defined", () => {
  expect(source_simple_ground).toBeDefined()
  expect(typeof source_simple_ground).toBe("object")
})
