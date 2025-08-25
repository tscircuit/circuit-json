import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicError {
  type: "schematic_error"
  schematic_error_id: string
  error_type: "schematic_port_not_found" | "source_property_ignored_warning"
  message: string
  subcircuit_id?: string
}

export const schematic_error = z
  .object({
    type: z.literal("schematic_error"),
    schematic_error_id: z.string(),
    // eventually each error type should be broken out into a dir of files
    error_type: z.enum([
      "schematic_port_not_found",
      "source_property_ignored_warning",
    ]),
    message: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a schematic error on the schematic")

export type SchematicErrorInput = z.input<typeof schematic_error>
type InferredSchematicError = z.infer<typeof schematic_error>

expectTypesMatch<SchematicError, InferredSchematicError>(true)
