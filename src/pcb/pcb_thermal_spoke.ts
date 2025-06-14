import { z } from "zod"
import { distance, type Distance } from "src/units"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_thermal_spoke = z
  .object({
    type: z.literal("pcb_thermal_spoke"),
    pcb_thermal_spoke_id: getZodPrefixedIdWithDefault("pcb_thermal_spoke"),
    pcb_ground_plane_id: z.string(),
    shape: z.string(),
    spoke_count: z.number(),
    spoke_thickness: distance,
    spoke_inner_diameter: distance,
    spoke_outer_diameter: distance,
    pcb_plated_hole_id: z.string().optional(),
  })
  .describe("Pattern for connecting a ground plane to a plated hole")

export type PcbThermalSpokeInput = z.input<typeof pcb_thermal_spoke>
type InferredPcbThermalSpoke = z.infer<typeof pcb_thermal_spoke>

/**
 * Pattern for connecting a ground plane to a plated hole
 */
export interface PcbThermalSpoke {
  type: "pcb_thermal_spoke"
  pcb_thermal_spoke_id: string
  pcb_ground_plane_id: string
  shape: string
  spoke_count: number
  spoke_thickness: Distance
  spoke_inner_diameter: Distance
  spoke_outer_diameter: Distance
  pcb_plated_hole_id?: string
}

expectTypesMatch<PcbThermalSpoke, InferredPcbThermalSpoke>(true)
