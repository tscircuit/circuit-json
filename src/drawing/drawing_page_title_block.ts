import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Document metadata referencing ISO 7200:2004; layout is renderer-owned. */
export const drawing_page_title_block = z
  .object({
    type: z.literal("drawing_page_title_block"),
    drawing_page_title_block_id: z.string().min(1),
    drawing_page_id: z.string().min(1),
    title: z.string().min(1),
    legal_owner: z.string().optional(),
    identification_number: z.string().optional(),
    revision_index: z.string().optional(),
    date_of_issue: z.string().optional(),
    creator: z.string().optional(),
    approval_person: z.string().optional(),
    sheet_number: z.number().int().positive().optional(),
    number_of_sheets: z.number().int().positive().optional(),
  })
  .refine(
    (block) =>
      block.sheet_number == null ||
      block.number_of_sheets == null ||
      block.sheet_number <= block.number_of_sheets,
    {
      message: "sheet_number must not exceed number_of_sheets",
      path: ["sheet_number"],
    },
  )
export interface DrawingPageTitleBlock {
  type: "drawing_page_title_block"
  drawing_page_title_block_id: string
  drawing_page_id: string
  title: string
  legal_owner?: string
  identification_number?: string
  revision_index?: string
  date_of_issue?: string
  creator?: string
  approval_person?: string
  sheet_number?: number
  number_of_sheets?: number
}
export type DrawingPageTitleBlockInput = z.input<
  typeof drawing_page_title_block
>
expectTypesMatch<
  DrawingPageTitleBlock,
  z.infer<typeof drawing_page_title_block>
>(true)
