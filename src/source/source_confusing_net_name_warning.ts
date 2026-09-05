import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_confusing_net_name_warning = z
  .object({
    type: z.literal("source_confusing_net_name_warning"),
    source_confusing_net_name_warning_id: getZodPrefixedIdWithDefault(
      "source_confusing_net_name_warning",
    ),
    warning_type: z
      .literal("source_confusing_net_name_warning")
      .default("source_confusing_net_name_warning"),
    message: z.string(),
    source_net_ids: z.array(z.string()).min(2),
    net_name: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when electrically disconnected source nets share a name",
  )

export type SourceConfusingNetNameWarningInput = z.input<
  typeof source_confusing_net_name_warning
>
type InferredSourceConfusingNetNameWarning = z.infer<
  typeof source_confusing_net_name_warning
>

/**
 * Warning emitted when electrically disconnected source nets share a name
 */
export interface SourceConfusingNetNameWarning {
  type: "source_confusing_net_name_warning"
  source_confusing_net_name_warning_id: string
  warning_type: "source_confusing_net_name_warning"
  message: string
  source_net_ids: string[]
  net_name: string
  subcircuit_id?: string
}

expectTypesMatch<
  SourceConfusingNetNameWarning,
  InferredSourceConfusingNetNameWarning
>(true)
