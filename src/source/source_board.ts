import { z } from "zod"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_board = z
  .object({
    type: z.literal("source_board"),
    source_board_id: z.string(),
    source_group_id: z.string(),
    title: z.string().optional(),
    min_via_diameter: length.optional(),
    min_via_hole: length.optional(),
  })
  .describe("Defines a board in the source domain")

export type SourceBoardInput = z.input<typeof source_board>
type InferredSourceBoard = z.infer<typeof source_board>

/**
 * Defines a board in the source domain
 */
export interface SourceBoard {
  type: "source_board"
  source_board_id: string
  source_group_id: string
  title?: string
  min_via_diameter?: Length
  min_via_hole?: Length
}

expectTypesMatch<SourceBoard, InferredSourceBoard>(true)
