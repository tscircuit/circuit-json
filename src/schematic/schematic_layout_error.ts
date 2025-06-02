import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_layout_error = z
  .object({
    type: z.literal("schematic_layout_error"),
    schematic_layout_error_id: getZodPrefixedIdWithDefault(
      "schematic_layout_error",
    ),
    message: z.string(),
    source_group_id: z.string(),
    schematic_group_id: z.string(),
  })
  .describe("Error emitted when schematic layout fails for a group")

export type SchematicLayoutErrorInput = z.input<typeof schematic_layout_error>
type InferredSchematicLayoutError = z.infer<typeof schematic_layout_error>

export interface SchematicLayoutError {
  type: "schematic_layout_error"
  schematic_layout_error_id: string
  message: string
  source_group_id: string
  schematic_group_id: string
}

expectTypesMatch<SchematicLayoutError, InferredSchematicLayoutError>(true)
