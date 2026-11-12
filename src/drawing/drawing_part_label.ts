import {
  drawing_paper_position,
  validate_drawing_annotation_position,
} from "./drawing_annotation_position"
import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"
import {
  drawing_part_selection,
  has_drawing_part_selection,
  type DrawingPartSelection,
} from "./drawing_assembly_stage"
export const drawing_part_label = drawing_part_selection
  .extend({
    type: z.literal("drawing_part_label"),
    drawing_part_label_id: z.string().trim().min(1),
    drawing_part_view_id: z.string().trim().min(1).optional(),
    drawing_explosion_view_id: z.string().trim().min(1).optional(),
    text: z
      .string()
      .refine((s) => s.trim().length > 0, "Label text must not be blank"),
    anchor: z.object({
      x: z.number().finite(),
      y: z.number().finite(),
      z: z.number().finite(),
    }),
    label_position: drawing_paper_position.optional(),
    x_offset_from_view_center: z.number().finite().optional(),
    y_offset_from_view_center: z.number().finite().optional(),
  })
  .superRefine((r, ctx) =>
    validate_drawing_annotation_position(r.label_position, r, ctx),
  )
  .refine(has_drawing_part_selection, "Part label requires explicit membership")
  .refine(
    (r) =>
      (r.drawing_part_view_id !== undefined) !==
      (r.drawing_explosion_view_id !== undefined),
    "Provide exactly one drawing part or explosion view reference",
  )
  .describe(
    "A leader annotation attached to selected parts. anchor is an assembled CAD-world point in mm (+Z up), translated with its target. label_position uses drawing-origin-relative paper mm (+X right, +Y up); x_offset_from_view_center/y_offset_from_view_center position text relative to its parent view. Each axis requires exactly one mode. Selected parts must be visible and share a displacement. Labels are authored; automatic placement and occlusion detection are not implied.",
  )
export interface DrawingPartLabel extends DrawingPartSelection {
  type: "drawing_part_label"
  drawing_part_label_id: string
  /** Exactly one view reference must be supplied. */
  drawing_part_view_id?: string
  drawing_explosion_view_id?: string
  text: string
  anchor: { x: number; y: number; z: number }
  /** Text baseline relative to the drawing origin; choose exactly one coordinate or view offset per axis. */
  label_position?: { x?: number; y?: number }
  x_offset_from_view_center?: number
  y_offset_from_view_center?: number
}
export type DrawingPartLabelInput = z.input<typeof drawing_part_label>
expectTypesMatch<DrawingPartLabel, z.infer<typeof drawing_part_label>>(true)
