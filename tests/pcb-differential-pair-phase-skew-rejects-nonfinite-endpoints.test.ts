import { expect, test } from "bun:test"
import { pcb_differential_pair_phase_skew } from "src/pcb/pcb_differential_pair_phase_skew"
import {
  phaseSkewInput,
  withPositiveSegment,
} from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew rejects nonfinite endpoints", () => {
  expect(
    pcb_differential_pair_phase_skew.safeParse(phaseSkewInput).success,
  ).toBe(true)
  for (const segment of [
    { start: { x: Number.POSITIVE_INFINITY, y: 0.1 } },
    { end: { x: 5, y: Number.NEGATIVE_INFINITY } },
  ]) {
    const result = pcb_differential_pair_phase_skew.safeParse(
      withPositiveSegment({ segment }),
    )
    expect(result.success).toBe(false)
  }
})
