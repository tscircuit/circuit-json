import { z } from "zod"
import { point, type Point } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const positive_distance = distance.pipe(z.number().finite().positive())
const finite_point = point.extend({
  x: distance.pipe(z.number().finite()),
  y: distance.pipe(z.number().finite()),
})
const endpoint = z.object({
  route_segment_index: z.number().int().nonnegative(),
  end: z.enum(["start", "end"]),
})

export const pcb_trace_teardrop_parametric = endpoint.extend({
  shape: z.enum(["linear", "curved"]),
  length: positive_distance,
  width: positive_distance,
  outline: z.never().optional(),
})

export const pcb_trace_teardrop_polygon = endpoint.extend({
  shape: z.literal("polygon"),
  outline: z
    .array(finite_point)
    .min(3)
    .refine((vertices) => {
      const twice_area = vertices.reduce((area, p, i) => {
        const next = vertices[(i + 1) % vertices.length]!
        return area + p.x * next.y - next.x * p.y
      }, 0)
      return Number.isFinite(twice_area) && twice_area !== 0
    }, "Teardrop outline must enclose a nonzero area"),
  length: z.never().optional(),
  width: z.never().optional(),
})

/** Resolved additive copper at one end of an existing wire segment. */
export const pcb_trace_teardrop = z.union([
  pcb_trace_teardrop_parametric,
  pcb_trace_teardrop_polygon,
])

export interface PcbTraceTeardropEndpoint {
  /** Segment from route[i] to route[i + 1]; both must be wires on the same layer. */
  route_segment_index: number
  /** The wide end is at the selected endpoint, tapering into this segment. */
  end: "start" | "end"
}

/** A symmetric taper; dimensions are in mm. See docs/pcb-trace-teardrops.md. */
export interface PcbTraceTeardropParametric extends PcbTraceTeardropEndpoint {
  shape: "linear" | "curved"
  /** Distance from the selected endpoint to the neck, along the segment. */
  length: Distance
  /** Full copper width at the selected endpoint, perpendicular to the segment. */
  width: Distance
  outline?: never
}

/** Imported/resolved copper outline, implicitly closed, without holes. */
export interface PcbTraceTeardropPolygon extends PcbTraceTeardropEndpoint {
  shape: "polygon"
  /** Absolute PCB coordinates in mm, with all placement and rotation baked in. */
  outline: Point[]
  length?: never
  width?: never
}

export type PcbTraceTeardrop =
  | PcbTraceTeardropParametric
  | PcbTraceTeardropPolygon
export type PcbTraceTeardropInput = z.input<typeof pcb_trace_teardrop>

expectTypesMatch<PcbTraceTeardrop, z.infer<typeof pcb_trace_teardrop>>(true)
