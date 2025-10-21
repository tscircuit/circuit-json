import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_note_text = z
  .object({
    type: z.literal("pcb_note_text"),
    pcb_note_text_id: getZodPrefixedIdWithDefault("pcb_note_text"),
    pcb_component_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    name: z.string().optional(),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: distance.default("1mm"),
    text: z.string().optional(),
    anchor_position: point.default({ x: 0, y: 0 }),
    anchor_alignment: z
      .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
      .default("center"),
    color: z.string().optional(),
  })
  .describe("Defines a documentation note in text on the PCB")

export type PcbNoteTextInput = z.input<typeof pcb_note_text>
type InferredPcbNoteText = z.infer<typeof pcb_note_text>

/**
 * Defines a documentation note in text on the PCB
 */
export interface PcbNoteText {
  type: "pcb_note_text"
  pcb_note_text_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  name?: string
  font: "tscircuit2024"
  font_size: Length
  text?: string
  anchor_position: Point
  anchor_alignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  color?: string
}

expectTypesMatch<PcbNoteText, InferredPcbNoteText>(true)
