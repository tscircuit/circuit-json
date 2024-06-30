import { z } from "zod"
import { distance } from "../units"
import { layer_ref, visible_layer } from "./properties/layer_ref"
import { point } from "src/common/point"

export const pcb_silkscreen_pill = z
  .object({
    type: z.literal("pcb_silkscreen_pill"),
    pcb_silkscreen_pill_id: z.string(),
    pcb_component_id: z.string(),
    center: point,
    width: distance,
    height: distance,
    layer: visible_layer,
  })
  .describe("Defines a silkscreen pill on the PCB")

export type PcbSilkscreenPill = z.infer<typeof pcb_silkscreen_pill>
export type PcbSilkscreenPillInput = z.input<typeof pcb_silkscreen_pill>
