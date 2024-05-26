import { z } from "zod"
import { distance } from "../units"
import { layer_ref, visible_layer } from "./properties/layer_ref"

export const pcb_silkscreen_line = z
  .object({
    type: z.literal("pcb_silkscreen_line"),
    pcb_silkscreen_line_id: z.string(),
    pcb_component_id: z.string(),
    stroke_width: distance.default("0.1mm"),
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
    layer: visible_layer,
  })
  .describe("Defines a silkscreen line on the PCB")

export type PcbSilkscreenLine = z.infer<typeof pcb_silkscreen_line>
export type PcbSilkscreenLineInput = z.input<typeof pcb_silkscreen_line>
