import { expect, test } from "bun:test"
import { any_circuit_element, pcb_trace } from "../src"

test("antenna markers reject non-boolean values without coercion", () => {
  for (const is_antenna_trace of ["true", "false", 1, 0, null]) {
    const trace = { type: "pcb_trace", route: [], is_antenna_trace }
    expect(pcb_trace.safeParse(trace).success).toBe(false)
    expect(any_circuit_element.safeParse(trace).success).toBe(false)
  }
})
