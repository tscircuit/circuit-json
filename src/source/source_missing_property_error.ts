import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_missing_property_error = z
  .object({
    type: z.literal("source_missing_property_error"),
    source_missing_property_error_id: getZodPrefixedIdWithDefault(
      "source_missing_property_error",
    ),
    source_component_id: z.string(),
    property_name: z.string(),
    error_type: z.literal("source_missing_property_error"),
    message: z.string(),
  })
  .describe("The source code is missing a property")

export type SourceMissingPropertyErrorInput = z.input<
  typeof source_missing_property_error
>
type InferredSourceMissingPropertyError = z.infer<
  typeof source_missing_property_error
>

/**
 * The source code is missing a property
 */
export interface SourceMissingPropertyError {
  type: "source_missing_property_error"
  source_missing_property_error_id: string
  source_component_id: string
  property_name: string
  error_type: "source_missing_property_error"
  message: string
}

expectTypesMatch<
  SourceMissingPropertyError,
  InferredSourceMissingPropertyError
>(true)
