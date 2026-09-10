import { test, expect } from "bun:test"
import { source_simple_connector } from "src/source/source_simple_connector"

test("source_simple_connector schema is defined", () => {
  expect(source_simple_connector).toBeDefined()
  expect(typeof source_simple_connector).toBe("object")
})
