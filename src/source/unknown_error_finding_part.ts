import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const unknown_error_finding_part = z
  .object({
    type: z.literal("unknown_error_finding_part"),
    unknown_error_finding_part_id: getZodPrefixedIdWithDefault(
      "unknown_error_finding_part",
    ),
    error_type: z
      .literal("unknown_error_finding_part")
      .default("unknown_error_finding_part"),
    message: z.string(),
    source_component_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Error emitted when an unexpected error occurs while finding a part",
  )

export type UnknownErrorFindingPartInput = z.input<
  typeof unknown_error_finding_part
>
type InferredUnknownErrorFindingPart = z.infer<
  typeof unknown_error_finding_part
>

/**
 * Error emitted when an unexpected error occurs while finding a part.
 * This includes cases where the API returns HTML instead of JSON,
 * network failures, or other unexpected responses.
 */
export interface UnknownErrorFindingPart {
  type: "unknown_error_finding_part"
  unknown_error_finding_part_id: string
  error_type: "unknown_error_finding_part"
  message: string
  source_component_id?: string
  subcircuit_id?: string
}

expectTypesMatch<UnknownErrorFindingPart, InferredUnknownErrorFindingPart>(true)
