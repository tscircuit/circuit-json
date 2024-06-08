import { z } from "zod"
import { visible_layer } from "./properties/layer_ref"
import { point } from "src/common"
import { length } from "src/units"

export const pcb_fabrication_note_path = z
  .object({
    type: z.literal("pcb_fabrication_note_path"),
    fabrication_note_path_id: z.string(),
    pcb_component_id: z.string(),
    layer: visible_layer,
    route: z.array(point),
    stroke_width: length,
  })
  .describe(
    "Defines a fabrication path on the PCB for fabricators or assemblers"
  )

export type PcbFabricationNotePath = z.infer<typeof pcb_fabrication_note_path>
export type PcbFabricationNotePathInput = z.input<
  typeof pcb_fabrication_note_path
>
