import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_unnamed_trace_warning = z
  .object({
    type: z.literal("source_unnamed_trace_warning"),
    source_unnamed_trace_warning_id: getZodPrefixedIdWithDefault(
      "source_unnamed_trace_warning",
    ),
    warning_type: z
      .literal("source_unnamed_trace_warning")
      .default("source_unnamed_trace_warning"),
    message: z.string(),
    source_trace_id: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Warning emitted when a source trace is missing a name")

export type SourceUnnamedTraceWarningInput = z.input<
  typeof source_unnamed_trace_warning
>
type InferredSourceUnnamedTraceWarning = z.infer<
  typeof source_unnamed_trace_warning
>

/**
 * Warning emitted when a source trace is missing a name
 */
export interface SourceUnnamedTraceWarning {
  type: "source_unnamed_trace_warning"
  source_unnamed_trace_warning_id: string
  warning_type: "source_unnamed_trace_warning"
  message: string
  source_trace_id: string
  subcircuit_id?: string
}

expectTypesMatch<SourceUnnamedTraceWarning, InferredSourceUnnamedTraceWarning>(
  true,
)
