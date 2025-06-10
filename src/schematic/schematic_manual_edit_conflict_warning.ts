import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const schematic_manual_edit_conflict_warning = z
  .object({
    type: z.literal("schematic_manual_edit_conflict_warning"),
    schematic_manual_edit_conflict_warning_id: getZodPrefixedIdWithDefault(
      "schematic_manual_edit_conflict_warning",
    ),
    warning_type: z
      .literal("schematic_manual_edit_conflict_warning")
      .default("schematic_manual_edit_conflict_warning"),
    message: z.string(),
    schematic_component_id: z.string(),
    schematic_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    source_component_id: z.string(),
  })
  .describe(
    "Warning emitted when a component has both manual placement and explicit schX/schY coordinates",
  )

export type SchematicManualEditConflictWarningInput = z.input<
  typeof schematic_manual_edit_conflict_warning
>
type InferredSchematicManualEditConflictWarning = z.infer<
  typeof schematic_manual_edit_conflict_warning
>

/**
 * Warning emitted when a component has both manual placement (via manualEdits) and explicit schX/schY coordinates
 */
export interface SchematicManualEditConflictWarning {
  type: "schematic_manual_edit_conflict_warning"
  schematic_manual_edit_conflict_warning_id: string
  warning_type: "schematic_manual_edit_conflict_warning"
  message: string
  schematic_component_id: string
  schematic_group_id?: string
  subcircuit_id?: string
  source_component_id: string
}

expectTypesMatch<
  SchematicManualEditConflictWarning,
  InferredSchematicManualEditConflictWarning
>(true)
