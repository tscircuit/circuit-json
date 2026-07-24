import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_parameter_unit,
  type SimulationParameterUnit,
} from "./simulation_units"

export interface SimulationParameterSweepCoordinate {
  simulation_parameter_sweep_id: string
  sweep_index: number
  parameter_value: number
  parameter_unit: SimulationParameterUnit
}

export const simulation_parameter_sweep_coordinate = z.object({
  simulation_parameter_sweep_id: z.string(),
  sweep_index: z.number().int().nonnegative(),
  parameter_value: z.number(),
  parameter_unit: simulation_parameter_unit,
})

expectTypesMatch<
  SimulationParameterSweepCoordinate,
  z.infer<typeof simulation_parameter_sweep_coordinate>
>(true)
