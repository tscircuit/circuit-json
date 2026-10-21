import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const drawing_artifact = z
  .object({
    type: z.literal("drawing_artifact"),
    drawing_artifact_id: z.string().min(1),
    drawing_id: z.string().min(1),
    drawing_view_id: z.string().min(1).optional(),
    format: z.enum(["svg", "png"]),
    url: z.string().min(1),
    pixel_width: z.number().int().positive().optional(),
    pixel_height: z.number().int().positive().optional(),
  })
  .describe(
    "A generated drawing asset. Omit drawing_view_id for a complete sheet. URLs may be data URIs or uploaded asset URLs; pixel dimensions describe raster output, not paper mm.",
  )

export interface DrawingArtifact {
  type: "drawing_artifact"
  drawing_artifact_id: string
  drawing_id: string
  drawing_view_id?: string
  format: "svg" | "png"
  url: string
  pixel_width?: number
  pixel_height?: number
}
export type DrawingArtifactInput = z.input<typeof drawing_artifact>
expectTypesMatch<DrawingArtifact, z.infer<typeof drawing_artifact>>(true)
