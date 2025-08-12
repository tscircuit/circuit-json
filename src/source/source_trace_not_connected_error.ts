import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_trace_not_connected_error = z
  .object({
    type: z.literal("source_trace_not_connected_error"),
    source_trace_not_connected_error_id: getZodPrefixedIdWithDefault(
      "source_trace_not_connected_error",
    ),
    error_type: z
      .literal("source_trace_not_connected_error")
      .default("source_trace_not_connected_error"),
    message: z.string(),
    subcircuit_id: z.string().optional(),
    source_group_id: z.string().optional(),
    source_trace_id: z.string().optional(),
    connected_source_port_ids: z.array(z.string()).optional(),
    selectors_not_found: z.array(z.string()).optional(),
  })
  .describe("Occurs when a source trace selector does not match any ports")

export type SourceTraceNotConnectedErrorInput = z.input<
  typeof source_trace_not_connected_error
>
type InferredSourceTraceNotConnectedError = z.infer<
  typeof source_trace_not_connected_error
>

/**
 * Occurs when a source trace selector does not match any ports
 */
export interface SourceTraceNotConnectedError {
  type: "source_trace_not_connected_error"
  source_trace_not_connected_error_id: string
  error_type: "source_trace_not_connected_error"
  message: string
  subcircuit_id?: string
  source_group_id?: string
  source_trace_id?: string
  connected_source_port_ids?: string[]
  selectors_not_found?: string[]
}

expectTypesMatch<
  SourceTraceNotConnectedError,
  InferredSourceTraceNotConnectedError
>(true)
