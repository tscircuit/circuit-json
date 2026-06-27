import { test, expect } from "bun:test"
import { source_simple_voltage_source } from "src/source/source_simple_voltage_source"

test("source_simple_voltage_source schema is defined", () => {
  expect(source_simple_voltage_source).toBeDefined()
  expect(typeof source_simple_voltage_source).toBe("object")
})

test("source_simple_voltage_source has ftype literal", () => {
  expect(source_simple_voltage_source.shape.ftype).toBeDefined()
})
