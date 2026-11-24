import { z } from "zod"
import { getZodPrefixedIdWithDefault, type Point } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

const finite_point = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
})

export const pcb_differential_pair_phase_skew_segment = z
  .object({
    start: finite_point,
    end: finite_point,
    layer: layer_ref,
    width: z.number().positive().finite(),
    start_phase_skew: z.number().finite(),
    end_phase_skew: z.number().finite(),
  })
  .refine(
    (segment) =>
      segment.start.x !== segment.end.x || segment.start.y !== segment.end.y,
    "Segment start and end must differ",
  )
  .refine(
    (segment) => segment.start_phase_skew * segment.end_phase_skew >= 0,
    "Phase skew must not change sign within a segment; split it at zero",
  )

export const pcb_differential_pair_phase_skew_trace = z.object({
  pcb_trace_id: z.string().trim().min(1),
  segments: z.array(pcb_differential_pair_phase_skew_segment).min(1),
})

export const pcb_differential_pair_phase_skew = z
  .object({
    type: z.literal("pcb_differential_pair_phase_skew"),
    pcb_differential_pair_phase_skew_id: getZodPrefixedIdWithDefault(
      "pcb_differential_pair_phase_skew",
    ),
    source_bus_id: z.string().trim().min(1),
    positive_trace: pcb_differential_pair_phase_skew_trace,
    negative_trace: pcb_differential_pair_phase_skew_trace,
    subcircuit_id: z.string().optional(),
  })
  .refine(
    (skew) =>
      skew.positive_trace.pcb_trace_id !== skew.negative_trace.pcb_trace_id,
    "Positive and negative traces must be different pcb_traces",
  )
  .describe(
    "Phase skew along one routed differential pair: where the two traces run together, how much farther each trace has run than its partner, in mm. Copper of either trace not covered by a segment has unknown phase skew. A pair whose traces never run together has no element.",
  )

/**
 * Phase skew along one routed differential pair: where the two traces run
 * together, how much farther each trace has run than its partner, in mm.
 * Each trace reports its own length minus its partner's, so the two traces
 * show opposite signs at the same place. Copper not covered by a segment has
 * unknown phase skew.
 */
export interface PcbDifferentialPairPhaseSkew {
  type: "pcb_differential_pair_phase_skew"
  pcb_differential_pair_phase_skew_id: string
  source_bus_id: string
  positive_trace: PcbDifferentialPairPhaseSkewTrace
  negative_trace: PcbDifferentialPairPhaseSkewTrace
  subcircuit_id?: string
}

/** A straight piece of copper along which phase skew changes linearly. */
export interface PcbDifferentialPairPhaseSkewSegment {
  start: Point
  end: Point
  layer: LayerRef
  /** Copper width, in mm. */
  width: number
  /** This trace's routed length minus its partner's at `start`, in mm. */
  start_phase_skew: number
  /** This trace's routed length minus its partner's at `end`, in mm. Same sign as `start_phase_skew`, or zero. */
  end_phase_skew: number
}

/** One trace of a differential pair, covered where its phase skew is known. */
export interface PcbDifferentialPairPhaseSkewTrace {
  pcb_trace_id: string
  segments: PcbDifferentialPairPhaseSkewSegment[]
}

export type PcbDifferentialPairPhaseSkewInput = z.input<
  typeof pcb_differential_pair_phase_skew
>
expectTypesMatch<
  PcbDifferentialPairPhaseSkew,
  z.infer<typeof pcb_differential_pair_phase_skew>
>(true)
