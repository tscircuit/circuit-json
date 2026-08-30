import { test, expect } from "bun:test"
import { source_interconnect } from "src/source/source_interconnect"

test("source_interconnect schema is defined", () => {
  expect(source_interconnect).toBeDefined()
  expect(typeof source_interconnect).toBe("object")
})
