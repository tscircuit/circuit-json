import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_property_ignored_warning = z
  .object({
    type: z.literal("source_property_ignored_warning"),
    source_property_ignored_warning_id: getZodPrefixedIdWithDefault(
      "source_property_ignored_warning",
    ),
    source_component_id: z.string(),
    property_name: z.string(),
    subcircuit_id: z.string().optional(),
    error_type: z
      .literal("source_property_ignored_warning")
      .default("source_property_ignored_warning"),
    message: z.string(),
  })
  .describe("The source property was ignored")

export type SourcePropertyIgnoredWarningInput = z.input<
  typeof source_property_ignored_warning
>
type InferredSourcePropertyIgnoredWarning = z.infer<
  typeof source_property_ignored_warning
>

/**
 * The source property was ignored
 */
export interface SourcePropertyIgnoredWarning {
  type: "source_property_ignored_warning"
  source_property_ignored_warning_id: string
  source_component_id: string
  property_name: string
  subcircuit_id?: string
  error_type: "source_property_ignored_warning"
  message: string
}

expectTypesMatch<
  SourcePropertyIgnoredWarning,
  InferredSourcePropertyIgnoredWarning
>(true)
