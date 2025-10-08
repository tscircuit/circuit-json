import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_board = z
  .object({
    type: z.literal("source_board"),
    source_board_id: z.string(),
    source_group_id: z.string(),
    title: z.string().optional(),
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
}

expectTypesMatch<SourceBoard, InferredSourceBoard>(true)
