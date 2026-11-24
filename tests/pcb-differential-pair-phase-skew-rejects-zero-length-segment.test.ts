import { expect, test } from "bun:test"
import { pcb_differential_pair_phase_skew } from "src/pcb/pcb_differential_pair_phase_skew"
import { withPositiveSegment } from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew rejects a segment with no length", () => {
  const result = pcb_differential_pair_phase_skew.safeParse(
    withPositiveSegment({ segment: { end: { x: 0, y: 0.1 } } }),
  )

  expect(result.success).toBe(false)
})
