import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "../common"
import { length, type Length } from "../units"
import { expectTypesMatch } from "../utils/expect-types-match"

export const pcb_group = z
  .object({
    type: z.literal("pcb_group"),
    pcb_group_id: getZodPrefixedIdWithDefault("pcb_group"),
    center: point,
    width: length,
    height: length,
    member_pcb_component_ids: z.array(z.string()),
  })
  .describe("Defines a group of PCB components")

export type PcbGroupInput = z.input<typeof pcb_group>
type InferredPcbGroup = z.infer<typeof pcb_group>

/**
 * Defines a group of PCB components
 */
export interface PcbGroup {
  type: "pcb_group"
  pcb_group_id: string
  center: Point
  width: Length
  height: Length
  member_pcb_component_ids: string[]
}

expectTypesMatch<PcbGroup, InferredPcbGroup>(true)
