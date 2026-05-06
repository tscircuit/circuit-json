import { test, expect } from "bun:test"
import { source_simple_led } from "src/source/source_simple_led"

test("source_simple_led schema is defined", () => {
  expect(source_simple_led).toBeDefined()
  expect(typeof source_simple_led).toBe("object")
})
