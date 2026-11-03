import { z } from "zod"
import type { Point } from "../common/point"
import { expectTypesMatch } from "../utils/expect-types-match"
import { system_block_id, system_block_point } from "./geometry"

export const system_block_component = z
  .object({
    type: z.literal("system_block_component"),
    system_block_component_id: system_block_id,
    system_block_page_id: system_block_id,
    system_block_group_id: system_block_id.optional(),
    name: system_block_id.optional(),
    display_name: z.string().optional(),
    description: z.string().optional(),
    center: system_block_point,
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
    pcb_component_ids: z.array(system_block_id).min(1).optional(),
    pcb_group_id: system_block_id.optional(),
  })
  .describe(
    "A functional block with required resolved center and dimensions in page-centered diagram mm. PCB associations use resolved IDs and do not affect its diagram geometry.",
  )

/** A functional block with resolved geometry and optional PCB associations. */
export interface SystemBlockComponent {
  type: "system_block_component"
  system_block_component_id: string
  system_block_page_id: string
  /** Immediate containing diagram group; omitted for a top-level block. */
  system_block_group_id?: string
  name?: string
  display_name?: string
  description?: string
  /** Absolute page-local center in mm, including when inside a group. */
  center: Point
  /** Positive resolved dimensions in diagram mm, independent of PCB size. */
  width: number
  height: number
  /** Resolved selection from pcbComponentName or pcbComponentNames. */
  pcb_component_ids?: string[]
  /** Resolved pcbSubcircuitName; alone selects the whole PCB group. */
  pcb_group_id?: string
}

export type SystemBlockComponentInput = z.input<typeof system_block_component>
expectTypesMatch<SystemBlockComponent, z.infer<typeof system_block_component>>(
  true,
)
