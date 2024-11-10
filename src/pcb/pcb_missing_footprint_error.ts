import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_missing_footprint_error = z
  .object({
    type: z.literal("pcb_missing_footprint_error"),
    pcb_missing_footprint_error_id: getZodPrefixedIdWithDefault(
      "pcb_missing_footprint_error",
    ),
    error_type: z.literal("pcb_missing_footprint_error"),
    source_component_id: z.string(),
    message: z.string(),
  })
  .describe("Defines a missing footprint error on the PCB")

export type PcbMissingFootprintErrorInput = z.input<
  typeof pcb_missing_footprint_error
>
type InferredPcbMissingFootprintError = z.infer<
  typeof pcb_missing_footprint_error
>

/**
 * Defines a placement error on the PCB
 */
export interface PcbMissingFootprintError {
  type: "pcb_missing_footprint_error"
  pcb_missing_footprint_error_id: string
  error_type: "pcb_missing_footprint_error"
  source_component_id: string
  message: string
}

/**
 * @deprecated use PcbMissingFootprintError
 */
export type PCBMissingFootprintError = PcbMissingFootprintError

expectTypesMatch<PcbMissingFootprintError, InferredPcbMissingFootprintError>(
  true,
)
