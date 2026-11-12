import { z } from "zod"

export const drawing_paper_position = z.object({
  x: z.number().finite().optional(),
  y: z.number().finite().optional(),
})
/** Each axis uses either an origin-relative paper coordinate or a view-center
 * offset. An explicit zero selects that mode; no axis is implicit. */
export function validate_drawing_annotation_position(
  position: { x?: number; y?: number } | undefined,
  offsets: {
    x_offset_from_view_center?: number
    y_offset_from_view_center?: number
  },
  ctx: z.RefinementCtx,
) {
  for (const [axis, offset] of [
    ["x", "x_offset_from_view_center"],
    ["y", "y_offset_from_view_center"],
  ] as const) {
    if ((position?.[axis] !== undefined) === (offsets[offset] !== undefined))
      ctx.addIssue({
        code: "custom",
        path: [offset],
        message: `Provide exactly one paper ${axis} coordinate or ${offset}`,
      })
  }
}
