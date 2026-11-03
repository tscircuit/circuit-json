import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"
import { system_block_id } from "./geometry"

export const system_block_page = z
  .object({
    type: z.literal("system_block_page"),
    system_block_page_id: system_block_id,
    name: system_block_id.optional(),
    display_name: z.string().optional(),
    description: z.string().optional(),
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
  })
  .describe(
    "A resolved system diagram page. Dimensions are diagram mm, centered at (0, 0), +X right/+Y up. Layout is completed by the producer before emitting records.",
  )

/** A system overview with resolved page bounds in diagram mm. */
export interface SystemBlockPage {
  type: "system_block_page"
  system_block_page_id: string
  name?: string
  display_name?: string
  description?: string
  /** Positive resolved dimensions in diagram mm. */
  width: number
  height: number
}

export type SystemBlockPageInput = z.input<typeof system_block_page>
expectTypesMatch<SystemBlockPage, z.infer<typeof system_block_page>>(true)
