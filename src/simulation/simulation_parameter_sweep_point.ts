import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  simulation_parameter_unit,
  type SimulationParameterUnit,
} from "./simulation_units"

export interface SimulationParameterSweepPoint {
  type: "simulation_parameter_sweep_point"
  simulation_parameter_sweep_point_id: string
  simulation_parameter_sweep_id: string
  sweep_index: number
  parameter_value: number
  parameter_unit: SimulationParameterUnit
}

export const simulation_parameter_sweep_point = z
  .object({
    type: z.literal("simulation_parameter_sweep_point"),
    simulation_parameter_sweep_point_id: getZodPrefixedIdWithDefault(
      "simulation_parameter_sweep_point",
    ),
    simulation_parameter_sweep_id: z.string(),
    sweep_index: z.number().int().nonnegative(),
    parameter_value: z.number(),
    parameter_unit: simulation_parameter_unit,
  })
  .describe("Identifies one coordinate in a simulation parameter sweep")

export type SimulationParameterSweepPointInput = z.input<
  typeof simulation_parameter_sweep_point
>
type InferredSimulationParameterSweepPoint = z.infer<
  typeof simulation_parameter_sweep_point
>

expectTypesMatch<
  SimulationParameterSweepPoint,
  InferredSimulationParameterSweepPoint
>(true)
