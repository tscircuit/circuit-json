import { expect, test } from "bun:test"
import { pcb_differential_pair_phase_skew } from "src/pcb/pcb_differential_pair_phase_skew"
import { withPositiveSegment } from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew rejects a segment without width", () => {
  const result = pcb_differential_pair_phase_skew.safeParse(
    withPositiveSegment({ segment: { width: 0 } }),
  )

  expect(result.success).toBe(false)
})
