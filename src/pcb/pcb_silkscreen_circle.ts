import { z } from "zod"
import { distance } from "../units"
import { layer_ref, visible_layer } from "./properties/layer_ref"

export const pcb_silkscreen_circle = z
  .object({
    type: z.literal("pcb_silkscreen_circle"),
    pcb_silkscreen_circle_id: z.string(),
    pcb_component_id: z.string(),
    width: distance,
    height: distance,
    layer: visible_layer,
  })
  .describe("Defines a silkscreen circle on the PCB")

export type PcbSilkscreenCircle = z.infer<typeof pcb_silkscreen_circle>
export type PcbSilkscreenCircleInput = z.input<typeof pcb_silkscreen_circle>
