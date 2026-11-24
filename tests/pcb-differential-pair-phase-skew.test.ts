import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { phaseSkewInput } from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew parses as a circuit element", () => {
  const element = any_circuit_element.parse(phaseSkewInput)

  expect(element.type).toBe("pcb_differential_pair_phase_skew")
  if (element.type !== "pcb_differential_pair_phase_skew") return
  expect(element.pcb_differential_pair_phase_skew_id).toStartWith(
    "pcb_differential_pair_phase_skew",
  )
  expect(element.negative_trace.segments[0]!.end_phase_skew).toBe(-0.2)
})
