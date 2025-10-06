import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { duration_ms, ms } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const experiment_type = z.union([
  z.literal("spice_dc_sweep"),
  z.literal("spice_dc_operating_point"),
  z.literal("spice_transient_analysis"),
  z.literal("spice_ac_analysis"),
])

export type ExperimentType = z.infer<typeof experiment_type>

export interface SimulationExperiment {
  type: "simulation_experiment"
  simulation_experiment_id: string
  name: string
  experiment_type: ExperimentType
  time_per_step?: number // ms
  start_time_ms?: number // ms
  end_time_ms?: number // ms
}

export const simulation_experiment = z
  .object({
    type: z.literal("simulation_experiment"),
    simulation_experiment_id: getZodPrefixedIdWithDefault(
      "simulation_experiment",
    ),
    name: z.string(),
    experiment_type,
    time_per_step: duration_ms.optional(),
    start_time_ms: ms.optional(),
    end_time_ms: ms.optional(),
  })
  .describe("Defines a simulation experiment configuration")

export type SimulationExperimentInput = z.input<typeof simulation_experiment>
type InferredSimulationExperiment = z.infer<typeof simulation_experiment>

expectTypesMatch<SimulationExperiment, InferredSimulationExperiment>(true)
