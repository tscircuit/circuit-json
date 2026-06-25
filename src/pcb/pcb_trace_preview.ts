import { getZodPrefixedIdWithDefault } from "src/common"
import {
  type PcbTraceRoutePoint,
  pcb_trace_route_point,
} from "src/pcb/pcb_trace"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_trace_preview = z
  .object({
    type: z.literal("pcb_trace_preview"),
    pcb_trace_preview_id: getZodPrefixedIdWithDefault("pcb_trace_preview"),
    source_trace_id: z.string().optional(),
    pcb_trace_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    route_order_index: z.number().optional(),
    route_thickness_mode: z
      .enum(["constant", "interpolated"])
      .default("constant")
      .optional(),
    should_round_corners: z.boolean().optional(),
    trace_length: z.number().optional(),
    highlight_color: z.string().optional(),
    route: z.array(pcb_trace_route_point),
  })
  .describe("Defines a preview trace on the PCB")

export type PcbTracePreviewInput = z.input<typeof pcb_trace_preview>
type InferredPcbTracePreview = z.infer<typeof pcb_trace_preview>

/**
 * Defines a preview trace on the PCB. This is useful for showing autorouting
 * candidates before they are committed as real pcb_trace elements.
 */
export interface PcbTracePreview {
  type: "pcb_trace_preview"
  pcb_trace_preview_id: string
  source_trace_id?: string
  pcb_trace_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  route_order_index?: number
  route_thickness_mode?: "constant" | "interpolated"
  should_round_corners?: boolean
  trace_length?: number
  highlight_color?: string
  route: Array<PcbTraceRoutePoint>
}

expectTypesMatch<PcbTracePreview, InferredPcbTracePreview>(true)
