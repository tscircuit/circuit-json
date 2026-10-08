import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { layer_ref, type LayerRef } from "./properties/layer_ref"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_style_warning = z
  .object({
    type: z.literal("pcb_trace_style_warning"),
    pcb_trace_style_warning_id: getZodPrefixedIdWithDefault(
      "pcb_trace_style_warning",
    ),
    warning_type: z
      .literal("pcb_trace_style_warning")
      .default("pcb_trace_style_warning"),
    message: z.string(),
    styling_issue_type: z.literal("long_segment_at_odd_angle"),
    pcb_trace_id: z.string(),
    source_trace_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    layer: layer_ref,
    start_route_index: z.number().int().nonnegative(),
    end_route_index: z.number().int().nonnegative(),
    segment_start: point,
    segment_end: point,
    center: point,
    segment_length: distance,
    minimum_segment_length: distance,
    angle_degrees: z.number().min(0).lt(360),
    nearest_allowed_angle_degrees: z.number().min(0).lt(360).multipleOf(45),
    angle_deviation_degrees: z.number().min(0).max(22.5),
    angle_tolerance_degrees: z.number().min(0).lt(22.5),
  })
  .describe(
    "Warning for a long PCB trace segment whose direction deviates from a multiple of 45 degrees",
  )

export type PcbTraceStyleWarningInput = z.input<typeof pcb_trace_style_warning>
type InferredPcbTraceStyleWarning = z.infer<typeof pcb_trace_style_warning>

/** A long segment at an odd angle, identified by its trace and route endpoints. */
export interface PcbTraceStyleWarning {
  type: "pcb_trace_style_warning"
  pcb_trace_style_warning_id: string
  warning_type: "pcb_trace_style_warning"
  message: string
  styling_issue_type: "long_segment_at_odd_angle"
  pcb_trace_id: string
  source_trace_id?: string
  subcircuit_id?: string
  layer: LayerRef
  start_route_index: number
  end_route_index: number
  segment_start: Point
  segment_end: Point
  center: Point
  segment_length: Distance
  minimum_segment_length: Distance
  angle_degrees: number
  nearest_allowed_angle_degrees: number
  angle_deviation_degrees: number
  angle_tolerance_degrees: number
}

expectTypesMatch<PcbTraceStyleWarning, InferredPcbTraceStyleWarning>(true)
