import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const base_circuit_json_error = z.object({
  error_type: z.string(),
  message: z.string(),
  is_fatal: z.boolean().optional(),
})

export type BaseCircuitJsonErrorInput = z.input<typeof base_circuit_json_error>
type InferredBaseCircuitJsonError = z.infer<typeof base_circuit_json_error>

export interface BaseCircuitJsonError {
  error_type: string
  message: string
  is_fatal?: boolean
}

expectTypesMatch<BaseCircuitJsonError, InferredBaseCircuitJsonError>(true)
