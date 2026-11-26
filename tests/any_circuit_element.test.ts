import { test, expect } from "bun:test"
import { any_circuit_element } from "../src/any_circuit_element"

test("any_circuit_element schema is defined", () => {
  expect(any_circuit_element).toBeDefined()
})

test("any_circuit_element can validate pcb_trace", () => {
  const result = any_circuit_element.safeParse({
    type: "pcb_trace",
    trace: { route: [] },
  })
  expect(result.success).toBe(false) // needs proper format
})
