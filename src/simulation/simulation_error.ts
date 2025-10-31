import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_error = z
  .object({
    type: z.literal("simulation_error"),
    simulation_error_id: getZodPrefixedIdWithDefault("simulation_error"),
    error_type: z.literal("simulation_error").default("simulation_error"),
    message: z.string(),
    simulation_experiment_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("An error that occurred during simulation")

export type SimulationErrorInput = z.input<typeof simulation_error>
type InferredSimulationError = z.infer<typeof simulation_error>

/**
 * An error that occurred during simulation.
 */
export interface SimulationError {
  type: "simulation_error"
  simulation_error_id: string
  error_type: "simulation_error"
  message: string
  simulation_experiment_id?: string
  subcircuit_id?: string
}

expectTypesMatch<SimulationError, InferredSimulationError>(true)
