import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_parameter_sweep_coordinates,
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
    name: z.string(),
    measurement_values: z.array(z.number().finite()),
    measurement_unit: z.string(),
    simulation_parameter_sweep_coordinate_sets: z
      .array(simulation_parameter_sweep_coordinates)
      .optional(),
  })
  .refine(
    (result) =>
      result.simulation_parameter_sweep_coordinate_sets === undefined ||
      result.simulation_parameter_sweep_coordinate_sets.length ===
        result.measurement_values.length,
    {
      message:
        "measurement_values and simulation_parameter_sweep_coordinate_sets must have the same length",
    },
  )

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
