import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_footprint_overlap_error = z
  .object({
    type: z.literal("pcb_footprint_overlap_error"),
    pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
    error_type: z
      .literal("pcb_footprint_overlap_error")
      .default("pcb_footprint_overlap_error"),
    message: z.string(),
    pcb_smtpad_ids: z.array(z.string()).optional(),
    pcb_plated_hole_ids: z.array(z.string()).optional(),
    pcb_hole_ids: z.array(z.string()).optional(),
    pcb_keepout_ids: z.array(z.string()).optional(),
  })
  .describe("Error emitted when a pcb footprint overlaps with another element")

export type PcbFootprintOverlapErrorInput = z.input<
  typeof pcb_footprint_overlap_error
>
type InferredPcbFootprintOverlapError = z.infer<
  typeof pcb_footprint_overlap_error
>

/** Error emitted when a pcb footprint overlaps with another element */
export interface PcbFootprintOverlapError {
  type: "pcb_footprint_overlap_error"
  pcb_error_id: string
  error_type: "pcb_footprint_overlap_error"
  message: string
  pcb_smtpad_ids?: string[]
  pcb_plated_hole_ids?: string[]
  pcb_hole_ids?: string[]
  pcb_keepout_ids?: string[]
}

expectTypesMatch<PcbFootprintOverlapError, InferredPcbFootprintOverlapError>(
  true,
)
