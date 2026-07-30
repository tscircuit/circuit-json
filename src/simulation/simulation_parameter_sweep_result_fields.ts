import { z } from "zod"
import {
  simulation_parameter_sweep_coordinate,
  type SimulationParameterSweepCoordinate,
} from "./simulation_parameter_sweep_coordinate"

export interface SimulationParameterSweepResultFields {
  simulation_parameter_sweep_coordinate?: SimulationParameterSweepCoordinate
  simulation_parameter_sweep_coordinates?: SimulationParameterSweepCoordinate[]
}

export const simulation_parameter_sweep_result_fields = {
  simulation_parameter_sweep_coordinate:
    simulation_parameter_sweep_coordinate.optional(),
  simulation_parameter_sweep_coordinates: z
    .array(simulation_parameter_sweep_coordinate)
    .min(2)
    .optional(),
}
