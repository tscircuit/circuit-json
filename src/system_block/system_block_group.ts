import { z } from "zod"
import type { Point } from "../common/point"
import { expectTypesMatch } from "../utils/expect-types-match"
import { system_block_id, system_block_point } from "./geometry"

export const system_block_group = z
  .object({
    type: z.literal("system_block_group"),
    system_block_group_id: system_block_id,
    system_block_page_id: system_block_id,
    parent_system_block_group_id: system_block_id.optional(),
    name: system_block_id.optional(),
    display_name: z.string().optional(),
    description: z.string().optional(),
    center: system_block_point,
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
    pcb_component_ids: z.array(system_block_id).min(1).optional(),
    pcb_group_id: system_block_id.optional(),
  })
  .refine(
    (group) =>
      group.parent_system_block_group_id !== group.system_block_group_id,
    {
      message: "A system block group cannot be its own parent",
      path: ["parent_system_block_group_id"],
    },
  )
  .describe(
    "A subsystem boundary with resolved center and dimensions in page-centered diagram mm. Nested groups share page coordinates; parent membership is not a transform.",
  )

/** A subsystem boundary with resolved bounds, including space for its text. */
export interface SystemBlockGroup {
  type: "system_block_group"
  system_block_group_id: string
  system_block_page_id: string
  /** Immediate parent on the same page; omitted for a top-level group. */
  parent_system_block_group_id?: string
  name?: string
  display_name?: string
  description?: string
  /** Absolute page-local center in mm; never relative to the parent group. */
  center: Point
  /** Positive resolved dimensions in diagram mm. */
  width: number
  height: number
  /** Resolved selection from pcbComponentName or pcbComponentNames. */
  pcb_component_ids?: string[]
  /** Resolved pcbSubcircuitName; alone selects the whole PCB group. */
  pcb_group_id?: string
}

export type SystemBlockGroupInput = z.input<typeof system_block_group>
expectTypesMatch<SystemBlockGroup, z.infer<typeof system_block_group>>(true)
