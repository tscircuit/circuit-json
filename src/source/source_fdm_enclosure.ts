import { type Length, length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_fdm_enclosure = z
  .object({
    type: z.literal("source_fdm_enclosure"),
    source_fdm_enclosure_id: z.string(),
    source_assembly_device_id: z.string(),
    source_board_id: z.string(),
    name: z.string().optional(),
    width: length.optional(),
    height: length.optional(),
    depth: length.optional(),
    wall_thickness: length,
    floor_thickness: length.optional(),
    lid_thickness: length.optional(),
    board_clearance: length.optional(),
    standoff_height: length.optional(),
    top_headroom: length.optional(),
    lid_lip_depth: length.optional(),
    auto_cutouts: z.boolean().optional(),
  })
  .describe(
    "Defines an FDM enclosure associated with an assembly device and source board",
  )

export type SourceFdmEnclosureInput = z.input<typeof source_fdm_enclosure>
type InferredSourceFdmEnclosure = z.infer<typeof source_fdm_enclosure>

/**
 * Defines an FDM enclosure associated with an assembly device and source board.
 */
export interface SourceFdmEnclosure {
  type: "source_fdm_enclosure"
  source_fdm_enclosure_id: string
  source_assembly_device_id: string
  source_board_id: string
  name?: string
  width?: Length
  height?: Length
  depth?: Length
  wall_thickness: Length
  floor_thickness?: Length
  lid_thickness?: Length
  board_clearance?: Length
  standoff_height?: Length
  top_headroom?: Length
  lid_lip_depth?: Length
  auto_cutouts?: boolean
}

expectTypesMatch<SourceFdmEnclosure, InferredSourceFdmEnclosure>(true)
