import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { route_hint_point, type RouteHintPoint } from "src/pcb"
import { expectTypesMatch } from "src/utils/expect-types-match"

/**
 * A hint that can be used during generation of a PCB trace.
 */
export interface PcbTraceHint {
  type: "pcb_trace_hint"
  pcb_trace_hint_id: string
  pcb_port_id: string
  pcb_component_id: string
  route: RouteHintPoint[]
  subcircuit_id?: string
}

export const pcb_trace_hint = z
  .object({
    type: z.literal("pcb_trace_hint"),
    pcb_trace_hint_id: getZodPrefixedIdWithDefault("pcb_trace_hint"),
    pcb_port_id: z.string(),
    pcb_component_id: z.string(),
    route: z.array(route_hint_point),
    subcircuit_id: z.string().optional(),
  })
  .describe("A hint that can be used during generation of a PCB trace")

export type PcbTraceHintInput = z.input<typeof pcb_trace_hint>
type InferredPcbTraceHint = z.infer<typeof pcb_trace_hint>

/**
 * @deprecated use PcbTraceHint
 */
export type PCBTraceHint = PcbTraceHint

expectTypesMatch<PcbTraceHint, InferredPcbTraceHint>(true)
