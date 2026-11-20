import { expect, test } from "bun:test"
import {
  any_circuit_element,
  pcb_differential_pair_local_skew,
  type PcbDifferentialPairLocalSkew,
} from "../src"
import {
  coupled_segment,
  skew,
} from "./fixtures/pcb-differential-pair-local-skew"

test("local skew survives generic Circuit JSON parsing", () => {
  expect(any_circuit_element.parse(skew)).toEqual(skew)
  const coloured_skew = {
    ...skew,
    positive_skew_color: "rgb(0, 0, 255)",
    negative_skew_color: "rgb(255, 0, 0)",
  } satisfies PcbDifferentialPairLocalSkew
  expect(any_circuit_element.parse(coloured_skew)).toEqual(coloured_skew)
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
