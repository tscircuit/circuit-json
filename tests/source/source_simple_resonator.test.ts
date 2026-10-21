import { test, expect } from "bun:test"
import { source_simple_resonator } from "src/source/source_simple_resonator"

test("source_simple_resonator schema is defined", () => {
  expect(source_simple_resonator).toBeDefined()
  expect(typeof source_simple_resonator).toBe("object")
})

test("source_simple_resonator has ftype field", () => {
  expect(source_simple_resonator.shape.ftype).toBeDefined()
})
