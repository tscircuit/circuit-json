import { expect, test } from "bun:test"
import { any_circuit_element, pcb_trace } from "../src"

test("pcb_trace preserves an optional antenna marker", () => {
  const trace = { type: "pcb_trace", route: [] }
  expect(pcb_trace.parse(trace)).not.toHaveProperty("is_antenna_trace")
  expect(pcb_trace.parse({ ...trace, is_antenna_trace: true })).toHaveProperty(
    "is_antenna_trace",
    true,
  )
  expect(pcb_trace.parse({ ...trace, is_antenna_trace: false })).toHaveProperty(
    "is_antenna_trace",
    false,
  )
})

test("antenna markers survive the public Circuit JSON parser and JSON roundtrip", () => {
  for (const is_antenna_trace of [true, false]) {
    const trace = { type: "pcb_trace", route: [], is_antenna_trace }
    const parsed = any_circuit_element.parse(trace)
    expect(parsed).toHaveProperty("is_antenna_trace", is_antenna_trace)
    expect(
      any_circuit_element.parse(JSON.parse(JSON.stringify(parsed))),
    ).toEqual(parsed)
  }
})

test("antenna markers reject non-boolean values without coercion", () => {
  for (const is_antenna_trace of ["true", "false", 1, 0, null]) {
    const trace = { type: "pcb_trace", route: [], is_antenna_trace }
    expect(pcb_trace.safeParse(trace).success).toBe(false)
    expect(any_circuit_element.safeParse(trace).success).toBe(false)
  }
})
