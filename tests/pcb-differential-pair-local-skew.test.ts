import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_differential_pair_local_skew,
  type PcbDifferentialPairLocalSkew,
  type PcbLocalSkewSegment,
} from "../src"

const coupled_segment = {
  start: { x: 0, y: 0 },
  end: { x: 2, y: 0 },
  layer: "top",
  width: 0.2,
  local_skew: 0.1,
  coupling: "coupled",
} satisfies PcbLocalSkewSegment

const skew = {
  type: "pcb_differential_pair_local_skew",
  pcb_differential_pair_local_skew_id: "pcb_differential_pair_local_skew_1",
  source_bus_id: "source_bus_1",
  subcircuit_id: "subcircuit_1",
  max_local_skew: 0.1,
  max_length_skew: 0.2,
  positive: {
    pcb_trace_id: "pcb_trace_1",
    positive_skew_scale: 0.1,
    negative_skew_scale: 0,
    segments: [
      coupled_segment,
      {
        start: { x: 2, y: 0 },
        end: { x: 3, y: 0 },
        layer: "top",
        width: 0.2,
        coupling: "unknown",
      },
    ],
  },
  negative: {
    pcb_trace_id: "pcb_trace_2",
    positive_skew_scale: 0,
    negative_skew_scale: 0.1,
    segments: [
      {
        ...coupled_segment,
        start: { x: 0, y: 0.3 },
        end: { x: 2, y: 0.3 },
        local_skew: -0.1,
      },
    ],
  },
} satisfies PcbDifferentialPairLocalSkew

test("local skew survives generic Circuit JSON parsing", () => {
  expect(any_circuit_element.parse(skew)).toEqual(skew)
  expect(
    pcb_differential_pair_local_skew.parse({
      ...skew,
      pcb_differential_pair_local_skew_id: undefined,
    }).pcb_differential_pair_local_skew_id,
  ).toStartWith("pcb_differential_pair_local_skew_")
})

test("local skew rejects negative or nonfinite scales and nonfinite segment values", () => {
  for (const invalid of [
    { ...skew, positive: { ...skew.positive, positive_skew_scale: -0.1 } },
    { ...skew, negative: { ...skew.negative, negative_skew_scale: Infinity } },
    { ...skew, max_local_skew: Infinity },
  ]) {
    expect(pcb_differential_pair_local_skew.safeParse(invalid).success).toBe(
      false,
    )
  }
  for (const invalid_segment of [
    { ...coupled_segment, end: { x: Infinity, y: 0 } },
    { ...coupled_segment, width: Infinity },
    { ...coupled_segment, local_skew: -Infinity },
  ]) {
    expect(
      pcb_differential_pair_local_skew.safeParse({
        ...skew,
        positive: { ...skew.positive, segments: [invalid_segment] },
      }).success,
    ).toBe(false)
  }
})
