import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_parameter_sweep_coordinate,
  type SimulationParameterSweepCoordinate,
} from "./simulation_parameter_sweep_coordinate"

export interface SimulationDcOperatingPointCurrent {
  type: "simulation_dc_operating_point_current"
  simulation_dc_operating_point_current_id: string
  simulation_experiment_id: string
  simulation_parameter_sweep_coordinate?: SimulationParameterSweepCoordinate
  simulation_current_probe_id: string
  current: number
  name?: string
  color?: string
}

export const simulation_dc_operating_point_current = z.object({
  type: z.literal("simulation_dc_operating_point_current"),
  simulation_dc_operating_point_current_id: getZodPrefixedIdWithDefault(
    "simulation_dc_operating_point_current",
  ),
  simulation_experiment_id: z.string(),
  simulation_parameter_sweep_coordinate:
    simulation_parameter_sweep_coordinate.optional(),
  simulation_current_probe_id: z.string(),
  current: z.number(),
  name: z.string().optional(),
  color: z.string().optional(),
})

export type SimulationDcOperatingPointCurrentInput = z.input<
  typeof simulation_dc_operating_point_current
>
type InferredSimulationDcOperatingPointCurrent = z.infer<
  typeof simulation_dc_operating_point_current
>

expectTypesMatch<
  SimulationDcOperatingPointCurrent,
  InferredSimulationDcOperatingPointCurrent
>(true)
