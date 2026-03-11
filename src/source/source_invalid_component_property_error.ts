import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_invalid_component_property_error = base_circuit_json_error
  .extend({
    type: z.literal("source_invalid_component_property_error"),
    source_invalid_component_property_error_id: getZodPrefixedIdWithDefault(
      "source_invalid_component_property_error",
    ),
    source_component_id: z.string(),
    property_name: z.string(),
    property_value: z.unknown().optional(),
    expected_format: z.string().optional(),
    subcircuit_id: z.string().optional(),
    error_type: z
      .literal("source_invalid_component_property_error")
      .default("source_invalid_component_property_error"),
  })
  .describe("The source component property is invalid")

export type SourceInvalidComponentPropertyErrorInput = z.input<
  typeof source_invalid_component_property_error
>
type InferredSourceInvalidComponentPropertyError = z.infer<
  typeof source_invalid_component_property_error
>

/**
 * The source component property is invalid
 */
export interface SourceInvalidComponentPropertyError
  extends BaseCircuitJsonError {
  type: "source_invalid_component_property_error"
  source_invalid_component_property_error_id: string
  source_component_id: string
  property_name: string
  property_value?: unknown
  expected_format?: string
  subcircuit_id?: string
  error_type: "source_invalid_component_property_error"
}

expectTypesMatch<
  SourceInvalidComponentPropertyError,
  InferredSourceInvalidComponentPropertyError
>(true)
