import { test, expect } from "bun:test"
import { source_simple_potentiometer } from "src/source/source_simple_potentiometer"

test("source_simple_potentiometer schema is defined", () => {
  expect(source_simple_potentiometer).toBeDefined()
  expect(typeof source_simple_potentiometer).toBe("object")
})

test("source_simple_potentiometer has ftype field", () => {
  expect(source_simple_potentiometer.shape.ftype).toBeDefined()
})
