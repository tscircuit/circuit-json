import { z } from "zod"
import { distance } from "../units"
import { route_hint_point } from "./index"

export const pcb_trace_hint = z
  .object({
    pcb_trace_hint_id: z.string(),
    type: z.literal("pcb_trace_hint"),
    pcb_port_id: z.string(),
    pcb_component_id: z.string(),
    route: z.array(route_hint_point),
    trace_width: distance,
  })
  .describe("A hint that can be used to generate a PCB trace")

export type PcbTraceHint = z.infer<typeof pcb_trace_hint>
export type PcbTraceHintInput = z.input<typeof pcb_trace_hint>
