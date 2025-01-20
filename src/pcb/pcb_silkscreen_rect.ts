import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_silkscreen_rect = z
  .object({
    type: z.literal("pcb_silkscreen_rect"),
    pcb_silkscreen_rect_id: getZodPrefixedIdWithDefault("pcb_silkscreen_rect"),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    width: length,
    height: length,
    layer: layer_ref,
  })
  .describe("Defines a silkscreen rect on the PCB")

export type PcbSilkscreenRectInput = z.input<typeof pcb_silkscreen_rect>
type InferredPcbSilkscreenRect = z.infer<typeof pcb_silkscreen_rect>

/**
 * Defines a silkscreen rect on the PCB
 */
export interface PcbSilkscreenRect {
  type: "pcb_silkscreen_rect"
  pcb_silkscreen_rect_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  layer: LayerRef
}

/**
 * @deprecated use PcbSilkscreenRect
 */
export type PcbSilkscreenRectOld = PcbSilkscreenRect

expectTypesMatch<PcbSilkscreenRect, InferredPcbSilkscreenRect>(true)
