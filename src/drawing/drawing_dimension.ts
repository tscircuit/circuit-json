import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"

export const drawing_dimension_measurement = z.enum([
  "edge",
  "view_width",
  "view_height",
])
export type DrawingDimensionMeasurement = z.infer<
  typeof drawing_dimension_measurement
>

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
    measurement: drawing_dimension_measurement.default("edge"),
    cad_named_edge_id: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    orientation: drawing_dimension_orientation.optional(),
    offset: z.number().finite().default(8),
    precision: z.number().int().min(0).max(6).default(1),
  })
  .superRefine((dimension, ctx) => {
    if (dimension.measurement === "edge") {
      if (dimension.cad_named_edge_id === undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cad_named_edge_id"],
          message: "Edge measurements require cad_named_edge_id",
        })
      return
    }
    if (dimension.cad_named_edge_id !== undefined)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cad_named_edge_id"],
        message: "View extent measurements cannot reference a named edge",
      })
    const orientation =
      dimension.measurement === "view_width" ? "horizontal" : "vertical"
    if (
      dimension.orientation !== undefined &&
      dimension.orientation !== orientation
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["orientation"],
        message: `${dimension.measurement} requires ${orientation} orientation`,
      })
  })
  .transform((dimension) => ({
    ...dimension,
    orientation:
      dimension.orientation ??
      (dimension.measurement === "view_width"
        ? "horizontal"
        : dimension.measurement === "view_height"
          ? "vertical"
          : "aligned"),
  }))
  .describe(
    "A linear dimension associated with a drawing part view. Edge measurements reference an actual model-defined named edge and default to aligned true 3D length. Horizontal/vertical edge measurements use the camera right/up component. Explicit view_width/view_height presets infer the selected rendered geometry's extents in camera model axes, never paper viewport size, and cannot reference named edges. All values are model millimeters, independent of fit/scale. Signed offset is paper mm, default 8; decimal precision defaults to 1.",
  )

/** Resolved dimension intent. measurement defaults to edge. An edge reference
 * is required only for edge measurements. View presets use no fabricated edge
 * records: they derive the rendered selection's camera-axis extent, independently
 * of paper viewport width/height. Width is horizontal and height is vertical.
 * Edge orientation defaults to aligned. Opposing preset orientations are errors.
 * Aligned edge labels measure true 3D length. Horizontal/vertical edge labels
 * measure the absolute camera right/up component in model mm.
 * Signed offsets follow the left normal in paper +Y-up coordinates. Aligned
 * edges preserve authored endpoint order. Horizontal/vertical endpoint order is
 * increasing paper X/Y: positive offsets are above/left. offset is paper mm.
 * precision is decimal places, integer 0–6. Numeric/text overrides are absent.
 */
export interface DrawingDimension {
  type: "drawing_dimension"
  drawing_dimension_id: string
  drawing_part_view_id: string
  measurement: DrawingDimensionMeasurement
  cad_named_edge_id?: string
  name?: string
  orientation: DrawingDimensionOrientation
  offset: number
  precision: number
}

export type DrawingDimensionInput = z.input<typeof drawing_dimension>
expectTypesMatch<DrawingDimension, z.infer<typeof drawing_dimension>>(true)
