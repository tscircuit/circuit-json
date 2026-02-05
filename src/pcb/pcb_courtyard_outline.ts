import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_courtyard_outline = z
  .object({
    type: z.literal("pcb_courtyard_outline"),
    pcb_courtyard_outline_id: getZodPrefixedIdWithDefault(
      "pcb_courtyard_outline",
    ),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    layer: visible_layer,
    outline: z.array(point).min(2),
  })
  .describe("Defines a courtyard outline on the PCB")

export type PcbCourtyardOutlineInput = z.input<typeof pcb_courtyard_outline>
type InferredPcbCourtyardOutline = z.infer<typeof pcb_courtyard_outline>

/**
 * Defines a courtyard outline on the PCB
 */
export interface PcbCourtyardOutline {
  type: "pcb_courtyard_outline"
  pcb_courtyard_outline_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  outline: Point[]
}

/**
 * @deprecated use PcbCourtyardOutline
 */
export type PCBCourtyardOutline = PcbCourtyardOutline

expectTypesMatch<PcbCourtyardOutline, InferredPcbCourtyardOutline>(true)
