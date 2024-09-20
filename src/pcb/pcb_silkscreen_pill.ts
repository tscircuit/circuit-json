import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_silkscreen_pill = z
  .object({
    type: z.literal("pcb_silkscreen_pill"),
    pcb_silkscreen_pill_id: getZodPrefixedIdWithDefault("pcb_silkscreen_pill"),
    pcb_component_id: z.string(),
    center: point,
    width: length,
    height: length,
    layer: layer_ref,
  })
  .describe("Defines a silkscreen pill on the PCB")

export type PcbSilkscreenPillInput = z.input<typeof pcb_silkscreen_pill>
type InferredPcbSilkscreenPill = z.infer<typeof pcb_silkscreen_pill>

/**
 * Defines a silkscreen pill on the PCB
 */
export interface PcbSilkscreenPill {
  type: "pcb_silkscreen_pill"
  pcb_silkscreen_pill_id: string
  pcb_component_id: string
  center: Point
  width: Length
  height: Length
  layer: LayerRef
}

/**
 * @deprecated use PcbSilkscreenPill
 */
export type PcbSilkscreenPillDeprecated = PcbSilkscreenPill

expectTypesMatch<PcbSilkscreenPill, InferredPcbSilkscreenPill>(true)
