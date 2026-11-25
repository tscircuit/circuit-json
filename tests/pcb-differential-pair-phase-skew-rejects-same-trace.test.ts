import { expect, test } from "bun:test"
import { pcb_differential_pair_phase_skew } from "src/pcb/pcb_differential_pair_phase_skew"
import { phaseSkewInput } from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew rejects one pcb_trace on both sides", () => {
  const result = pcb_differential_pair_phase_skew.safeParse({
    ...phaseSkewInput,
    negative_trace: {
      ...phaseSkewInput.negative_trace,
      pcb_trace_id: phaseSkewInput.positive_trace.pcb_trace_id,
    },
  })

  expect(result.success).toBe(false)
})
