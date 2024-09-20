import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import {
  visible_layer,
  type VisibleLayerRef,
} from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_silkscreen_path = z
  .object({
    type: z.literal("pcb_silkscreen_path"),
    pcb_silkscreen_path_id: getZodPrefixedIdWithDefault("pcb_silkscreen_path"),
    pcb_component_id: z.string(),
    layer: visible_layer,
    route: z.array(point),
    stroke_width: length,
  })
  .describe("Defines a silkscreen path on the PCB")

export type PcbSilkscreenPathInput = z.input<typeof pcb_silkscreen_path>
type InferredPcbSilkscreenPath = z.infer<typeof pcb_silkscreen_path>

/**
 * Defines a silkscreen path on the PCB
 */
export interface PcbSilkscreenPath {
  type: "pcb_silkscreen_path"
  pcb_silkscreen_path_id: string
  pcb_component_id: string
  layer: VisibleLayerRef
  route: Point[]
  stroke_width: Length
}

/**
 * @deprecated use PcbSilkscreenPath
 */
export type PcbSilkscreenPathDeprecated = PcbSilkscreenPath

expectTypesMatch<PcbSilkscreenPath, InferredPcbSilkscreenPath>(true)
