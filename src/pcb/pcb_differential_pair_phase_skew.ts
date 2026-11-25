import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_differential_pair_phase_skew_segment = z
  .object({
    start: point,
    end: point,
    layer: layer_ref,
    width: z.number().positive().finite(),
    start_length_difference_mm: z.number().finite(),
    end_length_difference_mm: z.number().finite(),
  })
  .refine(
    ({ start, end }) => [start.x, start.y, end.x, end.y].every(Number.isFinite),
    "Segment endpoints must be finite",
  )
  .refine(
    (segment) =>
      segment.start.x !== segment.end.x || segment.start.y !== segment.end.y,
    "Segment start and end must differ",
  )
  .refine(
    (segment) =>
      segment.start_length_difference_mm * segment.end_length_difference_mm >=
      0,
    "start_length_difference_mm and end_length_difference_mm must not be one positive and one negative",
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
    "How far ahead or behind each trace of a differential pair is, in mm, at each point where the two traces run side by side.",
  )

/**
 * How far ahead or behind each trace of a differential pair is, in mm, at
 * each point where the two traces run side by side.
 */
export interface PcbDifferentialPairPhaseSkew {
  type: "pcb_differential_pair_phase_skew"
  pcb_differential_pair_phase_skew_id: string
  source_bus_id: string
  positive_trace: PcbDifferentialPairPhaseSkewTrace
  negative_trace: PcbDifferentialPairPhaseSkewTrace
  subcircuit_id?: string
}

/** A straight piece of trace. Along it the value changes evenly from `start_length_difference_mm` to `end_length_difference_mm`. */
export interface PcbDifferentialPairPhaseSkewSegment {
  start: Point
  end: Point
  layer: LayerRef
  /** Copper width, in mm. */
  width: number
  /** At `start`: this trace's routed length so far minus the opposite-polarity trace's. */
  start_length_difference_mm: number
  /** At `end`: this trace's routed length so far minus the opposite-polarity trace's. */
  end_length_difference_mm: number
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
