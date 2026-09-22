import { test, expect } from "bun:test"
import { source_simple_resistor } from "../src/source/source_simple_resistor"

test("source_simple_resistor accepts tolerance as a 0-1 fraction", () => {
  const resistor = source_simple_resistor.parse({
    type: "source_component",
    ftype: "simple_resistor",
    name: "R1",
    resistance: "1k",
    tolerance: 0.05,
  })

  expect(resistor.tolerance).toBe(0.05)
})

test("source_simple_resistor rejects out-of-range tolerance", () => {
  const result = source_simple_resistor.safeParse({
    type: "source_component",
    ftype: "simple_resistor",
    name: "R1",
    resistance: "1k",
    tolerance: 1.5,
  })

  expect(result.success).toBe(false)
})
