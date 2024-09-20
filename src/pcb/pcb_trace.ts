import { z } from "zod"
import { distance, type Distance, getZodPrefixedIdWithDefault } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace = z
  .object({
    type: z.literal("pcb_trace"),
    source_trace_id: z.string().optional(),
    pcb_component_id: z.string().optional(),
    pcb_trace_id: getZodPrefixedIdWithDefault("pcb_trace"),
    route_thickness_mode: z
      .enum(["constant", "interpolated"])
      .default("constant")
      .optional(),
    should_round_corners: z.boolean().optional(),
    route: z.array(
      z.union([
        z.object({
          route_type: z.literal("wire"),
          x: distance,
          y: distance,
          width: distance,
          start_pcb_port_id: z.string().optional(),
          end_pcb_port_id: z.string().optional(),
          layer: layer_ref,
        }),
        z.object({
          route_type: z.literal("via"),
          x: distance,
          y: distance,
          from_layer: z.string(),
          to_layer: z.string(),
        }),
      ]),
    ),
  })
  .describe("Defines a trace on the PCB")

export type PcbTraceInput = z.input<typeof pcb_trace>
type InferredPcbTrace = z.infer<typeof pcb_trace>

/**
 * Defines a trace on the PCB
 */
export interface PcbTrace {
  type: "pcb_trace"
  source_trace_id?: string
  pcb_component_id?: string
  pcb_trace_id: string
  route_thickness_mode?: "constant" | "interpolated"
  should_round_corners?: boolean
  route: Array<
    | {
        route_type: "wire"
        x: Distance
        y: Distance
        width: Distance
        start_pcb_port_id?: string
        end_pcb_port_id?: string
        layer: LayerRef
      }
    | {
        route_type: "via"
        x: Distance
        y: Distance
        from_layer: string
        to_layer: string
      }
  >
}

/**
 * @deprecated use PcbTrace
 */
export type PCBTrace = PcbTrace

/**
 * @deprecated use PcbTraceInput
 */
export type PCBTraceInput = PcbTraceInput

expectTypesMatch<PcbTrace, InferredPcbTrace>(true)
