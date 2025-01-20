import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import {
  layer_ref,
  visible_layer,
  type LayerRef,
} from "src/pcb/properties/layer_ref"
import { point, type Point } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_fabrication_note_path = z
  .object({
    type: z.literal("pcb_fabrication_note_path"),
    pcb_fabrication_note_path_id: getZodPrefixedIdWithDefault(
      "pcb_fabrication_note_path",
    ),
    pcb_component_id: z.string(),
    subcircuit_id: z.string().optional(),
    layer: layer_ref,
    route: z.array(point),
    stroke_width: length,
    color: z.string().optional(),
  })
  .describe(
    "Defines a fabrication path on the PCB for fabricators or assemblers",
  )

export type PcbFabricationNotePathInput = z.input<
  typeof pcb_fabrication_note_path
>
type InferredPcbFabricationNotePath = z.infer<typeof pcb_fabrication_note_path>

/**
 * Defines a fabrication path on the PCB for fabricators or assemblers
 */
export interface PcbFabricationNotePath {
  type: "pcb_fabrication_note_path"
  pcb_fabrication_note_path_id: string
  pcb_component_id: string
  subcircuit_id?: string
  layer: LayerRef
  route: Point[]
  stroke_width: Length
  color?: string
}

/**
 * @deprecated use PcbFabricationNotePath
 */
export type PCBFabricationNotePath = PcbFabricationNotePath

expectTypesMatch<PcbFabricationNotePath, InferredPcbFabricationNotePath>(true)
