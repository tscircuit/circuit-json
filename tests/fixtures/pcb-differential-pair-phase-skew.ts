import type { PcbDifferentialPairPhaseSkewInput } from "src/pcb/pcb_differential_pair_phase_skew"

/** A pair coupled for 5 mm where the positive trace pulls 0.2 mm ahead. */
export const phaseSkewInput = {
  type: "pcb_differential_pair_phase_skew",
  source_bus_id: "source_bus_0",
  positive_trace: {
    pcb_trace_id: "pcb_trace_0",
    segments: [
      {
        start: { x: 0, y: 0.1 },
        end: { x: 5, y: 0.1 },
        layer: "top",
        width: 0.15,
        start_length_difference_mm: 0,
        end_length_difference_mm: 0.2,
      },
    ],
  },
  negative_trace: {
    pcb_trace_id: "pcb_trace_1",
    segments: [
      {
        start: { x: 0, y: -0.1 },
        end: { x: 5, y: -0.1 },
        layer: "top",
        width: 0.15,
        start_length_difference_mm: 0,
        end_length_difference_mm: -0.2,
      },
    ],
  },
} satisfies PcbDifferentialPairPhaseSkewInput

/** The fixture with its positive trace's only segment replaced by `segment`. */
export function withPositiveSegment({
  segment,
}: {
  segment: Partial<
    PcbDifferentialPairPhaseSkewInput["positive_trace"]["segments"][number]
  >
}) {
  const [original] = phaseSkewInput.positive_trace.segments
  return {
    ...phaseSkewInput,
    positive_trace: {
      ...phaseSkewInput.positive_trace,
      segments: [{ ...original, ...segment }],
    },
  }
}
