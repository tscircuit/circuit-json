import { test, expect } from "bun:test"
import { source_simple_voltage_probe } from "src/source/source_simple_voltage_probe"

test("source_simple_voltage_probe schema is defined", () => {
  expect(source_simple_voltage_probe).toBeDefined()
  expect(typeof source_simple_voltage_probe).toBe("object")
})
