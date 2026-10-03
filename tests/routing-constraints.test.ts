import { expect, test } from "bun:test"
import {
  type SourceBus,
  source_bus,
  pcb_routing_constraint_error,
  any_circuit_element,
} from "../src"

test("resolved routing constraints and pair polarity survive circuit JSON parsing", () => {
  const input: SourceBus = {
    type: "source_bus",
    source_bus_id: "source_bus_1",
    name: "CLOCK",
    source_trace_ids: ["clock_plus", "clock_minus"],
    target_differential_impedance: 120,
    differential_pair: {
      positive_source_trace_id: "clock_plus",
      negative_source_trace_id: "clock_minus",
      trace_gap: 0.12,
    },
    routing_constraints: {
      expected_trace_count: 2,
      length_bounds: { min: 10, max: 20 },
    },
  }
  expect(source_bus.parse(input)).toEqual(input)
  expect(any_circuit_element.parse(input)).toEqual(input)
})
test("Routing findings preserve unverified status and structured rule references", () => {
  const error = pcb_routing_constraint_error.parse({
    type: "pcb_routing_constraint_error",
    status: "unverified",
    rule: "reference_planes",
    message: "MEMORY requires adjacent continuous reference planes",
    source_bus_ids: [],
    source_trace_ids: [],
    pcb_trace_ids: [],
  })
  expect(any_circuit_element.parse(error)).toEqual(error)
  expect(error.error_type).toBe("pcb_routing_constraint_error")
  expect(error.status).toBe("unverified")
})
test("constraints reject invalid bounds and non-finite electrical values", () => {
  const bus = {
    type: "source_bus",
    source_bus_id: "bus",
    source_trace_ids: ["trace"],
  }
  for (const routing_constraints of [
    { length_bounds: { min: 20, max: 10 } },
    { length_bounds: { max: -1 } },
    { length_bounds: { reference_bus: "other", max: 0 } },
    {
      spacing: [
        {
          other_bus: "other",
          centerline_width_multiplier: 3,
          reduced_centerline_width_multiplier: 1,
        },
      ],
    },
  ])
    expect(source_bus.safeParse({ ...bus, routing_constraints }).success).toBe(
      false,
    )
  expect(source_bus.safeParse({ ...bus, target_impedance: NaN }).success).toBe(
    false,
  )
})
