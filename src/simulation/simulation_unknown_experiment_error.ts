import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_unknown_experiment_error = base_circuit_json_error
  .extend({
    type: z.literal("simulation_unknown_experiment_error"),
    simulation_unknown_experiment_error_id: getZodPrefixedIdWithDefault(
      "simulation_unknown_experiment_error",
    ),
    error_type: z
      .literal("simulation_unknown_experiment_error")
      .default("simulation_unknown_experiment_error"),
    simulation_experiment_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("An unknown error occurred during the simulation experiment.")

export type SimulationUnknownExperimentErrorInput = z.input<
  typeof simulation_unknown_experiment_error
>
type InferredSimulationUnknownExperimentError = z.infer<
  typeof simulation_unknown_experiment_error
>

/**
 * An unknown error occurred during the simulation experiment.
 */
export interface SimulationUnknownExperimentError extends BaseCircuitJsonError {
  type: "simulation_unknown_experiment_error"
  simulation_unknown_experiment_error_id: string
  error_type: "simulation_unknown_experiment_error"
  simulation_experiment_id?: string
  subcircuit_id?: string
}

expectTypesMatch<
  SimulationUnknownExperimentError,
  InferredSimulationUnknownExperimentError
>(true)
