import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_ground_plane = z
  .object({
    type: z.literal("pcb_ground_plane"),
    pcb_ground_plane_id: getZodPrefixedIdWithDefault("pcb_ground_plane"),
    source_pcb_ground_plane_id: z.string(),
    source_net_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a ground plane on the PCB")

export type PcbGroundPlaneInput = z.input<typeof pcb_ground_plane>
type InferredPcbGroundPlane = z.infer<typeof pcb_ground_plane>

/**
 * Defines a ground plane on the PCB
 */
export interface PcbGroundPlane {
  type: "pcb_ground_plane"
  pcb_ground_plane_id: string
  source_pcb_ground_plane_id: string
  source_net_id: string
  pcb_group_id?: string
  subcircuit_id?: string
}

expectTypesMatch<PcbGroundPlane, InferredPcbGroundPlane>(true)
