import { test, expect } from "bun:test"
import { source_simple_battery } from "src/source/source_simple_battery"

test("source_simple_battery schema is defined", () => {
  expect(source_simple_battery).toBeDefined()
  expect(typeof source_simple_battery).toBe("object")
})
