import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const drawing_page = z
  .object({
    type: z.literal("drawing_page"),
    drawing_page_id: z.string().min(1),
    name: z.string().optional(),
    display_name: z.string().optional(),
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
  })
  .describe(
    "A paper-space drawing page containing configured part views. Dimensions are mm.",
  )

export interface DrawingPage {
  type: "drawing_page"
  drawing_page_id: string
  name?: string
  display_name?: string
  width: number
  height: number
}
export type DrawingPageInput = z.input<typeof drawing_page>
expectTypesMatch<DrawingPage, z.infer<typeof drawing_page>>(true)
