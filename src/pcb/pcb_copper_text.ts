import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { distance, length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  ninePointAnchor,
  type NinePointAnchor,
} from "src/common/NinePointAnchor"

export const pcb_copper_text = z
  .object({
    type: z.literal("pcb_copper_text"),
    pcb_copper_text_id: getZodPrefixedIdWithDefault("pcb_copper_text"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: distance.default("0.2mm"),
    pcb_component_id: z.string(),
    text: z.string(),
    is_knockout: z.boolean().default(false).optional(),
    knockout_padding: z
      .object({
        left: length,
        top: length,
        bottom: length,
        right: length,
      })
      .default({
        left: "0.2mm",
        top: "0.2mm",
        bottom: "0.2mm",
        right: "0.2mm",
      })
      .optional(),
    ccw_rotation: z.number().optional(),
    layer: layer_ref,
    is_mirrored: z.boolean().default(false).optional(),
    anchor_position: point.default({ x: 0, y: 0 }),
    anchor_alignment: ninePointAnchor.default("center"),
  })
  .describe("Defines copper text on the PCB")

export type PcbCopperTextInput = z.input<typeof pcb_copper_text>
type InferredPcbCopperText = z.infer<typeof pcb_copper_text>

/**
 * Defines copper text on the PCB
 */
export interface PcbCopperText {
  type: "pcb_copper_text"
  pcb_copper_text_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
  is_knockout?: boolean
  knockout_padding?: {
    left: Length
    top: Length
    bottom: Length
    right: Length
  }
  ccw_rotation?: number
  layer: LayerRef
  is_mirrored?: boolean
  anchor_position: Point
  anchor_alignment: NinePointAnchor
}

/**
 * @deprecated use PcbCopperText
 */
export type PCBCopperText = PcbCopperText

expectTypesMatch<PcbCopperText, InferredPcbCopperText>(true)
