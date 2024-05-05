import { z } from "zod"
import { point } from "../common"
import { distance } from "../units"
import { layer_ref } from "./properties/layer_ref"

export const pcb_trace_hint = z
  .object({
    type: z.literal("pcb_trace_hint"),
    pcb_port_id: z.string(),
    pcb_component_id: z.string(),
    route: z.array(
      z.object({
        x: distance,
        y: distance,
        via: z.boolean().optional(),
        to_layer: layer_ref.optional(),
      })
    ),
  })
  .describe("A hint that was used to generate a PCB trace")

export type PcbTraceHint = z.infer<typeof pcb_trace_hint>
export type PcbTraceHintInput = z.input<typeof pcb_trace_hint>
