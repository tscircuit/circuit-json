import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { distance, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  ninePointAnchor,
  type NinePointAnchor,
} from "src/common/NinePointAnchor"

export const pcb_silkscreen_knockout_text = z
  .object({
    type: z.literal("pcb_silkscreen_knockout_text"),
    pcb_silkscreen_knockout_text_id: getZodPrefixedIdWithDefault(
      "pcb_silkscreen_knockout_text",
    ),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: distance.default("0.2mm"),
    pcb_component_id: z.string(),
    text: z.string(),
    padding: distance.default("0.2mm").optional(),
    corner_radius: distance.default("0mm").optional(),
    ccw_rotation: z.number().optional(),
    layer: layer_ref,
    is_mirrored: z.boolean().default(false).optional(),
    anchor_position: point.default({ x: 0, y: 0 }),
    anchor_alignment: ninePointAnchor.default("center"),
  })
  .describe("Defines knockout silkscreen text on the PCB")

export type PcbSilkscreenKnockoutTextInput = z.input<
  typeof pcb_silkscreen_knockout_text
>
type InferredPcbSilkscreenKnockoutText = z.infer<
  typeof pcb_silkscreen_knockout_text
>

/**
 * Defines knockout silkscreen text on the PCB
 */
export interface PcbSilkscreenKnockoutText {
  type: "pcb_silkscreen_knockout_text"
  pcb_silkscreen_knockout_text_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  font: "tscircuit2024"
  font_size: Length
  pcb_component_id: string
  text: string
  padding?: Length
  corner_radius?: Length
  ccw_rotation?: number
  layer: LayerRef
  is_mirrored?: boolean
  anchor_position: Point
  anchor_alignment: NinePointAnchor
}

expectTypesMatch<PcbSilkscreenKnockoutText, InferredPcbSilkscreenKnockoutText>(
  true,
)
