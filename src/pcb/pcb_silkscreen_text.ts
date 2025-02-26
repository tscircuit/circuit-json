import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { distance, length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_silkscreen_text = z
  .object({
    type: z.literal("pcb_silkscreen_text"),
    pcb_silkscreen_text_id: getZodPrefixedIdWithDefault("pcb_silkscreen_text"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: distance.default("0.2mm"),
    stroke_width: length.optional().default("1mm"),
    pcb_component_id: z.string(),
    text: z.string(),
    ccw_rotation: z.number().optional(),
    layer: layer_ref,
    is_mirrored: z.boolean().default(false).optional(),
    anchor_position: point.default({ x: 0, y: 0 }),
    anchor_alignment: z
      .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
      .default("center"),
  })
  .describe("Defines silkscreen text on the PCB")

export type PcbSilkscreenTextInput = z.input<typeof pcb_silkscreen_text>
type InferredPcbSilkscreenText = z.infer<typeof pcb_silkscreen_text>

/**
 * Defines silkscreen text on the PCB
 */
export interface PcbSilkscreenText {
  type: "pcb_silkscreen_text"
  pcb_silkscreen_text_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
  ccw_rotation?: number
  layer: LayerRef
  is_mirrored?: boolean
  anchor_position: Point
  anchor_alignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  stroke_width: Length
}

/**
 * @deprecated use PcbSilkscreenText
 */
export type PCBSilkscreenText = PcbSilkscreenText

expectTypesMatch<PcbSilkscreenText, InferredPcbSilkscreenText>(true)
