import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

/**
 * Describes where pin 1 is located on an unrotated, top-view PCB footprint.
 */
export const pcb_pin1_location = z.enum([
  "leftside_top",
  "leftside_bottom",
  "rightside_top",
  "rightside_bottom",
  "topside_left",
  "topside_right",
  "bottomside_left",
  "bottomside_right",
])

type InferredPcbPin1Location = z.infer<typeof pcb_pin1_location>

export type PcbPin1Location =
  | "leftside_top"
  | "leftside_bottom"
  | "rightside_top"
  | "rightside_bottom"
  | "topside_left"
  | "topside_right"
  | "bottomside_left"
  | "bottomside_right"

expectTypesMatch<PcbPin1Location, InferredPcbPin1Location>(true)
