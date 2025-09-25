import { type Point, point } from "src/common"
import { getZodPrefixedIdWithDefault } from "src/common/getZodPrefixedIdWithDefault"
import {
  type LayerRef,
  type VisibleLayer,
  visible_layer,
} from "src/pcb/properties/layer_ref"
import { type Length, distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_fabrication_note_text = z
  .object({
    type: z.literal("pcb_fabrication_note_text"),
    pcb_fabrication_note_text_id: getZodPrefixedIdWithDefault(
      "pcb_fabrication_note_text",
    ),
    subcircuit_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
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

export type PcbFabricationNoteTextInput = z.input<
  typeof pcb_fabrication_note_text
>
type InferredPcbFabricationNoteText = z.infer<typeof pcb_fabrication_note_text>

/**
 * Defines a fabrication note in text on the PCB, useful for leaving notes for assemblers or fabricators
 */
export interface PcbFabricationNoteText {
  type: "pcb_fabrication_note_text"
  pcb_fabrication_note_text_id: string
  subcircuit_id?: string
  pcb_group_id?: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
  layer: VisibleLayer
  anchor_position: Point
  anchor_alignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  color?: string
}

/**
 * @deprecated use PcbFabricationNoteText
 */
export type PCBFabricationNoteText = PcbFabricationNoteText

expectTypesMatch<PcbFabricationNoteText, InferredPcbFabricationNoteText>(true)
