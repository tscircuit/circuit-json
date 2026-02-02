import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_courtyard_circle = z
  .object({
    type: z.literal("pcb_courtyard_circle"),
    pcb_courtyard_circle_id: getZodPrefixedIdWithDefault(
      "pcb_courtyard_circle",
    ),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    radius: length,
    layer: visible_layer,
    color: z.string().optional(),
  })
  .describe("Defines a courtyard circle on the PCB")

export type PcbCourtyardCircleInput = z.input<typeof pcb_courtyard_circle>
type InferredPcbCourtyardCircle = z.infer<typeof pcb_courtyard_circle>

/**
 * Defines a courtyard circle on the PCB
 */
export interface PcbCourtyardCircle {
  type: "pcb_courtyard_circle"
  pcb_courtyard_circle_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  radius: Length
  layer: VisibleLayer
  color?: string
}

expectTypesMatch<PcbCourtyardCircle, InferredPcbCourtyardCircle>(true)
