import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_autorouting_error,
  pcb_bus_length_skew_error,
  source_bus,
  type SourceDifferentialPairBus,
} from "../src"

const pair: SourceDifferentialPairBus = {
  type: "source_bus",
  source_bus_id: "usb",
  source_trace_ids: ["dp1", "dp2", "dm1"],
  max_length_skew: 0.1,
  differential_pair: {
    positive_source_trace_ids: ["dp1", "dp2"],
    negative_source_trace_ids: ["dm1"],
  },
}

test("differential pair parses", () => {
  expect(any_circuit_element.parse(pair)).toEqual(pair)
})

test.each([
  { source_trace_ids: ["dp1", "dm1"] },
  { source_trace_ids: ["dp2", "dp1", "dm1"] },
  { source_trace_ids: ["dp1", "dp2", "dm1", "extra"] },
  { max_length_skew: undefined },
  { min_length: 1 },
])("differential pair rejects %j", (fields) => {
  expect(source_bus.safeParse({ ...pair, ...fields }).success).toBe(false)
})

test("ordinary bus still parses", () => {
  const bus = { source_bus_id: "b", source_trace_ids: ["a"], min_length: 1 }
  expect(source_bus.parse({ type: "source_bus", ...bus })).toMatchObject(bus)
})

test("error payloads carry differential pair lane lengths", () => {
  const lengths = { positive_length: 21.2, negative_length: 20 }
  const autorouting = pcb_autorouting_error.parse({
    type: "pcb_autorouting_error",
    message: "USB lanes could not be length-matched",
    differential_pair_length_skew: { source_bus_id: "usb", ...lengths },
  })
  const skew = pcb_bus_length_skew_error.parse({
    type: "pcb_bus_length_skew_error",
    message: "USB lanes exceed skew",
    source_bus_id: "usb",
    source_trace_ids: ["dp1", "dp2", "dm1"],
    pcb_trace_ids: ["pcb_dp1", "pcb_dp2", "pcb_dm1"],
    actual_length_skew: 1.2,
    maximum_length_skew: 0.1,
    differential_pair_lengths: lengths,
  })
  expect(autorouting.differential_pair_length_skew).toEqual({
    source_bus_id: "usb",
    ...lengths,
  })
  expect(skew.differential_pair_lengths).toEqual(lengths)
  expect(any_circuit_element.parse(skew)).toEqual(skew)
})
