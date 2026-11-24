import { expect, test } from "bun:test"
import { pcb_differential_pair_phase_skew } from "src/pcb/pcb_differential_pair_phase_skew"
import { withPositiveSegment } from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew rejects a segment that crosses zero", () => {
  const result = pcb_differential_pair_phase_skew.safeParse(
    withPositiveSegment({
      segment: { start_phase_skew: -0.1, end_phase_skew: 0.1 },
    }),
  )

  expect(result.success).toBe(false)
})
