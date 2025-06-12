import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_ground_plane_region = z
  .object({
    type: z.literal("pcb_ground_plane_region"),
    pcb_ground_plane_region_id: getZodPrefixedIdWithDefault(
      "pcb_ground_plane_region",
    ),
    pcb_ground_plane_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    layer: layer_ref,
    points: z.array(point),
  })
  .describe("Defines a polygon region of a ground plane")

export type PcbGroundPlaneRegionInput = z.input<typeof pcb_ground_plane_region>
type InferredPcbGroundPlaneRegion = z.infer<typeof pcb_ground_plane_region>

/**
 * Defines a polygon region of a ground plane
 */
export interface PcbGroundPlaneRegion {
  type: "pcb_ground_plane_region"
  pcb_ground_plane_region_id: string
  pcb_ground_plane_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: LayerRef
  points: Point[]
}

expectTypesMatch<PcbGroundPlaneRegion, InferredPcbGroundPlaneRegion>(true)
