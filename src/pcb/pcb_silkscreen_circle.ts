import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_silkscreen_circle = z
  .object({
    type: z.literal("pcb_silkscreen_circle"),
    pcb_silkscreen_circle_id: getZodPrefixedIdWithDefault("pcb_silkscreen_circle"),
    pcb_component_id: z.string(),
    center: point,
    radius: length,
    layer: layer_ref,
  })
  .describe("Defines a silkscreen circle on the PCB")

export type PcbSilkscreenCircleInput = z.input<typeof pcb_silkscreen_circle>
type InferredPcbSilkscreenCircle = z.infer<typeof pcb_silkscreen_circle>

/**
 * Defines a silkscreen circle on the PCB
 */
export interface PcbSilkscreenCircle {
  type: "pcb_silkscreen_circle"
  pcb_silkscreen_circle_id: string
  pcb_component_id: string
  center: Point
  radius: Length
  layer: LayerRef
}

/**
 * @deprecated use PcbSilkscreenCircle
 */
export type PcbSilkscreenCircleInput = PcbSilkscreenCircleInput

expectTypesMatch<PcbSilkscreenCircle, InferredPcbSilkscreenCircle>(true)
