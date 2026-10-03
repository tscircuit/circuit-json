import { expect, test } from "bun:test"
import {
  type SourceBus,
  source_bus,
  pcb_trace_error,
  pcb_trace_warning,
  any_circuit_element,
} from "../src"

test("flat bus constraints preserve resolved references without changing membership", () => {
  const input: SourceBus = {
    type: "source_bus",
    source_bus_id: "source_bus_1",
    name: "DATA",
    source_trace_ids: ["data_0", "data_1"],
    length_match_source_trace_ids: ["strobe_plus", "strobe_minus"],
    max_length_skew: 0.635,
    max_length: { reference: "longest_manhattan" },
    pcb_trace_spacing: { width_multiplier: 3 },
    pcb_spacing_to_other_signals: { width_multiplier: 4 },
    target_impedance: 62.5,
    target_impedance_min: 50,
    target_impedance_max: 75,
  }
  expect(source_bus.parse(input)).toEqual(input)
  expect(any_circuit_element.parse(input)).toEqual(input)
  expect(source_bus.parse(input).source_trace_ids).toEqual(["data_0", "data_1"])
})

test("pair polarity and explicit shared length references survive serialization", () => {
  const input: SourceBus = {
    type: "source_bus",
    source_bus_id: "clock_pair",
    source_trace_ids: ["clock_plus", "clock_minus"],
    target_length: {
      reference: "longest_manhattan",
      source_trace_ids: ["address_0", "clock_plus", "clock_minus"],
      offset: 7.62,
    },
    length_tolerance: 1.27,
    min_length: 10,
    max_length: 30,
    pcb_spacing_to_other_signals: 0.4,
    target_differential_impedance: 125,
    target_differential_impedance_min: 100,
    target_differential_impedance_max: 150,
    differential_pair: {
      positive_source_trace_id: "clock_plus",
      negative_source_trace_id: "clock_minus",
      trace_gap: 0.12,
      max_uncoupled_length: 0.5,
    },
  }
  expect(any_circuit_element.parse(JSON.parse(JSON.stringify(input)))).toEqual(
    input,
  )
})

test("routing violations reuse existing trace errors with structured measurements", () => {
  const error = pcb_trace_error.parse({
    type: "pcb_trace_error",
    message: "DATA exceeds its maximum routed length",
    pcb_trace_id: "pcb_trace_1",
    source_trace_id: "data_0",
    pcb_component_ids: [],
    pcb_port_ids: [],
    source_bus_id: "source_bus_1",
    routing_rule: "max_length",
    actual_value: 22,
    expected_max: 20,
    units: "mm",
  })
  expect(any_circuit_element.parse(error)).toEqual(error)
  expect(error.error_type).toBe("pcb_trace_error")
  expect(error.actual_value).toBe(22)
})

test("unverified rules use trace warnings without fabricating missing geometry", () => {
  const warning = pcb_trace_warning.parse({
    type: "pcb_trace_warning",
    message: "Unverified DATA length: the signal is not routed",
    source_trace_id: "data_0",
    pcb_component_ids: [],
    pcb_port_ids: [],
    source_bus_id: "source_bus_1",
    routing_rule: "route_geometry",
  })
  expect(any_circuit_element.parse(warning)).toEqual(warning)
  expect(warning.pcb_trace_id).toBeUndefined()
})

test("canonical constraints reject invalid units, domains and unresolved selectors", () => {
  const bus = {
    type: "source_bus",
    source_bus_id: "bus",
    source_trace_ids: ["trace"],
  }
  for (const fields of [
    { min_length: -1 },
    { max_length: Infinity },
    { target_length: { reference: "longest_manhattan", source_trace_ids: [] } },
    { target_length: { reference: ".OTHER_BUS" } },
    { length_tolerance: -1 },
    { length_match_source_trace_ids: [] },
    { pcb_trace_spacing: 0 },
    { pcb_spacing_to_other_signals: { width_multiplier: -1 } },
    { target_impedance: NaN },
    { target_impedance_min: 0 },
    { target_differential_impedance_max: Infinity },
    { target_impedance: { min: 50, max: 75 } },
    { target_impedance: "50±25ohm" },
  ]) {
    expect(source_bus.safeParse({ ...bus, ...fields }).success).toBe(false)
  }
  // Negative offsets and exact target matching are valid canonical values.
  expect(
    source_bus.safeParse({
      ...bus,
      target_length: { reference: "longest_manhattan", offset: -1 },
      length_tolerance: 0,
    }).success,
  ).toBe(true)
})
