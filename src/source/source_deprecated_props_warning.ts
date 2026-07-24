import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_deprecated_props_warning = z
  .object({
    type: z.literal("source_deprecated_props_warning"),
    source_deprecated_props_warning_id: getZodPrefixedIdWithDefault(
      "source_deprecated_props_warning",
    ),
    source_component_id: z.string().optional(),
    source_group_id: z.string().optional(),
    prop_name: z.string(),
    subcircuit_id: z.string().optional(),
    error_type: z
      .literal("source_deprecated_props_warning")
      .default("source_deprecated_props_warning"),
    message: z.string(),
  })
  .describe("A deprecated prop was passed to a source component or group")

export type SourceDeprecatedPropsWarningInput = z.input<
  typeof source_deprecated_props_warning
>
type InferredSourceDeprecatedPropsWarning = z.infer<
  typeof source_deprecated_props_warning
>

/**
 * A deprecated prop was passed to a source component or group
 */
export interface SourceDeprecatedPropsWarning {
  type: "source_deprecated_props_warning"
  source_deprecated_props_warning_id: string
  source_component_id?: string
  source_group_id?: string
  prop_name: string
  subcircuit_id?: string
  error_type: "source_deprecated_props_warning"
  message: string
}

expectTypesMatch<
  SourceDeprecatedPropsWarning,
  InferredSourceDeprecatedPropsWarning
>(true)
