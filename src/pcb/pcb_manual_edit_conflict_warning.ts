import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const pcb_manual_edit_conflict_warning = z
  .object({
    type: z.literal("pcb_manual_edit_conflict_warning"),
    pcb_warning_id: getZodPrefixedIdWithDefault("pcb_manual_edit_conflict_warning"),
    message: z.string(),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    source_component_id: z.string(),
  })
  .describe(
    "Warning emitted when a component has both manual placement and explicit pcbX/pcbY coordinates",
  )

export type PcbManualEditConflictWarningInput = z.input<
  typeof pcb_manual_edit_conflict_warning
>
type InferredPcbManualEditConflictWarning = z.infer<
  typeof pcb_manual_edit_conflict_warning
>

/**
 * Warning emitted when a component has both manual placement (via manualEdits) and explicit pcbX/pcbY coordinates
 */
export interface PcbManualEditConflictWarning {
  type: "pcb_manual_edit_conflict_warning"
  pcb_warning_id: string
  message: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  source_component_id: string
}

expectTypesMatch<
  PcbManualEditConflictWarning,
  InferredPcbManualEditConflictWarning
>(true)