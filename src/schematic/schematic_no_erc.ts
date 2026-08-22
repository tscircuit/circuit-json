import { z } from "zod"
import { type Point, point } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

/** Suppresses electrical-rule checks at a schematic point. */
export interface SchematicNoErc {
  type: "schematic_no_erc"
  schematic_no_erc_id: string
  schematic_sheet_id?: string
  source_port_id?: string
  center: Point
  subcircuit_id?: string
}

export const schematic_no_erc = z
  .object({
    type: z.literal("schematic_no_erc"),
    schematic_no_erc_id: z.string(),
    schematic_sheet_id: z.string().optional(),
    source_port_id: z.string().optional(),
    center: point,
    subcircuit_id: z.string().optional(),
  })
  .describe("Suppresses electrical-rule checks at a schematic point")

export type SchematicNoErcInput = z.input<typeof schematic_no_erc>
type InferredSchematicNoErc = z.infer<typeof schematic_no_erc>

expectTypesMatch<SchematicNoErc, InferredSchematicNoErc>(true)
