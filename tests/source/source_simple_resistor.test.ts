import { test, expect } from "bun:test"
import { source_simple_resistor } from "src/source/source_simple_resistor"

test("source_simple_resistor schema is defined", () => {
  expect(source_simple_resistor).toBeDefined()
  expect(typeof source_simple_resistor).toBe("object")
})

test("source_simple_resistor has ftype literal", () => {
  expect(source_simple_resistor.shape).toBeDefined()
  expect(source_simple_resistor.shape.ftype).toBeDefined()
})

test("source_simple_resistor has resistance field", () => {
  expect(source_simple_resistor.shape.resistance).toBeDefined()
})
