import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"
export const drawing_page_note = z
  .object({
    type: z.literal("drawing_page_note"),
    drawing_page_note_id: z.string().trim().min(1),
    drawing_page_id: z.string().trim().min(1),
    position: z.object({ x: z.number().finite(), y: z.number().finite() }),
    text: z
      .string()
      .refine((s) => s.trim().length > 0, "Note text must not be blank"),
    font_size: z.number().finite().positive().optional(),
  })
  .describe(
    "Plain text on a drawing sheet. position is the left text baseline in page-centered paper mm (+X right, +Y up). font_size is paper mm, default 2.7. Consumers validate the page reference and note position; text is escaped, never markup.",
  )
export interface DrawingPageNote {
  type: "drawing_page_note"
  drawing_page_note_id: string
  drawing_page_id: string
  position: { x: number; y: number }
  text: string
  font_size?: number
}
export type DrawingPageNoteInput = z.input<typeof drawing_page_note>
expectTypesMatch<DrawingPageNote, z.infer<typeof drawing_page_note>>(true)
