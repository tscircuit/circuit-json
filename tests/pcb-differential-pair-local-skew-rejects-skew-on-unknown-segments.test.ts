import { expect, test } from "bun:test"
import { pcb_differential_pair_local_skew } from "../src"
import {
  coupled_segment,
  skew,
} from "./fixtures/pcb-differential-pair-local-skew"

test("local skew rejects local_skew on unknown segments", () => {
  expect(
    pcb_differential_pair_local_skew.safeParse({
      ...skew,
      positive: {
        ...skew.positive,
        segments: [{ ...coupled_segment, coupling: "unknown" }],
      },
    }).success,
  ).toBe(false)
})
