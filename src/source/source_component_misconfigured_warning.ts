import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_component_misconfigured_warning = z
  .object({
    type: z.literal("source_component_misconfigured_warning"),
    source_component_misconfigured_warning_id: getZodPrefixedIdWithDefault(
      "source_component_misconfigured_warning",
    ),
    warning_type: z
      .literal("source_component_misconfigured_warning")
      .default("source_component_misconfigured_warning"),
    message: z.string(),
    source_component_ids: z.array(z.string()),
    source_port_ids: z.array(z.string()).optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when one or more source components have a suspicious or conflicting configuration",
  )

export type SourceComponentMisconfiguredWarningInput = z.input<
  typeof source_component_misconfigured_warning
>
type InferredSourceComponentMisconfiguredWarning = z.infer<
  typeof source_component_misconfigured_warning
>

/**
 * Warning emitted when one or more source components have a suspicious or conflicting configuration
 */
export interface SourceComponentMisconfiguredWarning {
  type: "source_component_misconfigured_warning"
  source_component_misconfigured_warning_id: string
  warning_type: "source_component_misconfigured_warning"
  message: string
  source_component_ids: string[]
  source_port_ids?: string[]
  subcircuit_id?: string
}

expectTypesMatch<
  SourceComponentMisconfiguredWarning,
  InferredSourceComponentMisconfiguredWarning
>(true)
