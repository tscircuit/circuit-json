import { expect, test } from "bun:test"
import { any_circuit_element, source_bus } from "../src"

test("source_bus preserves resolved membership and skew in Circuit JSON", () => {
  const bus = {
    type: "source_bus" as const,
    source_bus_id: "bus_1",
    name: "data",
    source_trace_ids: ["a", "b"],
    max_length_skew: 0,
    subcircuit_id: "board",
  }
  expect(any_circuit_element.parse(bus)).toEqual(bus)
})

test("bus skew must be finite and nonnegative, and membership nonempty", () => {
  for (const max_length_skew of [-1, Infinity, NaN]) {
    expect(
      source_bus.safeParse({
        type: "source_bus",
        source_bus_id: "bus",
        source_trace_ids: ["a"],
        max_length_skew,
      }).success,
    ).toBe(false)
  }
  expect(
    source_bus.safeParse({
      type: "source_bus",
      source_bus_id: "bus",
      source_trace_ids: [],
    }).success,
  ).toBe(false)
})

test("length errors survive the generic element schema", () => {
  expect(
    any_circuit_element.parse({
      type: "pcb_bus_length_skew_error",
      source_bus_id: "bus",
      source_trace_ids: ["a", "b"],
      pcb_trace_ids: ["pcb_a", "pcb_b"],
      actual_length_skew: 2,
      maximum_length_skew: 1,
      message: "Bus exceeds skew",
    }).type,
  ).toBe("pcb_bus_length_skew_error")
  expect(
    any_circuit_element.parse({
      type: "pcb_trace_too_long_error",
      pcb_trace_id: "pcb_a",
      actual_trace_length: 12,
      maximum_trace_length: 10,
      message: "Trace exceeds length",
    }).type,
  ).toBe("pcb_trace_too_long_error")
})
