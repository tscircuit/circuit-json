import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicSymbol {
  type: "schematic_symbol"
  schematic_symbol_id: string
  name?: string
}

export const schematic_symbol = z
  .object({
    type: z.literal("schematic_symbol"),
    schematic_symbol_id: z.string(),
    name: z.string().optional(),
  })
  .describe(
    "Defines a named schematic symbol that can be referenced by components.",
  )

export type SchematicSymbolInput = z.input<typeof schematic_symbol>
type InferredSchematicSymbol = z.infer<typeof schematic_symbol>

expectTypesMatch<SchematicSymbol, InferredSchematicSymbol>(true)
