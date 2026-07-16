import { type Length, length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

const source_cutout_aperture_base = z.object({
  type: z.literal("source_cutout_aperture"),
  source_cutout_aperture_id: z.string(),
  source_component_id: z.string(),
  margin: length.optional(),
})

export const source_cutout_aperture_rect = source_cutout_aperture_base.extend({
  shape: z.literal("rect"),
  width: length,
  height: length,
})

export const source_cutout_aperture_pill = source_cutout_aperture_base.extend({
  shape: z.literal("pill"),
  width: length,
  height: length,
})

export const source_cutout_aperture_circle = source_cutout_aperture_base.extend(
  {
    shape: z.literal("circle"),
    radius: length,
  },
)

export const source_cutout_aperture = z
  .discriminatedUnion("shape", [
    source_cutout_aperture_rect,
    source_cutout_aperture_pill,
    source_cutout_aperture_circle,
  ])
  .describe(
    "Defines a part-owned aperture required in an enclosing mechanical body",
  )

export interface SourceApertureBase {
  type: "source_cutout_aperture"
  source_cutout_aperture_id: string
  source_component_id: string
  margin?: Length
}

export interface SourceRectCutoutAperture extends SourceApertureBase {
  shape: "rect"
  width: Length
  height: Length
}

export interface SourcePillCutoutAperture extends SourceApertureBase {
  shape: "pill"
  width: Length
  height: Length
}

export interface SourceCircleCutoutAperture extends SourceApertureBase {
  shape: "circle"
  radius: Length
}

/**
 * Defines a part-owned aperture required in an enclosing mechanical body.
 */
export type SourceCutoutAperture =
  | SourceRectCutoutAperture
  | SourcePillCutoutAperture
  | SourceCircleCutoutAperture

export type SourceCutoutApertureInput = z.input<typeof source_cutout_aperture>
type InferredSourceCutoutAperture = z.infer<typeof source_cutout_aperture>

expectTypesMatch<SourceCutoutAperture, InferredSourceCutoutAperture>(true)
