import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_internal_connection_net_conflict_warning = z
  .object({
    type: z.literal("source_internal_connection_net_conflict_warning"),
    source_internal_connection_net_conflict_warning_id:
      getZodPrefixedIdWithDefault(
        "source_internal_connection_net_conflict_warning",
      ),
    warning_type: z
      .literal("source_internal_connection_net_conflict_warning")
      .default("source_internal_connection_net_conflict_warning"),
    message: z.string(),
    source_component_id: z.string(),
    source_port_ids: z.array(z.string()).min(2),
    source_net_ids: z.array(z.string()).min(2),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when internally connected pins of a source component are wired to different nets, shorting those nets together",
  )

export type SourceInternalConnectionNetConflictWarningInput = z.input<
  typeof source_internal_connection_net_conflict_warning
>
type InferredSourceInternalConnectionNetConflictWarning = z.infer<
  typeof source_internal_connection_net_conflict_warning
>

/**
 * Warning emitted when internally connected pins of a source component are wired to different nets, shorting those nets together
 */
export interface SourceInternalConnectionNetConflictWarning {
  type: "source_internal_connection_net_conflict_warning"
  source_internal_connection_net_conflict_warning_id: string
  warning_type: "source_internal_connection_net_conflict_warning"
  message: string
  source_component_id: string
  source_port_ids: string[]
  source_net_ids: string[]
  subcircuit_id?: string
}

expectTypesMatch<
  SourceInternalConnectionNetConflictWarning,
  InferredSourceInternalConnectionNetConflictWarning
>(true)
