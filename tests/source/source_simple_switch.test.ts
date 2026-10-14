import { test, expect } from "bun:test"
import { source_simple_switch } from "src/source/source_simple_switch"

test("source_simple_switch schema is defined", () => {
  expect(source_simple_switch).toBeDefined()
  expect(typeof source_simple_switch).toBe("object")
})
