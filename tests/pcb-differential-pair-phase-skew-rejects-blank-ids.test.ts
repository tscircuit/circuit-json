import { expect, test } from "bun:test"
import { pcb_differential_pair_phase_skew } from "src/pcb/pcb_differential_pair_phase_skew"
import { phaseSkewInput } from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew rejects blank ids", () => {
  const result = pcb_differential_pair_phase_skew.safeParse({
    ...phaseSkewInput,
    source_bus_id: " ",
  })

  expect(result.success).toBe(false)
})
