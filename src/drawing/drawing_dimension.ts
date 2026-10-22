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
    cad_component_id: z.string().trim().min(1).optional(),
    edge_name: z
      .string()
      .refine((name) => name.trim().length > 0, "Edge name must not be blank")
      .optional(),
    name: z.string().trim().min(1).optional(),
    orientation: drawing_dimension_orientation.optional(),
    offset: z.number().finite().default(8),
    precision: z.number().int().min(0).max(6).default(1),
  })
  .superRefine((dimension, ctx) => {
    if (dimension.measurement === "edge") {
      for (const field of ["cad_component_id", "edge_name"] as const)
        if (dimension[field] === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `Edge measurements require ${field}`,
          })
      return
    }
    for (const field of ["cad_component_id", "edge_name"] as const)
      if (dimension[field] !== undefined)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: "View extent measurements cannot reference a model edge",
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
    "A linear dimension associated with a drawing part view. Edge measurements target an owning CAD component and an opaque edge name supplied by its model reader. STEP/glTF/JSCAD readers own edge geometry and topology; Circuit JSON defines only the measurement intent. Aligned requests true 3D straight-edge distance. Horizontal/vertical request camera right/up extents of the native edge geometry. Readers/exporters reject unsupported geometry rather than reducing curved paths to endpoint chords. Explicit view_width/view_height presets infer selected rendered geometry extents in camera model axes and prohibit edge targets. Values are model mm independent of fit/scale; signed offset is paper mm, default 8, decimal precision default 1.",
  )

/** Resolved dimension intent. measurement defaults to edge. cad_component_id
 * and edge_name are required only for edge measurements. The opaque edge name
 * is matched exactly against the owning model reader; it is not a TSX selector.
 * Circuit JSON carries no edge points, topology or geometry definitions.
 * View presets derive the rendered selection's camera-axis extent independently
 * of paper viewport width/height. Width is horizontal and height is vertical.
 * Edge orientation defaults to aligned. Opposing preset orientations are errors.
 * Aligned requests true 3D straight-edge distance. Horizontal/vertical labels
 * measure native edge extents in camera right/up model axes. Readers/exporters
 * reject unsupported geometry instead of replacing curves with endpoint chords.
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
  cad_component_id?: string
  /** Exact model-reader edge name; outer whitespace is preserved. */
  edge_name?: string
  name?: string
  orientation: DrawingDimensionOrientation
  offset: number
  precision: number
}

export type DrawingDimensionInput = z.input<typeof drawing_dimension>
expectTypesMatch<DrawingDimension, z.infer<typeof drawing_dimension>>(true)
