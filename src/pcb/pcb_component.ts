import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { rotation, length, type Rotation, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_component = z
  .object({
    type: z.literal("pcb_component"),
    pcb_component_id: getZodPrefixedIdWithDefault("pcb_component"),
    source_component_id: z.string(),
    center: point,
    layer: layer_ref,
    rotation: rotation,
    width: length,
    height: length,
    do_not_place: z.boolean().optional().default(false),
    subcircuit_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
  })
  .describe("Defines a component on the PCB")

export type PcbComponentInput = z.input<typeof pcb_component>
type InferredPcbComponent = z.infer<typeof pcb_component>

/**
 * Defines a component on the PCB
 */
export interface PcbComponent {
  type: "pcb_component"
  pcb_component_id: string
  source_component_id: string
  subcircuit_id?: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  width: Length
  height: Length
  do_not_place: boolean
  pcb_group_id?: string
}

/**
 * @deprecated use PcbComponent
 */
export type PCBComponent = PcbComponent

expectTypesMatch<PcbComponent, InferredPcbComponent>(true)
