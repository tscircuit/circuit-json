import { z } from "zod"
import { point, type Point } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

/** Suppresses electrical-rule checks at a schematic point. */
export interface NoErc {
  type: "no_erc"
  no_erc_id: string
  schematic_sheet_id?: string
  source_port_id?: string
  center: Point
  subcircuit_id?: string
}

export const no_erc = z
  .object({
    type: z.literal("no_erc"),
    no_erc_id: z.string(),
    schematic_sheet_id: z.string().optional(),
    source_port_id: z.string().optional(),
    center: point,
    subcircuit_id: z.string().optional(),
  })
  .describe("Suppresses electrical-rule checks at a schematic point")

export type NoErcInput = z.input<typeof no_erc>
type InferredNoErc = z.infer<typeof no_erc>

expectTypesMatch<NoErc, InferredNoErc>(true)
