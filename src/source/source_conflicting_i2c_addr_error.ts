import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_conflicting_i2c_addr_error = base_circuit_json_error
  .extend({
    type: z.literal("source_conflicting_i2c_addr_error"),
    source_conflicting_i2c_addr_error_id: getZodPrefixedIdWithDefault(
      "source_conflicting_i2c_addr_error",
    ),
    error_type: z
      .literal("source_conflicting_i2c_addr_error")
      .default("source_conflicting_i2c_addr_error"),
    source_component_ids: z.array(z.string()),
    source_port_ids: z.array(z.string()).optional(),
  })
  .describe(
    "Error emitted when two I2C components on the same bus resolve to the same address",
  )

export type SourceConflictingI2cAddrErrorInput = z.input<
  typeof source_conflicting_i2c_addr_error
>
type InferredSourceConflictingI2cAddrError = z.infer<
  typeof source_conflicting_i2c_addr_error
>

/**
 * Error emitted when two I2C components on the same bus resolve to the same address
 */
export interface SourceConflictingI2cAddrError extends BaseCircuitJsonError {
  type: "source_conflicting_i2c_addr_error"
  source_conflicting_i2c_addr_error_id: string
  error_type: "source_conflicting_i2c_addr_error"
  source_component_ids: string[]
  source_port_ids?: string[]
}

expectTypesMatch<
  SourceConflictingI2cAddrError,
  InferredSourceConflictingI2cAddrError
>(true)
