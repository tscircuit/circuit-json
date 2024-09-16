import { z } from "zod"
import { visible_layer } from "./properties/layer_ref"
import { point } from "src/common"
import { distance } from "src/units"
import { getZodPrefixedIdWithDefault } from "src/common/getZodPrefixedIdWithDefault"

export const pcb_fabrication_note_text = z
  .object({
    type: z.literal("pcb_fabrication_note_text"),
    pcb_fabrication_note_text_id: getZodPrefixedIdWithDefault(
      "pcb_fabrication_note_text",
    ),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: distance.default("1mm"),
    pcb_component_id: z.string(),
    text: z.string(),
    layer: visible_layer,
    anchor_position: point.default({ x: 0, y: 0 }),
    anchor_alignment: z
      .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
      .default("center"),
    color: z.string().optional(),
  })
  .describe(
    "Defines a fabrication note in text on the PCB, useful for leaving notes for assemblers or fabricators",
  )

export type PcbFabricationNoteText = z.infer<typeof pcb_fabrication_note_text>
export type PcbFabricationNoteTextInput = z.input<
  typeof pcb_fabrication_note_text
>
