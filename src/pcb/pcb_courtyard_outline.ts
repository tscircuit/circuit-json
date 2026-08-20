import { getZodPrefixedIdWithDefault } from "src/common"
import { type PointWithBulge, point_with_bulge } from "src/pcb/properties/brep"
import { type VisibleLayer, visible_layer } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

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
    outline: z.array(point_with_bulge).min(2),
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
  outline: PointWithBulge[]
}

/**
 * @deprecated use PcbCourtyardOutline
 */
export type PCBCourtyardOutline = PcbCourtyardOutline

expectTypesMatch<PcbCourtyardOutline, InferredPcbCourtyardOutline>(true)
