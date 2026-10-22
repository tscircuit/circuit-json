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
    cad_component_id: z.string().trim().min(1).optional(),
    edge_name: z
      .string()
      .refine((name) => name.trim().length > 0, "Edge name must not be blank")
      .optional(),
    width_of_view: z.boolean().optional(),
    height_of_view: z.boolean().optional(),
    name: z.string().trim().min(1).optional(),
    orientation: drawing_dimension_orientation.optional(),
    offset: z.number().finite().default(8),
    precision: z.number().int().min(0).max(6).default(1),
  })
  .superRefine((dimension, ctx) => {
    const hasComponent = dimension.cad_component_id !== undefined
    const hasEdgeName = dimension.edge_name !== undefined
    if (hasComponent !== hasEdgeName)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [hasComponent ? "edge_name" : "cad_component_id"],
        message:
          "Model edge targets require both cad_component_id and edge_name",
      })
    const selections =
      Number(hasComponent || hasEdgeName) +
      Number(dimension.width_of_view === true) +
      Number(dimension.height_of_view === true)
    if (selections !== 1)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Select exactly one model edge target, width_of_view, or height_of_view",
      })
    const orientation = dimension.width_of_view
      ? "horizontal"
      : dimension.height_of_view
        ? "vertical"
        : undefined
    if (
      orientation !== undefined &&
      dimension.orientation !== undefined &&
      dimension.orientation !== orientation
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["orientation"],
        message: `View ${dimension.width_of_view ? "width" : "height"} requires ${orientation} orientation`,
      })
  })
  .transform(({ width_of_view, height_of_view, ...dimension }) => ({
    ...dimension,
    ...(width_of_view ? { width_of_view: true as const } : {}),
    ...(height_of_view ? { height_of_view: true as const } : {}),
    orientation:
      dimension.orientation ??
      (width_of_view ? "horizontal" : height_of_view ? "vertical" : "aligned"),
  }))
  .describe(
    "A linear dimension associated with a drawing part view. Select exactly one model edge (cad_component_id plus exact edge_name), width_of_view: true, or height_of_view: true. False flags are unselected and omitted when parsed. STEP/glTF/JSCAD readers own edge geometry and topology; Circuit JSON defines only dimension intent. Aligned requests true 3D straight-edge distance. Horizontal/vertical request camera right/up extents of native edge geometry. Readers/exporters reject unsupported geometry rather than reducing curved paths to endpoint chords. Explicit view flags infer selected rendered geometry extents in camera model axes and prohibit edge targets. Values are model mm independent of fit/scale; signed offset is paper mm, default 8, decimal precision default 1.",
  )

/** Resolved dimension intent. Select exactly one complete cad_component_id plus
 * edge_name target, width_of_view: true, or height_of_view: true. False input
 * flags are unselected and omitted from the parsed result. The opaque edge name
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
  cad_component_id?: string
  /** Exact model-reader edge name; outer whitespace is preserved. */
  edge_name?: string
  width_of_view?: true
  height_of_view?: true
  name?: string
  orientation: DrawingDimensionOrientation
  offset: number
  precision: number
}

export type DrawingDimensionInput = z.input<typeof drawing_dimension>
expectTypesMatch<DrawingDimension, z.infer<typeof drawing_dimension>>(true)
