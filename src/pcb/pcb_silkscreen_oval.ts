import { z } from "zod"
import { point, type Point, getPrimaryId } from "src/common"
import {
  layer_ref,
  type LayerRef,
  visible_layer,
  type VisibleLayer,
} from "src/pcb/properties/layer_ref"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_silkscreen_oval = z
  .object({
    type: z.literal("pcb_silkscreen_oval"),
    pcb_silkscreen_oval_id: getPrimaryId("pcb_silkscreen_oval"),
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
