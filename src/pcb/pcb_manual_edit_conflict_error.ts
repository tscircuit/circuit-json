import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const pcb_manual_edit_conflict_error = z
  .object({
    type: z.literal("pcb_manual_edit_conflict_error"),
    pcb_error_id: getZodPrefixedIdWithDefault("pcb_manual_edit_conflict_error"),
    message: z.string(),
    pcb_component_id: z.string(),
    source_component_id: z.string(),
  })
  .describe(
    "Error emitted when a component has both manual placement and explicit pcbX/pcbY coordinates",
  )

export type PcbManualEditConflictErrorInput = z.input<
  typeof pcb_manual_edit_conflict_error
>
type InferredPcbManualEditConflictError = z.infer<
  typeof pcb_manual_edit_conflict_error
>

/**
 * Error emitted when a component has both manual placement (via manualEdits) and explicit pcbX/pcbY coordinates
 */
export interface PcbManualEditConflictError {
  type: "pcb_manual_edit_conflict_error"
  pcb_error_id: string
  message: string
  pcb_component_id: string
  source_component_id: string
}

/**
 * @deprecated use PcbManualEditConflictError instead
 */
export type PCBManualEditConflictError = PcbManualEditConflictError

expectTypesMatch<
  PcbManualEditConflictError,
  InferredPcbManualEditConflictError
>(true)
