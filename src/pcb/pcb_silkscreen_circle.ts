import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import {
  layer_ref,
  visible_layer,
  type LayerRef,
  type VisibleLayer,
} from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { distance, type Distance } from "src/units"

export const pcb_silkscreen_circle = z
  .object({
    type: z.literal("pcb_silkscreen_circle"),
    pcb_silkscreen_circle_id: getZodPrefixedIdWithDefault(
      "pcb_silkscreen_circle",
    ),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    radius: length,
    layer: visible_layer,
    stroke_width: distance,
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
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  radius: Length
  layer: VisibleLayer
  stroke_width: Distance
}

expectTypesMatch<PcbSilkscreenCircle, InferredPcbSilkscreenCircle>(true)
