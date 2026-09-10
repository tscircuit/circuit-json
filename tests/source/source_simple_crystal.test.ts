import { test, expect } from "bun:test"
import { source_simple_crystal } from "src/source/source_simple_crystal"

test("source_simple_crystal schema is defined", () => {
  expect(source_simple_crystal).toBeDefined()
  expect(typeof source_simple_crystal).toBe("object")
})
