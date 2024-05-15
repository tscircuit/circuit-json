import { z } from "zod"
import { distance } from "../units"
import { layer_ref, visible_layer } from "./properties/layer_ref"

export const pcb_silkscreen_rect = z
  .object({
    type: z.literal("pcb_silkscreen_rect"),
    pcb_silkscreen_rect_id: z.string(),
    pcb_component_id: z.string(),
    width: distance,
    height: distance,
    layer: visible_layer,
  })
  .describe("Defines a silkscreen rect on the PCB")

export type PcbSilkscreenRect = z.infer<typeof pcb_silkscreen_rect>
export type PcbSilkscreenRectInput = z.input<typeof pcb_silkscreen_rect>
