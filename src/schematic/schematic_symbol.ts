import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  kicadSymbolMetadata,
  type KicadSymbolMetadata,
} from "src/common/kicadSymbolMetadata"

export interface SchematicSymbol {
  type: "schematic_symbol"
  schematic_symbol_id: string
  name?: string
  kicad_symbol_metadata?: KicadSymbolMetadata
}

export const schematic_symbol = z
  .object({
    type: z.literal("schematic_symbol"),
    schematic_symbol_id: z.string(),
    name: z.string().optional(),
    kicad_symbol_metadata: kicadSymbolMetadata.optional(),
  })
  .describe(
    "Defines a named schematic symbol that can be referenced by components.",
  )

export type SchematicSymbolInput = z.input<typeof schematic_symbol>
type InferredSchematicSymbol = z.infer<typeof schematic_symbol>

expectTypesMatch<SchematicSymbol, InferredSchematicSymbol>(true)
