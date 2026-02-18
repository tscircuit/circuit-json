import { kicadSymbolMetadata } from "src/common/kicadSymbolMetadata"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

const schematicSymbolMetadata = z
  .object({
    kicad_symbol: kicadSymbolMetadata.optional(),
  })
  .catchall(z.unknown())

export type SchematicSymbolMetadata = z.infer<typeof schematicSymbolMetadata>

export interface SchematicSymbol {
  type: "schematic_symbol"
  schematic_symbol_id: string
  name?: string
  metadata?: SchematicSymbolMetadata
}

export const schematic_symbol = z
  .object({
    type: z.literal("schematic_symbol"),
    schematic_symbol_id: z.string(),
    name: z.string().optional(),
    metadata: schematicSymbolMetadata.optional(),
  })
  .describe(
    "Defines a named schematic symbol that can be referenced by components.",
  )

export type SchematicSymbolInput = z.input<typeof schematic_symbol>
type InferredSchematicSymbol = z.infer<typeof schematic_symbol>

expectTypesMatch<SchematicSymbol, InferredSchematicSymbol>(true)
