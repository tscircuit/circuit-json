import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_enclosure_aperture_intersection_warning = z
  .object({
    type: z.literal("cad_enclosure_aperture_intersection_warning"),
    cad_enclosure_aperture_intersection_warning_id: getZodPrefixedIdWithDefault(
      "cad_enclosure_aperture_intersection_warning",
    ),
    warning_type: z
      .literal("cad_enclosure_aperture_intersection_warning")
      .default("cad_enclosure_aperture_intersection_warning"),
    message: z.string(),
    cad_component_id: z.string(),
    enclosure_cad_component_ids: z.array(z.string()).min(1),
    pcb_component_id: z.string().optional(),
    source_component_id: z.string().optional(),
    face: z.enum(["x_pos", "x_neg", "y_pos", "y_neg", "z_pos", "z_neg"]),
    intersection_area_mm2: z.number().finite().nonnegative(),
    threshold_area_mm2: z.number().finite().nonnegative(),
  })
  .describe(
    "An aperture-bearing part intersects the finished enclosure. The intersection_area_mm2 is the union silhouette area of the solid intersection projected along the aperture face normal, in the right-handed Circuit JSON world frame (+X right, +Y top, +Z above). It is an area in square millimetres, not intersection volume or surface area. This indicates possible aperture misplacement, insufficient size/depth, or body clearance problems; it does not prove which cause applies.",
  )

export type CadEnclosureApertureIntersectionWarningInput = z.input<
  typeof cad_enclosure_aperture_intersection_warning
>
export interface CadEnclosureApertureIntersectionWarning {
  type: "cad_enclosure_aperture_intersection_warning"
  cad_enclosure_aperture_intersection_warning_id: string
  warning_type: "cad_enclosure_aperture_intersection_warning"
  message: string
  cad_component_id: string
  enclosure_cad_component_ids: string[]
  pcb_component_id?: string
  source_component_id?: string
  face: "x_pos" | "x_neg" | "y_pos" | "y_neg" | "z_pos" | "z_neg"
  /** Union silhouette of solid intersection, projected along face normal (mm²). */
  intersection_area_mm2: number
  threshold_area_mm2: number
}

expectTypesMatch<
  CadEnclosureApertureIntersectionWarning,
  z.infer<typeof cad_enclosure_aperture_intersection_warning>
>(true)
