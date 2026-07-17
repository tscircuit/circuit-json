import { z } from "zod"
import { base_circuit_json_error } from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const simulation_experiment_error_code = z.enum([
  "non_convergent",
  "timeout",
  "missing_model",
  "unsupported_analysis",
  "invalid_netlist",
  "engine_error",
])

export type SimulationExperimentErrorCode = z.infer<
  typeof simulation_experiment_error_code
>

export const simulation_experiment_error = base_circuit_json_error
  .extend({
    type: z.literal("simulation_experiment_error"),
    simulation_experiment_error_id: getZodPrefixedIdWithDefault(
      "simulation_experiment_error",
    ),
    error_type: z
      .literal("simulation_experiment_error")
      .default("simulation_experiment_error"),
    simulation_experiment_id: z.string(),
    error_code: simulation_experiment_error_code,
    diagnostics: z.array(z.string()).optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("A classified simulation experiment failure")

export interface SimulationExperimentError {
  type: "simulation_experiment_error"
  simulation_experiment_error_id: string
  error_type: "simulation_experiment_error"
  simulation_experiment_id: string
  error_code: SimulationExperimentErrorCode
  message: string
  diagnostics?: string[]
  is_fatal?: boolean
  subcircuit_id?: string
}

export type SimulationExperimentErrorInput = z.input<
  typeof simulation_experiment_error
>

expectTypesMatch<
  SimulationExperimentError,
  z.infer<typeof simulation_experiment_error>
>(true)
