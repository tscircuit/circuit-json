import { expect, test } from "bun:test"
import {
  type SourceBus,
  source_bus,
  pcb_ddr_routing_error,
  any_circuit_element,
} from "../src"

test("resolved DDR bus intent and pair polarity survive circuit JSON parsing", () => {
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
    ddr_routing: {
      profile: "ti_am335x_ddr3",
      interface_name: "MEMORY",
      signal_class: "ck",
      topology: "one_x16",
    },
  }
  expect(source_bus.parse(input)).toEqual(input)
  expect(any_circuit_element.parse(input)).toEqual(input)
})
test("DDR findings preserve unverified status and structured rule references", () => {
  const error = pcb_ddr_routing_error.parse({
    type: "pcb_ddr_routing_error",
    status: "unverified",
    rule: "reference_planes",
    specification: "SPRS717L",
    specification_section: "Table 7-62",
    message: "MEMORY requires adjacent continuous reference planes",
    source_bus_ids: [],
    source_trace_ids: [],
    pcb_trace_ids: [],
  })
  expect(any_circuit_element.parse(error)).toEqual(error)
  expect(error.error_type).toBe("pcb_ddr_routing_error")
  expect(error.status).toBe("unverified")
})
test("DDR metadata rejects non-finite electrical values and unsupported profiles", () => {
  const bus = {
    type: "source_bus",
    source_bus_id: "bus",
    source_trace_ids: ["trace"],
  }
  expect(source_bus.safeParse({ ...bus, target_impedance: NaN }).success).toBe(
    false,
  )
  expect(
    source_bus.safeParse({ ...bus, target_differential_impedance: -100 })
      .success,
  ).toBe(false)
  expect(
    source_bus.safeParse({ ...bus, ddr_routing: { profile: "guessed_ddr" } })
      .success,
  ).toBe(false)
})
