import { test, expect } from "bun:test"
import { source_manually_placed_via } from "src/source/source_manually_placed_via"

test("source_manually_placed_via schema is defined", () => {
  expect(source_manually_placed_via).toBeDefined()
  expect(typeof source_manually_placed_via).toBe("object")
})
