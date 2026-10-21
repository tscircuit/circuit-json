import { test, expect } from "bun:test"
import { source_group } from "src/source/source_group"

test("source_group schema is defined", () => {
  expect(source_group).toBeDefined()
  expect(typeof source_group).toBe("object")
})
