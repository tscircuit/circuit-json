import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_missing_props_error = z
  .object({
    type: z.literal("pcb_missing_props_error"),
    pcb_missing_props_error_id: getZodPrefixedIdWithDefault(
      "pcb_missing_props_error",
    ),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    error_type: z.literal("pcb_missing_props_error"),
    source_component_id: z.string(),
    message: z.string(),
  })
  .describe("Defines a missing property error on the PCB")

export type PcbMissingPropsErrorInput = z.input<typeof pcb_missing_props_error>
type InferredPcbMissingPropsError = z.infer<typeof pcb_missing_props_error>

/**
 * Defines a missing property error on the PCB
 */
export interface PcbMissingPropsError {
  type: "pcb_missing_props_error"
  pcb_missing_props_error_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  error_type: "pcb_missing_props_error"
  source_component_id: string
  message: string
}

expectTypesMatch<PcbMissingPropsError, InferredPcbMissingPropsError>(true)
