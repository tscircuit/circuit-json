import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import { type LayerRef, layer_ref } from "src/pcb/properties/layer_ref"
import { type Length, type Rotation, length, rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

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
    do_not_place: z.boolean().optional(),
    subcircuit_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
    obstructs_within_bounds: z
      .boolean()
      .default(true)
      .describe(
        "Does this component take up all the space within its bounds on a layer. This is generally true except for when separated pin headers are being represented by a single component (in which case, chips can be placed between the pin headers) or for tall modules where chips fit underneath",
      ),
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
  do_not_place?: boolean
  pcb_group_id?: string
  obstructs_within_bounds: boolean
}

/**
 * @deprecated use PcbComponent
 */
export type PCBComponent = PcbComponent

expectTypesMatch<PcbComponent, InferredPcbComponent>(true)
