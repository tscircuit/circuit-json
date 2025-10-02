import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_pcb_ground_plane = z
  .object({
    type: z.literal("source_pcb_ground_plane"),
    source_pcb_ground_plane_id: z.string(),
    source_group_id: z.string(),
    source_net_id: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a ground plane in the source domain")

export type SourcePcbGroundPlaneInput = z.input<typeof source_pcb_ground_plane>
type InferredSourcePcbGroundPlane = z.infer<typeof source_pcb_ground_plane>

/**
 * Defines a ground plane in the source domain
 */
export interface SourcePcbGroundPlane {
  type: "source_pcb_ground_plane"
  source_pcb_ground_plane_id: string
  source_group_id: string
  source_net_id: string
  subcircuit_id?: string
}

expectTypesMatch<SourcePcbGroundPlane, InferredSourcePcbGroundPlane>(true)
