import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_missing_property_error = base_circuit_json_error
  .extend({
    type: z.literal("source_missing_property_error"),
    source_missing_property_error_id: getZodPrefixedIdWithDefault(
      "source_missing_property_error",
    ),
    source_component_id: z.string(),
    property_name: z.string(),
    subcircuit_id: z.string().optional(),
    error_type: z
      .literal("source_missing_property_error")
      .default("source_missing_property_error"),
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
export interface SourceMissingPropertyError extends BaseCircuitJsonError {
  type: "source_missing_property_error"
  source_missing_property_error_id: string
  source_component_id: string
  property_name: string
  subcircuit_id?: string
  error_type: "source_missing_property_error"
}

expectTypesMatch<
  SourceMissingPropertyError,
  InferredSourceMissingPropertyError
>(true)
