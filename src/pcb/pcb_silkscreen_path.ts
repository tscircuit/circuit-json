import { z } from "zod"
import { visible_layer } from "./properties/layer_ref"
import { point } from "src/common"
import { length } from "src/units"

export const pcb_silkscreen_path = z
  .object({
    type: z.literal("pcb_silkscreen_path"),
    pcb_silkscreen_path_id: z.string(),
    pcb_component_id: z.string(),
    layer: visible_layer,
    route: z.array(point),
    stroke_width: length,
  })
  .describe("Defines a silkscreen path on the PCB")

export type PcbSilkscreenPath = z.infer<typeof pcb_silkscreen_path>
export type PcbSilkscreenPathInput = z.input<typeof pcb_silkscreen_path>
