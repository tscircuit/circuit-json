import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"

export const drawing_dimension_orientation = z.enum([
  "horizontal",
  "vertical",
  "aligned",
])
export type DrawingDimensionOrientation = z.infer<
  typeof drawing_dimension_orientation
>

export const drawing_dimension = z
  .object({
    type: z.literal("drawing_dimension"),
    drawing_dimension_id: z.string().trim().min(1),
    drawing_part_view_id: z.string().trim().min(1),
    cad_named_edge_id: z.string().trim().min(1),
    name: z.string().trim().min(1).optional(),
    orientation: drawing_dimension_orientation.default("aligned"),
    offset: z.number().finite().default(8),
    precision: z.number().int().min(0).max(6).default(1),
  })
  .describe(
    "A linear dimension attached to one named CAD reference segment in a drawing part view. Aligned dimensions display the true 3D segment length; horizontal/vertical dimensions display its component along the view's right/up model axes. Values are derived in model millimeters, independently of viewport scale. Signed offset is perpendicular paper-space millimeters, default 8; precision is decimal places, default 1. Document consumers resolve owner/view/edge references and reject projected zero-length dimensions.",
  )

/** Resolved dimension intent. The edge association is authoritative; there is
 * no authored numeric value or text override that can become stale. Positive
 * offsets follow the left normal of the dimension's projected line in paper
 * +Y-up coordinates. Aligned dimensions preserve authored endpoint order;
 * horizontal/vertical dimensions normalize increasing paper X/Y, respectively
 * (positive horizontal offsets are above; positive vertical offsets are left).
 * Negative offsets select the other side. Labels measure model mm and do not
 * change when the view is fitted or scaled. offset is always paper-space mm.
 * Names are optional circuit identity, not dimension text.
 */
export interface DrawingDimension {
  type: "drawing_dimension"
  drawing_dimension_id: string
  drawing_part_view_id: string
  cad_named_edge_id: string
  name?: string
  orientation: DrawingDimensionOrientation
  offset: number
  precision: number
}

export type DrawingDimensionInput = z.input<typeof drawing_dimension>
expectTypesMatch<DrawingDimension, z.infer<typeof drawing_dimension>>(true)
