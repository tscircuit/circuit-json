import { expect, test } from "bun:test"
import { pcb_differential_pair_local_skew } from "../src"
import {
  measured_segment,
  skew,
} from "./fixtures/pcb-differential-pair-local-skew"

test("local skew rejects a segment width of zero or less", () => {
  expect(
    pcb_differential_pair_local_skew.safeParse({
      ...skew,
      positive: {
        ...skew.positive,
        segments: [{ ...measured_segment, width: 0 }],
      },
    }).success,
  ).toBe(false)
  expect(
    pcb_differential_pair_local_skew.safeParse({
      ...skew,
      positive: {
        ...skew.positive,
        segments: [{ ...measured_segment, width: -0.2 }],
      },
    }).success,
  ).toBe(false)
})
