import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import {
  type LayerRef,
  type VisibleLayer,
  layer_ref,
  visible_layer,
} from "src/pcb/properties/layer_ref"
import { type Distance, distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_silkscreen_oval = z
  .object({
    type: z.literal("pcb_silkscreen_oval"),
    pcb_silkscreen_oval_id: getZodPrefixedIdWithDefault("pcb_silkscreen_oval"),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    radius_x: distance,
    radius_y: distance,
    layer: visible_layer,
  })
  .describe("Defines a silkscreen oval on the PCB")

export type PcbSilkscreenOvalInput = z.input<typeof pcb_silkscreen_oval>
type InferredPcbSilkscreenOval = z.infer<typeof pcb_silkscreen_oval>

/**
 * Defines a silkscreen oval on the PCB
 */
export interface PcbSilkscreenOval {
  type: "pcb_silkscreen_oval"
  pcb_silkscreen_oval_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  radius_x: Distance
  radius_y: Distance
  layer: VisibleLayer
}

/**
 * @deprecated use PcbSilkscreenOval
 */
export type PcbSilkscreenOvalDeprecated = PcbSilkscreenOval

expectTypesMatch<PcbSilkscreenOval, InferredPcbSilkscreenOval>(true)
