import type {
  PcbDifferentialPairLocalSkew,
  PcbLocalSkewSegment,
} from "../../src"

/** A measured segment of the positive trace. */
export const measured_segment = {
  start: { x: 0, y: 0 },
  end: { x: 2, y: 0 },
  layer: "top",
  width: 0.2,
  local_skew: 0.1,
} satisfies PcbLocalSkewSegment

/** A valid local skew element for a two-trace differential pair. */
export const skew = {
  type: "pcb_differential_pair_local_skew",
  pcb_differential_pair_local_skew_id: "pcb_differential_pair_local_skew_1",
  source_bus_id: "source_bus_1",
  subcircuit_id: "subcircuit_1",
  max_local_skew: 0.1,
  max_length_skew: 0.2,
  positive: {
    pcb_trace_id: "pcb_trace_1",
    positive_skew_scale: 0.1,
    negative_skew_scale: 0,
    segments: [
      measured_segment,
      {
        start: { x: 2, y: 0 },
        end: { x: 3, y: 0 },
        layer: "top",
        width: 0.2,
      },
    ],
  },
  negative: {
    pcb_trace_id: "pcb_trace_2",
    positive_skew_scale: 0,
    negative_skew_scale: 0.1,
    segments: [
      {
        ...measured_segment,
        start: { x: 0, y: 0.3 },
        end: { x: 2, y: 0.3 },
        local_skew: -0.1,
      },
    ],
  },
} satisfies PcbDifferentialPairLocalSkew
