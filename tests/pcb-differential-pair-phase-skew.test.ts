import { expect, test } from "bun:test"
import { any_circuit_element } from "src/any_circuit_element"
import { pcb_differential_pair_phase_skew } from "src/pcb/pcb_differential_pair_phase_skew"
import { phaseSkewInput } from "./fixtures/pcb-differential-pair-phase-skew"

test("pcb_differential_pair_phase_skew parses as a circuit element", () => {
  const element = any_circuit_element.parse(phaseSkewInput)

  expect(element.type).toBe("pcb_differential_pair_phase_skew")
  if (element.type !== "pcb_differential_pair_phase_skew") return
  expect(element.pcb_differential_pair_phase_skew_id).toStartWith(
    "pcb_differential_pair_phase_skew",
  )
  expect(element.negative_trace.segments[0]!.end_length_difference_mm).toBe(
    -0.2,
  )
  expect(element.end_to_end_length_difference_mm).toBe(-0.1)
})

test.each([0, 0.1])(
  "accepts an end-to-end difference of %s mm",
  (difference) => {
    const element = pcb_differential_pair_phase_skew.parse({
      ...phaseSkewInput,
      end_to_end_length_difference_mm: difference,
    })
    expect(element.end_to_end_length_difference_mm).toBe(difference)
  },
)

test.each([undefined, NaN, Infinity, -Infinity])(
  "rejects an end-to-end difference of %s",
  (difference) => {
    const result = pcb_differential_pair_phase_skew.safeParse({
      ...phaseSkewInput,
      end_to_end_length_difference_mm: difference,
    })
    expect(result.success).toBe(false)
  },
)
