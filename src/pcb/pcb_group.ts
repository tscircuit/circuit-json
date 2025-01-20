import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_group = z
  .object({
    type: z.literal("pcb_group"),
    pcb_group_id: getZodPrefixedIdWithDefault("pcb_group"),
    is_subcircuit: z.boolean().optional(),
    subcircuit_id: z.string().optional(),
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
  is_subcircuit?: boolean
  subcircuit_id?: string
  width: Length
  height: Length
  center: Point
  pcb_component_ids: string[]
  name?: string
  description?: string
}

expectTypesMatch<PcbGroup, InferredPcbGroup>(true)
