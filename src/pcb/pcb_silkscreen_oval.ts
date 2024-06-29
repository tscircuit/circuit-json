import { z } from "zod"
import { distance } from "../units"
import { layer_ref, visible_layer } from "./properties/layer_ref"
import { point } from "src/common/point"

export const pcb_silkscreen_oval = z
  .object({
    type: z.literal("pcb_silkscreen_oval"),
    pcb_silkscreen_oval_id: z.string(),
    pcb_component_id: z.string(),
    center: point,
    radius_x: distance,
    radius_y: distance,
    layer: visible_layer,
  })
  .describe("Defines a silkscreen oval on the PCB");

export type PcbSilkscreenOval = z.infer<typeof pcb_silkscreen_oval>
export type PcbSilkscreenOvalInput = z.input<typeof pcb_silkscreen_oval>
