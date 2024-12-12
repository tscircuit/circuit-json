import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_group = z
  .object({
    type: z.literal("pcb_group"),
    pcb_group_id: getZodPrefixedIdWithDefault("pcb_group"),
    width: length,
    height: length,
    center: point,
    pcb_component_ids: z.array(z.string()),
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .describe("Defines a group of components on the PCB")

export type PcbGroupInput = z.input<typeof pcb_group>
type InferredPcbGroup = z.infer<typeof pcb_group>

/**
 * Defines a group of components on the PCB
 */
export interface PcbGroup {
  type: "pcb_group"
  pcb_group_id: string
  width: Length
  height: Length
  center: Point
  pcb_component_ids: string[]
  name?: string
  description?: string
}

/**
 * @deprecated use PcbGroup
 */
export type PCBGroup = PcbGroup

expectTypesMatch<PcbGroup, InferredPcbGroup>(true) 