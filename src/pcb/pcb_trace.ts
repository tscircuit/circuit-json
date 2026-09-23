import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_route_point_wire = z.object({
  route_type: z.literal("wire"),
  x: distance,
  y: distance,
  width: distance,
  copper_pour_id: z.string().optional(),
  is_inside_copper_pour: z.boolean().optional(),
  start_pcb_port_id: z.string().optional(),
  end_pcb_port_id: z.string().optional(),
  layer: layer_ref,
})

export const pcb_trace_route_point_via = z.object({
  route_type: z.literal("via"),
  x: distance,
  y: distance,
  copper_pour_id: z.string().optional(),
  is_inside_copper_pour: z.boolean().optional(),
  hole_diameter: distance.optional(),
  outer_diameter: distance.optional(),
  tented_on_top: z.boolean().optional(),
  tented_on_bottom: z.boolean().optional(),
  from_layer: layer_ref,
  to_layer: layer_ref,
})

export const pcb_trace_route_point_through_pad = z.object({
  route_type: z.literal("through_pad"),
  start: point,
  end: point,
  width: distance,
  start_layer: layer_ref,
  end_layer: layer_ref,
  pcb_smtpad_id: z.string().optional(),
  pcb_plated_hole_id: z.string().optional(),
})

const positive_width = distance.pipe(z.number().finite().positive())
const finite_route_point = point.extend({
  x: distance.pipe(z.number().finite()),
  y: distance.pipe(z.number().finite()),
})

/** An explicit straight wire segment with a varying full copper width. */
export const pcb_trace_route_point_teardrop = z
  .object({
    route_type: z.literal("teardrop"),
    start: finite_route_point,
    end: finite_route_point,
    start_width: positive_width,
    end_width: positive_width,
    width_interpolation_mode: z.enum(["linear", "smoothstep", "quadratic"]),
    layer: layer_ref,
    copper_pour_id: z.string().optional(),
    is_inside_copper_pour: z.boolean().optional(),
    start_pcb_port_id: z.string().optional(),
    end_pcb_port_id: z.string().optional(),
  })
  .refine(({ start, end }) => {
    const length = Math.hypot(end.x - start.x, end.y - start.y)
    return Number.isFinite(length) && length > 0
  }, "Teardrop endpoints must define a finite, nonzero-length segment")

export const pcb_trace_route_point = z.union([
  pcb_trace_route_point_wire,
  pcb_trace_route_point_via,
  pcb_trace_route_point_through_pad,
  pcb_trace_route_point_teardrop,
])
type InferredPcbTraceRoutePoint = z.infer<typeof pcb_trace_route_point>

export const pcb_trace = z
  .object({
    type: z.literal("pcb_trace"),
    source_trace_id: z.string().optional(),
    pcb_component_id: z.string().optional(),
    pcb_trace_id: getZodPrefixedIdWithDefault("pcb_trace"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    route_thickness_mode: z
      .enum(["constant", "interpolated"])
      .default("constant")
      .optional(),
    route_order_index: z.number().optional(),
    should_round_corners: z.boolean().optional(),
    trace_length: z.number().optional(),
    is_antenna_trace: z.boolean().optional(),
    highlight_color: z.string().optional(),
    route: z.array(pcb_trace_route_point),
  })
  .describe("Defines a trace on the PCB")

export type PcbTraceInput = z.input<typeof pcb_trace>
type InferredPcbTrace = z.infer<typeof pcb_trace>

export interface PcbTraceRoutePointWire {
  route_type: "wire"
  x: Distance
  y: Distance
  width: Distance
  copper_pour_id?: string
  is_inside_copper_pour?: boolean
  start_pcb_port_id?: string
  end_pcb_port_id?: string
  layer: LayerRef
}

export interface PcbTraceRoutePointVia {
  route_type: "via"
  x: Distance
  y: Distance
  copper_pour_id?: string
  is_inside_copper_pour?: boolean
  hole_diameter?: Distance
  outer_diameter?: Distance
  tented_on_top?: boolean
  tented_on_bottom?: boolean
  from_layer: LayerRef
  to_layer: LayerRef
}

export interface PcbTraceRoutePointThroughPad {
  route_type: "through_pad"
  start: Point
  end: Point
  width: Distance
  start_layer: LayerRef
  end_layer: LayerRef
  pcb_smtpad_id?: string
  pcb_plated_hole_id?: string
}

/** A straight tapered wire segment. Coordinates and full widths are in mm. */
export interface PcbTraceRoutePointTeardrop {
  route_type: "teardrop"
  start: Point
  end: Point
  start_width: Distance
  end_width: Distance
  /** Quadratic is concave toward the narrow end; see docs/pcb-trace-teardrops.md for profiles. */
  width_interpolation_mode: "linear" | "smoothstep" | "quadratic"
  layer: LayerRef
  copper_pour_id?: string
  is_inside_copper_pour?: boolean
  start_pcb_port_id?: string
  end_pcb_port_id?: string
}

export type PcbTraceRoutePoint =
  | PcbTraceRoutePointWire
  | PcbTraceRoutePointVia
  | PcbTraceRoutePointThroughPad
  | PcbTraceRoutePointTeardrop

/**
 * Defines a trace on the PCB
 */
export interface PcbTrace {
  type: "pcb_trace"
  source_trace_id?: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  pcb_trace_id: string
  /**
   * The order that this trace was routed in. This can be used to debug the
   * autorouter and to understand the trace path better
   *
   * The route_order_index should be relative to a subcircuit
   */
  route_order_index?: number
  route_thickness_mode?: "constant" | "interpolated"
  should_round_corners?: boolean
  trace_length?: number
  is_antenna_trace?: boolean
  highlight_color?: string
  route: Array<PcbTraceRoutePoint>
}

/**
 * @deprecated use PcbTrace
 */
export type PCBTrace = PcbTrace

/**
 * @deprecated use PcbTraceInput
 */
export type PCBTraceInput = PcbTraceInput

expectTypesMatch<PcbTraceRoutePoint, InferredPcbTraceRoutePoint>(true)
expectTypesMatch<PcbTrace, InferredPcbTrace>(true)
