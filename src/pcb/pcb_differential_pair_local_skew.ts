import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const finite_distance = distance.pipe(z.number().finite())
const finite_point = point.extend({ x: finite_distance, y: finite_distance })
const skew_magnitude = z.number().finite().nonnegative()

export interface PcbLocalSkewSegment {
  /** Start of this trace segment in PCB coordinates, in mm. */
  start: Point
  /** End of this trace segment in PCB coordinates, in mm. */
  end: Point
  /** Copper layer carrying the segment. */
  layer: LayerRef
  /** Width of the trace segment in mm. */
  width: number
  /** How much farther this trace has run than its partner, in mm. Positive means longer. Absent when unknown. */
  local_skew?: number
  /** Coupled stretches are measured side by side. Interpolated stretches are estimated between coupled stretches. Skew is unknown before the first or after the last coupled stretch. */
  coupling: "coupled" | "interpolated" | "unknown"
}

const pcb_local_skew_segment = z.object({
  start: finite_point,
  end: finite_point,
  layer: layer_ref,
  width: finite_distance,
  local_skew: z.number().finite().optional(),
  coupling: z.enum(["coupled", "interpolated", "unknown"]),
})

export interface PcbLocalSkewTrace {
  /** ID of the PCB trace described by these measurements. */
  pcb_trace_id: string
  /** Largest positive local skew on this trace in mm, a nonnegative value used as the full-colour scale for positive skew. */
  positive_skew_scale: number
  /** Largest magnitude of negative local skew on this trace in mm, expressed as a nonnegative value. */
  negative_skew_scale: number
  /** Segments carrying local skew along this trace. */
  segments: PcbLocalSkewSegment[]
}

const pcb_local_skew_trace = z.object({
  pcb_trace_id: z.string(),
  positive_skew_scale: skew_magnitude,
  negative_skew_scale: skew_magnitude,
  segments: z.array(pcb_local_skew_segment),
})

/** Local skew records how much farther one trace has run than its partner at each point on a routed differential pair, in mm. KiCad calls this differential phase skew. */
export interface PcbDifferentialPairLocalSkew {
  /** Identifies a differential-pair local skew element. */
  type: "pcb_differential_pair_local_skew"
  /** Unique ID of this local skew element. */
  pcb_differential_pair_local_skew_id: string
  /** ID of the source bus that defines the differential pair. */
  source_bus_id: string
  /** ID of the subcircuit that owns the pair, when available. */
  subcircuit_id?: string
  /** Largest absolute local skew in mm over measured and interpolated stretches and via steps. Absent when the traces never run together. */
  max_local_skew?: number
  /** The pair's maxLengthSkew in mm, when set. */
  max_length_skew?: number
  /** Colour for positive local skew, where a trace has run farther than its partner. Renderers may override this colour. */
  positive_skew_color?: string
  /** Colour for negative local skew, where a trace has run a shorter distance than its partner. Renderers may override this colour. */
  negative_skew_color?: string
  /** Local skew data for the positive member of the pair. */
  positive: PcbLocalSkewTrace
  /** Local skew data for the negative member of the pair. */
  negative: PcbLocalSkewTrace
}

export const pcb_differential_pair_local_skew = z.object({
  type: z.literal("pcb_differential_pair_local_skew"),
  pcb_differential_pair_local_skew_id: getZodPrefixedIdWithDefault(
    "pcb_differential_pair_local_skew",
  ),
  source_bus_id: z.string(),
  subcircuit_id: z.string().optional(),
  max_local_skew: skew_magnitude.optional(),
  max_length_skew: skew_magnitude.optional(),
  positive_skew_color: z.string().optional(),
  negative_skew_color: z.string().optional(),
  positive: pcb_local_skew_trace,
  negative: pcb_local_skew_trace,
})

export type PcbDifferentialPairLocalSkewInput = z.input<
  typeof pcb_differential_pair_local_skew
>

expectTypesMatch<PcbLocalSkewSegment, z.infer<typeof pcb_local_skew_segment>>(
  true,
)
expectTypesMatch<PcbLocalSkewTrace, z.infer<typeof pcb_local_skew_trace>>(true)
expectTypesMatch<
  PcbDifferentialPairLocalSkew,
  z.infer<typeof pcb_differential_pair_local_skew>
>(true)
