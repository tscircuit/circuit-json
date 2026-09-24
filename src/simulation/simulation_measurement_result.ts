import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_parameter_sweep_coordinate,
  type SimulationParameterSweepCoordinate,
} from "./simulation_parameter_sweep_coordinate"

export interface SimulationMeasurementResult {
  type: "simulation_measurement_result"
  simulation_measurement_result_id: string
  simulation_experiment_id: string
  name: string
  measurement_values: number[]
  measurement_unit: string
  simulation_parameter_sweep_coordinate_sets?: SimulationParameterSweepCoordinate[][]
}

export const simulation_measurement_result = z
  .object({
    type: z.literal("simulation_measurement_result"),
    simulation_measurement_result_id: getZodPrefixedIdWithDefault(
      "simulation_measurement_result",
    ),
    simulation_experiment_id: z.string(),
    name: z.string().min(1),
    measurement_values: z.array(z.number().finite()).min(1),
    measurement_unit: z.string().min(1),
    simulation_parameter_sweep_coordinate_sets: z
      .array(z.array(simulation_parameter_sweep_coordinate).min(1))
      .min(1)
      .optional(),
  })
  .superRefine((result, context) => {
    const coordinateSets = result.simulation_parameter_sweep_coordinate_sets
    if (!coordinateSets) {
      if (result.measurement_values.length !== 1) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["measurement_values"],
          message:
            "A measurement result without parameter sweeps must contain exactly one value",
        })
      }
      return
    }

    if (coordinateSets.length !== result.measurement_values.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["simulation_parameter_sweep_coordinate_sets"],
        message:
          "measurement_values and simulation_parameter_sweep_coordinate_sets must have the same length",
      })
    }
  })
  .describe("Stores scalar measurements for a simulation experiment")

export type SimulationMeasurementResultInput = z.input<
  typeof simulation_measurement_result
>
type InferredSimulationMeasurementResult = z.infer<
  typeof simulation_measurement_result
>

expectTypesMatch<
  SimulationMeasurementResult,
  InferredSimulationMeasurementResult
>(true)
