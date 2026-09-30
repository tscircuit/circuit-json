import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

/** Persist the associations needed for standalone mechanical DRC.
 * Faces use right-handed world axes (+X right, +Y top, +Z above).
 * CAD records contain finished enclosure geometry after aperture cuts.
 */
export const cad_enclosure = z.object({
  type: z.literal("cad_enclosure"),
  cad_enclosure_id: getZodPrefixedIdWithDefault("cad_enclosure"),
  cad_component_ids: z.array(z.string()).min(1),
  source_component_id: z.string(),
  is_in_assembly: z.boolean(),
  apertures: z.array(
    z.object({
      pcb_component_id: z.string(),
      face: z.enum(["x_pos", "x_neg", "y_pos", "y_neg", "z_pos", "z_neg"]),
    }),
  ),
})
export type CadEnclosureInput = z.input<typeof cad_enclosure>
export interface CadEnclosure {
  type: "cad_enclosure"
  cad_enclosure_id: string
  cad_component_ids: string[]
  source_component_id: string
  is_in_assembly: boolean
  apertures: {
    pcb_component_id: string
    face: "x_pos" | "x_neg" | "y_pos" | "y_neg" | "z_pos" | "z_neg"
  }[]
}
expectTypesMatch<CadEnclosure, z.infer<typeof cad_enclosure>>(true)
