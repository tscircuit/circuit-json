import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_courtyard_overlap_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_courtyard_overlap_error"),
    pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
    error_type: z
      .literal("pcb_courtyard_overlap_error")
      .default("pcb_courtyard_overlap_error"),
    pcb_component_ids: z.tuple([z.string(), z.string()]),
  })
  .describe(
    "Error emitted when the courtyard (CrtYd) of one PCB component overlaps with the courtyard of another",
  )

export type PcbCourtyardOverlapErrorInput = z.input<
  typeof pcb_courtyard_overlap_error
>
type InferredPcbCourtyardOverlapError = z.infer<
  typeof pcb_courtyard_overlap_error
>

/** Error emitted when the courtyard (CrtYd) of one PCB component overlaps with the courtyard of another */
export interface PcbCourtyardOverlapError extends BaseCircuitJsonError {
  type: "pcb_courtyard_overlap_error"
  pcb_error_id: string
  error_type: "pcb_courtyard_overlap_error"
  pcb_component_ids: [string, string]
}

expectTypesMatch<PcbCourtyardOverlapError, InferredPcbCourtyardOverlapError>(
  true,
)
