import { test, expect } from "bun:test"
import { source_simple_pinout } from "src/source/source_simple_pinout"

test("source_simple_pinout schema is defined", () => {
  expect(source_simple_pinout).toBeDefined()
  expect(typeof source_simple_pinout).toBe("object")
})
