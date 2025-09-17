import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_route_point_wire = z.object({
  route_type: z.literal("wire"),
  x: distance,
  y: distance,
  width: distance,
  start_pcb_port_id: z.string().optional(),
  end_pcb_port_id: z.string().optional(),
  layer: layer_ref,
  color: z.string().optional(),
})

export const pcb_trace_route_point_via = z.object({
  route_type: z.literal("via"),
  x: distance,
  y: distance,
  hole_diameter: distance.optional(),
  outer_diameter: distance.optional(),
  from_layer: z.string(),
  to_layer: z.string(),
})

export const pcb_trace_route_point = z.union([
  pcb_trace_route_point_wire,
  pcb_trace_route_point_via,
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
    route: z.array(pcb_trace_route_point),
    color: z.string().optional(),
  })
  .describe("Defines a trace on the PCB")

export type PcbTraceInput = z.input<typeof pcb_trace>
type InferredPcbTrace = z.infer<typeof pcb_trace>

export interface PcbTraceRoutePointWire {
  route_type: "wire"
  x: Distance
  y: Distance
  width: Distance
  start_pcb_port_id?: string
  end_pcb_port_id?: string
  layer: LayerRef
  color?: string
}

export interface PcbTraceRoutePointVia {
  route_type: "via"
  x: Distance
  y: Distance
  hole_diameter?: Distance
  outer_diameter?: Distance
  from_layer: string
  to_layer: string
}

export type PcbTraceRoutePoint = PcbTraceRoutePointWire | PcbTraceRoutePointVia

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
  route: Array<PcbTraceRoutePoint>
  color?: string
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
