import { test, expect } from "bun:test"
import { source_simple_diode } from "src/source/source_simple_diode"

test("source_simple_diode schema is defined", () => {
  expect(source_simple_diode).toBeDefined()
  expect(typeof source_simple_diode).toBe("object")
})
