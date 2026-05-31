import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_courtyard_pill = z
  .object({
    type: z.literal("pcb_courtyard_pill"),
    pcb_courtyard_pill_id: getZodPrefixedIdWithDefault("pcb_courtyard_pill"),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    width: length,
    height: length,
    radius: length,
    layer: visible_layer,
    color: z.string().optional(),
  })
  .describe("Defines a courtyard pill on the PCB")

export type PcbCourtyardPillInput = z.input<typeof pcb_courtyard_pill>
type InferredPcbCourtyardPill = z.infer<typeof pcb_courtyard_pill>

/**
 * Defines a courtyard pill on the PCB
 */
export interface PcbCourtyardPill {
  type: "pcb_courtyard_pill"
  pcb_courtyard_pill_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  radius: Length
  layer: VisibleLayer
  color?: string
}

expectTypesMatch<PcbCourtyardPill, InferredPcbCourtyardPill>(true)
