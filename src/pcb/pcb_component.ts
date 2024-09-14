import { z } from "zod"
import { point, type Point } from "../common"
import { layer_ref, type LayerRef } from "./properties/layer_ref"
import { rotation, length, type Rotation, type Length } from "../units"
import { getZodPrefixedIdWithDefault } from "src/common/getZodPrefixedIdWithDefault"
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
  })
  .describe("Defines a component on the PCB")

export type PCBComponentInput = z.input<typeof pcb_component>
type InferredPCBComponent = z.infer<typeof pcb_component>

export interface PcbComponent {
  type: "pcb_component"
  pcb_component_id: string
  source_component_id: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  width: Length
  height: Length
}

/**
 * @deprecated use PcbComponent
 */
export type PCBComponent = PcbComponent

expectTypesMatch<PcbComponent, InferredPCBComponent>(true)
