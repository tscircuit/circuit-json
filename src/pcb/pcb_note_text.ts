import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { distance, rotation, type Length, type Rotation } from "src/units"
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
    layer: visible_layer.default("top"),
    is_mirrored_from_top_view: z.boolean().optional(),
    color: z.string().optional(),
    ccw_rotation: rotation.default(0),
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
  layer: VisibleLayer
  is_mirrored_from_top_view?: boolean
  color?: string
  ccw_rotation: Rotation
}

expectTypesMatch<PcbNoteText, InferredPcbNoteText>(true)
