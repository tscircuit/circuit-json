import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_fabrication_note_rect = z
  .object({
    type: z.literal("pcb_fabrication_note_rect"),
    pcb_fabrication_note_rect_id: getZodPrefixedIdWithDefault(
      "pcb_fabrication_note_rect",
    ),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    width: length,
    height: length,
    corner_radius: length.optional(),
    layer: visible_layer,
    stroke_width: length.default("0.1mm"),
    is_filled: z.boolean().optional(),
    has_stroke: z.boolean().optional(),
    is_stroke_dashed: z.boolean().optional(),
    color: z.string().optional(),
  })
  .describe("Defines a fabrication note rectangle on the PCB")

export type PcbFabricationNoteRectInput = z.input<
  typeof pcb_fabrication_note_rect
>
type InferredPcbFabricationNoteRect = z.infer<typeof pcb_fabrication_note_rect>

/**
 * Defines a fabrication note rectangle on the PCB
 */
export interface PcbFabricationNoteRect {
  type: "pcb_fabrication_note_rect"
  pcb_fabrication_note_rect_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  corner_radius?: Length
  layer: VisibleLayer
  stroke_width: Length
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
  color?: string
}

/**
 * @deprecated use PcbFabricationNoteRect
 */
export type PCBFabricationNoteRect = PcbFabricationNoteRect

expectTypesMatch<PcbFabricationNoteRect, InferredPcbFabricationNoteRect>(true)
