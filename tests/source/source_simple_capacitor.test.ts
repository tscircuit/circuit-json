import { test, expect } from "bun:test"
import { source_simple_capacitor } from "src/source/source_simple_capacitor"

test("source_simple_capacitor schema is defined", () => {
  expect(source_simple_capacitor).toBeDefined()
  expect(typeof source_simple_capacitor).toBe("object")
})

test("source_simple_capacitor has ftype literal", () => {
  expect(source_simple_capacitor.shape.ftype).toBeDefined()
})

test("source_simple_capacitor has capacitance field", () => {
  expect(source_simple_capacitor.shape.capacitance).toBeDefined()
})
