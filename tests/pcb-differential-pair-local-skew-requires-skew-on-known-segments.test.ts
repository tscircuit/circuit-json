import { expect, test } from "bun:test"
import { pcb_differential_pair_local_skew } from "../src"
import {
  coupled_segment,
  skew,
} from "./fixtures/pcb-differential-pair-local-skew"

test("local skew requires local_skew on coupled and interpolated segments", () => {
  expect(
    pcb_differential_pair_local_skew.safeParse({
      ...skew,
      positive: {
        ...skew.positive,
        segments: [{ ...coupled_segment, local_skew: undefined }],
      },
    }).success,
  ).toBe(false)
  expect(
    pcb_differential_pair_local_skew.safeParse({
      ...skew,
      positive: {
        ...skew.positive,
        segments: [
          {
            ...coupled_segment,
            coupling: "interpolated",
            local_skew: undefined,
          },
        ],
      },
    }).success,
  ).toBe(false)
})
