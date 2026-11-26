import { test, expect } from "bun:test"
import { source_simple_chip } from "src/source/source_simple_chip"

test("source_simple_chip schema is defined", () => {
  expect(source_simple_chip).toBeDefined()
  expect(typeof source_simple_chip).toBe("object")
})
