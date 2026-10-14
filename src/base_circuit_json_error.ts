import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Identifies the completed local autorouting stage where a DRC was observed.
 * This is observation context, not a claim that the stage introduced the error.
 */
export const autorouting_phase = z.object({
  subcircuit_id: z.string(),
  routing_phase_index: z.number().int().nonnegative(),
  name: z.string().optional(),
  stage_index: z.number().int().nonnegative().optional(),
})

export type AutoroutingPhase = z.infer<typeof autorouting_phase>

export const base_circuit_json_error = z.object({
  error_type: z.string(),
  message: z.string(),
  is_fatal: z.boolean().optional(),
  autorouting_phase: autorouting_phase.optional(),
})

export type BaseCircuitJsonErrorInput = z.input<typeof base_circuit_json_error>
type InferredBaseCircuitJsonError = z.infer<typeof base_circuit_json_error>

export interface BaseCircuitJsonError {
  error_type: string
  message: string
  is_fatal?: boolean
  autorouting_phase?: AutoroutingPhase
}

expectTypesMatch<BaseCircuitJsonError, InferredBaseCircuitJsonError>(true)
