import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"

const paper_point = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
})

export const drawing_dimension_line = z
  .object({
    type: z.literal("drawing_dimension_line"),
    drawing_dimension_line_id: z.string().trim().min(1),
    drawing_part_view_id: z.string().trim().min(1),
    start: paper_point,
    end: paper_point,
    text: z
      .string()
      .refine(
        (text) => text.trim().length > 0,
        "Dimension text must not be blank",
      ),
    edge_ref_start: paper_point.optional(),
    edge_ref_end: paper_point.optional(),
    edge_ref_name: z
      .string()
      .refine(
        (name) => name.trim().length > 0,
        "Edge reference name must not be blank",
      )
      .optional(),
    name: z.string().trim().min(1).optional(),
  })
  .refine(
    (line) => line.start.x !== line.end.x || line.start.y !== line.end.y,
    { message: "Dimension line endpoints must be distinct", path: ["end"] },
  )
  .describe(
    "A resolved dimension annotation associated with a drawing part view. start/end and optional edge_ref_start/edge_ref_end use page-centered paper mm, +X right/+Y up. Core resolves model measurement and formats the required text before emitting this record; renderers draw the supplied line, text and optional witness attachments without resolving native geometry or deriving values from paper length. Each witness attachment is independently optional. edge_ref_name is optional exact nonblank model-feature metadata, never a geometry definition or a rendering dependency.",
  )

/** Resolved drawing strokes in page-centered paper mm, +X right/+Y up.
 * Core computes the model measurement, projection, placement and formatted text.
 * A renderer draws these supplied coordinates without resolving model geometry.
 * The preformatted text is preserved exactly and need not equal paper length.
 */
export interface DrawingDimensionLine {
  type: "drawing_dimension_line"
  drawing_dimension_line_id: string
  drawing_part_view_id: string
  /** Distinct endpoints of the visible dimension line, in paper mm. */
  start: { x: number; y: number }
  end: { x: number; y: number }
  /** Required preformatted measured value, preserved exactly. */
  text: string
  /** Optional attachment of a witness line leading to start. */
  edge_ref_start?: { x: number; y: number }
  /** Independently optional attachment of a witness line leading to end. */
  edge_ref_end?: { x: number; y: number }
  /** Exact nonblank model feature name; optional metadata only. */
  edge_ref_name?: string
  /** Stable annotation identity, separate from the measured text. */
  name?: string
}

export type DrawingDimensionLineInput = z.input<typeof drawing_dimension_line>
expectTypesMatch<DrawingDimensionLine, z.infer<typeof drawing_dimension_line>>(
  true,
)
