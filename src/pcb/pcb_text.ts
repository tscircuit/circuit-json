import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_text = z
  .object({
    type: z.literal("pcb_text"),
    pcb_text_id: getZodPrefixedIdWithDefault("pcb_text"),
    text: z.string(),
    center: point,
    layer: layer_ref,
    width: length,
    height: length,
    lines: z.number(),
    align: z.enum(["bottom_left"]),
  })
  .describe("Defines text on the PCB")

export type PcbTextInput = z.input<typeof pcb_text>
type InferredPcbText = z.infer<typeof pcb_text>

/**
 * Defines text on the PCB
 */
export interface PcbText {
  type: "pcb_text"
  pcb_text_id: string
  text: string
  center: Point
  layer: LayerRef
  width: Length
  height: Length
  lines: number
  align: "bottom_left"
}

/**
 * @deprecated use PcbText
 */
export type PCBText = PcbText

expectTypesMatch<PcbText, InferredPcbText>(true)
