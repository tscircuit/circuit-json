import { z } from "zod"
import { visible_layer } from "./properties/layer_ref"
import { point } from "src/common"

export const pcb_silkscreen_text = z
  .object({
    type: z.literal("pcb_silkscreen_text"),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: z.number().default(1),
    pcb_component_id: z.string(),
    text: z.string(),
    layer: visible_layer,
    center: point,
  })
  .describe("Defines silkscreen text on the PCB")

export type PcbSilkscreenText = z.infer<typeof pcb_silkscreen_text>
export type PcbSilkscreenTextInput = z.input<typeof pcb_silkscreen_text>
