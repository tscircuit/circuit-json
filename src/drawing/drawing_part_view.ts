import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const drawing_part_view_direction = z.enum([
  "x_positive",
  "x_negative",
  "y_positive",
  "y_negative",
  "z_positive",
  "z_negative",
  "isometric",
])
export type DrawingPartViewDirection = z.infer<
  typeof drawing_part_view_direction
>

export const drawing_section_plane = z.object({
  axis: z.enum(["x", "y", "z"]),
  offset: z.number().finite(),
  keep_side: z.enum(["less", "greater"]),
  hatch_spacing: z.number().finite().positive().optional(),
})
export interface DrawingSectionPlane {
  axis: "x" | "y" | "z"
  offset: number
  keep_side: "less" | "greater"
  hatch_spacing?: number
}

export const drawing_part_view = z
  .object({
    type: z.literal("drawing_part_view"),
    drawing_part_view_id: z.string().min(1),
    drawing_page_id: z.string().min(1),
    source_group_id: z.string().min(1).optional(),
    source_component_ids: z.array(z.string().min(1)).optional(),
    name: z.string().optional(),
    display_name: z.string().optional(),
    direction: drawing_part_view_direction,
    center: z.object({ x: z.number().finite(), y: z.number().finite() }),
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
    scale: z.number().finite().positive().optional(),
    show_hidden_edges: z.boolean().optional(),
    section: drawing_section_plane.optional(),
  })
  .describe(
    "A configured orthographic view of selected assembly geometry. Paper coordinates are mm, origin at sheet center, +X right/+Y up. Directions and section planes use CAD world coordinates in mm with +Z up.",
  )

export interface DrawingPartView {
  type: "drawing_part_view"
  drawing_part_view_id: string
  drawing_page_id: string
  /** Resolved geometry selection for this part view; omitted selectors mean the entire assembly. */
  source_group_id?: string
  source_component_ids?: string[]
  name?: string
  display_name?: string
  direction: DrawingPartViewDirection
  center: { x: number; y: number }
  width: number
  height: number
  /** Model-to-paper ratio; omitted means fit with a margin. */
  scale?: number
  /** False when omitted. Hidden edges are dashed. */
  show_hidden_edges?: boolean
  section?: DrawingSectionPlane
}
export type DrawingPartViewInput = z.input<typeof drawing_part_view>
expectTypesMatch<DrawingSectionPlane, z.infer<typeof drawing_section_plane>>(
  true,
)
expectTypesMatch<DrawingPartView, z.infer<typeof drawing_part_view>>(true)
