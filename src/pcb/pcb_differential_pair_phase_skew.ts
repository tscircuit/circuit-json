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
    "start_phase_skew and end_phase_skew must not be one positive and one negative",
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
    "How far ahead or behind each trace of a differential pair is, in mm, at each point where the two traces run side by side. Parts of a trace with no segment have no known value.",
  )

/**
 * How far ahead or behind each trace of a differential pair is, in mm, at
 * each point where the two traces run side by side.
 *
 * Example: at some point the positive trace has used 10.2 mm of copper and
 * the negative trace 10.0 mm. The positive trace stores +0.2 there and the
 * negative trace stores -0.2.
 *
 * Parts of a trace with no segment have no known value.
 */
export interface PcbDifferentialPairPhaseSkew {
  type: "pcb_differential_pair_phase_skew"
  pcb_differential_pair_phase_skew_id: string
  source_bus_id: string
  positive_trace: PcbDifferentialPairPhaseSkewTrace
  negative_trace: PcbDifferentialPairPhaseSkewTrace
  subcircuit_id?: string
}

/** A straight piece of trace. Along it the value changes evenly from `start_phase_skew` to `end_phase_skew`. */
export interface PcbDifferentialPairPhaseSkewSegment {
  start: Point
  end: Point
  layer: LayerRef
  /** Copper width, in mm. */
  width: number
  /** At `start`: this trace's routed length so far minus its paired trace's, in mm. */
  start_phase_skew: number
  /** At `end`: this trace's routed length so far minus its paired trace's, in mm. */
  end_phase_skew: number
}

/** One trace of the pair, with a segment wherever its value is known. */
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
