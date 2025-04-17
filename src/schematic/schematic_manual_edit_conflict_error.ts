import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const schematic_manual_edit_conflict_error = z
  .object({
    type: z.literal("schematic_manual_edit_conflict_error"),
    schematic_error_id: getZodPrefixedIdWithDefault(
      "schematic_manual_edit_conflict_error",
    ),
    message: z.string(),
    schematic_component_id: z.string(),
    schematic_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    source_component_id: z.string(),
  })
  .describe(
    "Error emitted when a component has both manual placement and explicit schX/schY coordinates",
  )

export type SchematicManualEditConflictErrorInput = z.input<
  typeof schematic_manual_edit_conflict_error
>
type InferredSchematicManualEditConflictError = z.infer<
  typeof schematic_manual_edit_conflict_error
>

/**
 * Error emitted when a component has both manual placement (via manualEdits) and explicit schX/schY coordinates
 */
export interface SchematicManualEditConflictError {
  type: "schematic_manual_edit_conflict_error"
  schematic_error_id: string
  message: string
  schematic_component_id: string
  schematic_group_id?: string
  subcircuit_id?: string
  source_component_id: string
}

/**
 * @deprecated use SchematicManualEditConflictError instead
 */
export type SCHEMATICManualEditConflictError = SchematicManualEditConflictError

expectTypesMatch<
  SchematicManualEditConflictError,
  InferredSchematicManualEditConflictError
>(true)
