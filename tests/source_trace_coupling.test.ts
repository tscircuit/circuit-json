import { expect, test } from "bun:test"
import { any_circuit_element, source_trace } from "../src"

const trace = {
  type: "source_trace" as const,
  source_trace_id: "a",
  connected_source_port_ids: [],
  connected_source_net_ids: [],
  coupled_source_trace_id: "b",
  max_coupling_distance: 0.2,
  max_uncoupled_length: 0,
}
test("coupling constraints survive the generic Circuit JSON schema", () => {
  expect(any_circuit_element.parse(trace)).toEqual(trace)
})
test("distances must be finite and nonnegative", () => {
  for (const key of ["max_coupling_distance", "max_uncoupled_length"]) {
    for (const value of [-1, Infinity, NaN]) {
      expect(source_trace.safeParse({ ...trace, [key]: value }).success).toBe(
        false,
      )
    }
  }
  expect(
    source_trace.safeParse({ ...trace, coupled_source_trace_id: "" }).success,
  ).toBe(false)
})
test("old traces remain valid without coupling constraints", () => {
  const {
    coupled_source_trace_id,
    max_coupling_distance,
    max_uncoupled_length,
    ...old
  } = trace
  expect(source_trace.parse(old)).toEqual(old)
})
test("uncoupled length errors are registered and retain measured values", () => {
  const error = {
    type: "pcb_trace_uncoupled_length_error",
    source_trace_id: "a",
    coupled_source_trace_id: "b",
    pcb_trace_ids: ["pcb_a"],
    actual_uncoupled_length: 4,
    maximum_uncoupled_length: 3,
    message: "Trace exceeds uncoupled length",
    subcircuit_id: "board",
  }
  expect(any_circuit_element.parse(error)).toMatchObject({
    ...error,
    error_type: error.type,
  })
  for (const key of ["actual_uncoupled_length", "maximum_uncoupled_length"]) {
    for (const value of [-1, Infinity, NaN]) {
      expect(
        any_circuit_element.safeParse({ ...error, [key]: value }).success,
      ).toBe(false)
    }
  }
})
