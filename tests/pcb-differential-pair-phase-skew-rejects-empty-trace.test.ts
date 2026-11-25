import { expect, test } from "bun:test"
import { pcb_differential_pair_phase_skew } from "src/pcb/pcb_differential_pair_phase_skew"
import { phaseSkewInput } from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew rejects a trace with no segments", () => {
  const result = pcb_differential_pair_phase_skew.safeParse({
    ...phaseSkewInput,
    negative_trace: { ...phaseSkewInput.negative_trace, segments: [] },
  })

  expect(result.success).toBe(false)
})
