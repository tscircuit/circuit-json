import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const unknown_parts_engine_error = z
  .object({
    type: z.literal("unknown_parts_engine_error"),
    unknown_parts_engine_error_id: getZodPrefixedIdWithDefault(
      "unknown_parts_engine_error",
    ),
    error_type: z
      .literal("unknown_parts_engine_error")
      .default("unknown_parts_engine_error"),
    message: z.string(),
    source_component_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Error emitted when the parts engine encounters an unexpected error",
  )

export type UnknownPartsEngineErrorInput = z.input<
  typeof unknown_parts_engine_error
>
type InferredUnknownPartsEngineError = z.infer<
  typeof unknown_parts_engine_error
>

/**
 * Error emitted when the parts engine encounters an unexpected error.
 * This includes cases where the API returns HTML instead of JSON,
 * network failures, or other unexpected responses.
 */
export interface UnknownPartsEngineError {
  type: "unknown_parts_engine_error"
  unknown_parts_engine_error_id: string
  error_type: "unknown_parts_engine_error"
  message: string
  source_component_id?: string
  subcircuit_id?: string
}

expectTypesMatch<UnknownPartsEngineError, InferredUnknownPartsEngineError>(true)
