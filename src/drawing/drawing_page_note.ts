import {
  drawing_paper_position,
  validate_drawing_annotation_position,
} from "./drawing_annotation_position"
import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"
export const drawing_page_note = z
  .object({
    type: z.literal("drawing_page_note"),
    drawing_page_note_id: z.string().trim().min(1),
    drawing_page_id: z.string().trim().min(1),
    position: drawing_paper_position.optional(),
    x_offset_from_view_center: z.number().finite().optional(),
    y_offset_from_view_center: z.number().finite().optional(),
    drawing_part_view_id: z.string().trim().min(1).optional(),
    drawing_explosion_view_id: z.string().trim().min(1).optional(),
    text: z
      .string()
      .refine((s) => s.trim().length > 0, "Note text must not be blank"),
    font_size: z.number().finite().positive().optional(),
  })
  .superRefine((r, ctx) => {
    validate_drawing_annotation_position(r.position, r, ctx)
    const hasView =
      r.drawing_part_view_id !== undefined ||
      r.drawing_explosion_view_id !== undefined
    if (
      r.drawing_part_view_id !== undefined &&
      r.drawing_explosion_view_id !== undefined
    )
      ctx.addIssue({
        code: "custom",
        message: "Provide at most one view reference",
      })
    if (
      (r.x_offset_from_view_center !== undefined ||
        r.y_offset_from_view_center !== undefined) &&
      !hasView
    )
      ctx.addIssue({
        code: "custom",
        message: "View-center offsets require a view reference",
      })
  })
  .describe(
    "Plain text on a drawing sheet. position is the left text baseline relative to the drawing origin in paper mm (+X right, +Y up). Each axis may instead use x_offset_from_view_center/y_offset_from_view_center, requiring a part or explosion view on the same page. font_size is paper mm, default 2.7. Consumers validate the page reference and note position; text is escaped, never markup.",
  )
export interface DrawingPageNote {
  type: "drawing_page_note"
  drawing_page_note_id: string
  drawing_page_id: string
  position?: { x?: number; y?: number }
  x_offset_from_view_center?: number
  y_offset_from_view_center?: number
  drawing_part_view_id?: string
  drawing_explosion_view_id?: string
  text: string
  font_size?: number
}
export type DrawingPageNoteInput = z.input<typeof drawing_page_note>
expectTypesMatch<DrawingPageNote, z.infer<typeof drawing_page_note>>(true)
