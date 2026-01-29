import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_layout_error = base_circuit_json_error
  .extend({
    type: z.literal("schematic_layout_error"),
    schematic_layout_error_id: getZodPrefixedIdWithDefault(
      "schematic_layout_error",
    ),
    error_type: z
      .literal("schematic_layout_error")
      .default("schematic_layout_error"),
    source_group_id: z.string(),
    schematic_group_id: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Error emitted when schematic layout fails for a group")

export type SchematicLayoutErrorInput = z.input<typeof schematic_layout_error>
type InferredSchematicLayoutError = z.infer<typeof schematic_layout_error>

export interface SchematicLayoutError extends BaseCircuitJsonError {
  type: "schematic_layout_error"
  schematic_layout_error_id: string
  error_type: "schematic_layout_error"
  source_group_id: string
  schematic_group_id: string
  subcircuit_id?: string
}

expectTypesMatch<SchematicLayoutError, InferredSchematicLayoutError>(true)
