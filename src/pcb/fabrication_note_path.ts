import { z } from "zod"
import { visible_layer } from "./properties/layer_ref"
import { point } from "src/common"
import { length } from "src/units"

export const fabrication_note_path = z
  .object({
    type: z.literal("fabrication_note_path"),
    pcb_silkscreen_path_id: z.string(),
    pcb_component_id: z.string(),
    layer: visible_layer,
    route: z.array(point),
    stroke_width: length,
  })
  .describe(
    "Defines a fabrication path on the PCB for fabricators or assemblers"
  )

export type FabricationNotePath = z.infer<typeof fabrication_note_path>
export type FabricationNotePathInput = z.input<typeof fabrication_note_path>
