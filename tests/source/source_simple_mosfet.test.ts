import { test, expect } from "bun:test"
import { source_simple_mosfet } from "src/source/source_simple_mosfet"

test("source_simple_mosfet schema is defined", () => {
  expect(source_simple_mosfet).toBeDefined()
  expect(typeof source_simple_mosfet).toBe("object")
})
